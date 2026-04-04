"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Settings, 
  Shield, 
  ChevronLeft, 
  Camera, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Globe, 
  Phone,
  CheckCircle2,
  AlertCircle,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function ProfileSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Fetch user record for metadata
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        if (userData) setProfile(userData);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleUpdateProfile = async (updates: any) => {
    setSaving(true);
    const { error } = await supabase.from("users").update(updates).eq("id", user.id);
    if (!error) {
        setProfile({ ...profile, ...updates });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#0f172a] pt-40 pb-20 px-6 font-cairo">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
            
            {/* Sidebar */}
            <div className="w-full md:w-80 shrink-0">
                <div className="glass p-8 border-white/5 rounded-[2.5rem] sticky top-32 space-y-2">
                    <h2 className="text-white font-black text-xs uppercase tracking-widest px-4 mb-6">إعدادات الحساب</h2>
                    
                    <button 
                        onClick={() => setActiveTab("personal")}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold ${
                            activeTab === "personal" ? "premium-gradient text-white shadow-xl shadow-purple-900/40" : "text-slate-500 hover:text-white"
                        }`}
                    >
                        <User size={20} />
                        <span>المعلومات الشخصية</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab("security")}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold ${
                            activeTab === "security" ? "premium-gradient text-white shadow-xl shadow-purple-900/40" : "text-slate-500 hover:text-white"
                        }`}
                    >
                        <Shield size={20} />
                        <span>الأمان والخصوصية</span>
                    </button>

                    <div className="pt-8 mt-8 border-t border-white/5">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-bold"
                        >
                            <LogOut size={20} />
                            <span>تسجيل الخروج</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1">
                <AnimatePresence mode="wait">
                    {activeTab === "personal" ? (
                        <motion.div 
                            key="personal"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="glass p-12 border-white/5 rounded-[3.5rem] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 blur-[100px] rounded-full" />
                                
                                <div className="flex flex-col md:flex-row items-center gap-10 relative mb-12">
                                    <div className="relative group">
                                        <div className="w-32 h-32 rounded-[2.5rem] premium-gradient p-[2px] shadow-2xl">
                                            <div className="w-full h-full rounded-[2.5rem] bg-[#1e293b] flex items-center justify-center overflow-hidden">
                                                <img src={profile?.avatar_url || "/person.jpg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            </div>
                                        </div>
                                        <button className="absolute -bottom-2 -left-2 w-10 h-10 premium-gradient text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                            <Camera size={18} />
                                        </button>
                                    </div>
                                    
                                    <div className="text-center md:text-right">
                                        <h1 className="text-4xl font-black text-white mb-2">{profile?.full_name}</h1>
                                        <p className="text-slate-500 font-bold">{user?.email}</p>
                                        <div className="mt-4 inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full border-white/5 text-[10px] font-black uppercase tracking-widest text-purple-400">
                                            <Briefcase size={12} />
                                            <span>{profile?.role === "teacher" ? "مدرب معتمد" : "طالب طموح"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-4">الاسم الكامل</label>
                                        <div className="relative">
                                            <User className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                            <input 
                                                type="text" 
                                                defaultValue={profile?.full_name}
                                                onBlur={(e) => handleUpdateProfile({ full_name: e.target.value })}
                                                className="w-full py-4 pr-14 pl-6 glass border-white/5 rounded-2xl text-white font-bold focus:border-purple-500/30 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-4">رقم الهاتف</label>
                                        <div className="relative">
                                            <Phone className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                            <input 
                                                type="text" 
                                                defaultValue={profile?.phone_number || "+963 "}
                                                className="w-full py-4 pr-14 pl-6 glass border-white/5 rounded-2xl text-white font-bold focus:border-purple-500/30 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {profile?.role === "student" && (
                                        <>
                                            <div className="space-y-3">
                                                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-4">المسار التعليمي</label>
                                                <div className="relative">
                                                    <GraduationCap className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                                    <select className="w-full py-4 pr-14 pl-6 glass border-white/5 rounded-2xl text-white font-bold focus:border-purple-500/30 outline-none transition-all appearance-none">
                                                        <option>ثانوي (بكالوريا)</option>
                                                        <option>جامعي</option>
                                                        <option>تعليم حر</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-4">الاختصاص / السنة الدراسية</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="مثلاً: هندسة معلوماتية - سنة ثالثة"
                                                    className="w-full py-4 px-6 glass border-white/5 rounded-2xl text-white font-bold focus:border-purple-500/30 outline-none transition-all"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {profile?.role === "teacher" && (
                                        <div className="col-span-full space-y-3">
                                            <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-4">النبذة الشخصية (Bio)</label>
                                            <textarea 
                                                defaultValue={profile?.bio}
                                                className="w-full h-32 py-6 px-8 glass border-white/5 rounded-3xl text-white font-bold focus:border-purple-500/30 outline-none transition-all resize-none"
                                            />
                                        </div>
                                    )}
                                </div>

                                <AnimatePresence>
                                    {success && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="mt-8 flex items-center gap-3 text-green-400 bg-green-500/5 p-4 rounded-2xl border border-green-500/20 text-sm font-bold"
                                        >
                                            <CheckCircle2 size={18} />
                                            <span>تم تحديث الملف الشخصي بنجاح</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="security"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                             <div className="glass p-12 border-white/5 rounded-[3.5rem] space-y-12">
                                <div>
                                    <h2 className="text-3xl font-black text-white mb-4">أمان الحساب</h2>
                                    <p className="text-slate-500 font-bold">قم بتحديث كلمة المرور الخاصة بك وإدارة إعدادات الأمان.</p>
                                </div>

                                <div className="space-y-8 max-w-xl">
                                    <div className="space-y-3">
                                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-4">البريد الإلكتروني</label>
                                        <div className="relative">
                                            <Mail className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-800" size={18} />
                                            <input 
                                                type="email" 
                                                disabled 
                                                value={user?.email}
                                                className="w-full py-4 pr-14 pl-6 glass border-white/5 rounded-2xl text-slate-600 font-bold opacity-50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-4">كلمة المرور الجديدة</label>
                                        <div className="relative">
                                            <Shield className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                            <input 
                                                type="password" 
                                                placeholder="أدخل كلمة مرور قوية"
                                                className="w-full py-4 pr-14 pl-6 glass border-white/5 rounded-2xl text-white font-bold focus:border-purple-500/30 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    
                                    <button className="px-10 py-4 premium-gradient text-white rounded-2xl font-black text-sm shadow-xl shadow-purple-900/40 hover:scale-105 transition-all">
                                        تحديث كلمة المرور
                                    </button>
                                </div>

                                <div className="pt-12 border-t border-white/5 flex gap-6 items-start bg-red-500/5 p-8 rounded-3xl border border-red-500/10">
                                    <AlertCircle className="text-red-500 shrink-0" size={24} />
                                    <div>
                                        <h4 className="text-white font-bold mb-2">منطقة الخطر</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6">حذف حسابك سيؤدي إلى فقدان إمكانية الوصول إلى كافة الدورات والشهادات بشكل نهائي.</p>
                                        <button className="text-red-500 font-black text-xs uppercase tracking-widest hover:underline">طلب حذف الحساب</button>
                                    </div>
                                </div>
                             </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
      </div>
    </div>
  );
}
