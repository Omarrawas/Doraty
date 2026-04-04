"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabaseClient";
import { 
  UserCheck, 
  UserPlus, 
  Trash2, 
  Mail, 
  GraduationCap, 
  Users, 
  ArrowUpRight,
  ShieldCheck,
  UserX,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // active, requests

  useEffect(() => {
    async function fetchData() {
      // 1. Fetch active teachers
      const { data: teacherData } = await supabase
        .from("users")
        .select("*, courses(id)")
        .eq("role", "teacher");
      
      if (teacherData) {
        setTeachers(teacherData.map(t => ({
          ...t,
          courses_count: t.courses?.length || 0
        })));
      }

      // 2. Fetch pending teacher requests (mock for now if no table)
      const { data: requestData } = await supabase
        .from("teacher_requests") // Assuming this table exists based on Flutter code
        .select("*")
        .eq("status", "pending");
      
      if (requestData) setRequests(requestData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleApprove = async (id: string, userId: string) => {
    await supabase.from("teacher_requests").update({ status: "approved" }).eq("id", id);
    await supabase.from("users").update({ role: "teacher" }).eq("id", userId);
    setRequests(requests.filter(r => r.id !== id));
    // Re-fetch teachers
  };

  const handleReject = async (id: string) => {
    await supabase.from("teacher_requests").update({ status: "rejected" }).eq("id", id);
    setRequests(requests.filter(r => r.id !== id));
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 font-cairo">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-3xl font-extrabold text-white mb-2">شؤون المدرسين</h1>
                <p className="text-slate-500 text-sm">إدارة الكادر التعليمي وطلبات الانضمام للمنصة.</p>
            </div>
            <div className="glass p-2 flex items-center gap-2">
                <button 
                  onClick={() => setActiveTab("active")}
                  className={`px-8 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === "active" ? "premium-gradient text-white shadow-lg shadow-purple-900/40" : "text-slate-500 hover:text-white"
                  }`}
                >
                    <UserCheck size={18} />
                    <span>المدربون الحاليون</span>
                </button>
                <button 
                  onClick={() => setActiveTab("requests")}
                  className={`px-8 py-3 rounded-xl text-sm font-bold transition-all relative flex items-center gap-2 ${
                    activeTab === "requests" ? "premium-gradient text-white shadow-lg shadow-purple-900/40" : "text-slate-500 hover:text-white"
                  }`}
                >
                    <UserPlus size={18} />
                    <span>طلبات الانتظار</span>
                    {requests.length > 0 && <div className="absolute -top-1 -left-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-lg animate-pulse">{requests.length}</div>}
                </button>
            </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === "active" ? (
            <motion.div 
              key="active-list"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-64 glass animate-pulse border-white/5" />
                ))
              ) : teachers.length > 0 ? teachers.map((teacher, i) => (
                <div key={teacher.id} className="glass p-6 border-white/5 group hover:border-purple-500/20 transition-all overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-1 premium-gradient opacity-50 transition-opacity group-hover:opacity-100" />
                    
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden premium-gradient p-[1px] shrink-0 transform group-hover:rotate-6 transition-transform">
                            <div className="w-full h-full rounded-2xl bg-[#0f172a] flex items-center justify-center overflow-hidden">
                                <img src={teacher.avatar_url || "/person.jpg"} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg mb-1 truncate">{teacher.full_name}</h3>
                            <div className="flex items-center gap-2 text-slate-500 text-xs truncate">
                                <Mail size={12} className="text-purple-400" />
                                <span>{teacher.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="glass p-3 border-white/5">
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">عدد الكورسات</p>
                            <div className="flex items-center gap-2 text-white font-bold">
                                <GraduationCap size={14} className="text-purple-400" />
                                <span>{teacher.courses_count}</span>
                            </div>
                        </div>
                        <div className="glass p-3 border-white/5">
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">الطلاب المسجلين</p>
                            <div className="flex items-center gap-2 text-white font-bold">
                                <Users size={14} className="text-green-400" />
                                <span>0</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex-1 py-3 px-4 glass rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2">
                             ملخص الأداء
                             <ArrowUpRight size={14} />
                        </button>
                        <button className="p-3 glass rounded-xl text-red-400 hover:bg-red-500/10 transition-all" title="إلغاء صلاحية المدرس">
                            <UserX size={18} />
                        </button>
                    </div>
                </div>
              )) : (
                <div className="col-span-full py-20 text-center glass border-white/5">
                    <p className="text-slate-500">لا يوجد مدرسين مسجلين حالياً</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="requests-list"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-4"
            >
              {requests.length > 0 ? requests.map((req, i) => (
                <div key={req.id} className="glass p-6 border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                        <div className="w-14 h-14 rounded-full glass shrink-0 flex items-center justify-center text-slate-400 bg-white/5 group-hover:text-purple-400 transition-colors">
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-lg">{req.full_name} <span className="text-xs text-slate-500 mr-2 font-normal">({req.specialization})</span></h4>
                            <p className="text-slate-400 text-sm mb-2">{req.bio || "لا توجد نبذة تعريفية مرفقة لهذا الطلب."}</p>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase">
                                    <Mail size={12} className="text-purple-400" />
                                    <span>{req.email || "بدون بريد"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase">
                                    <FileText size={12} className="text-blue-400" />
                                    <span className="cursor-pointer hover:underline">السيرة الذاتية</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <button 
                          onClick={() => handleApprove(req.id, req.user_id)}
                          className="px-6 py-3 premium-gradient rounded-xl text-white font-bold text-sm shadow-lg shadow-purple-900/40 flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all"
                        >
                            <ShieldCheck size={18} />
                            الموافقة والترقية
                        </button>
                        <button 
                          onClick={() => handleReject(req.id)}
                          className="p-3 glass rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-bold" title="رفض الطلب"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
              )) : (
                <div className="glass p-20 text-center border-white/5">
                    <ShieldCheck size={48} className="text-slate-700 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">لا توجد طلبات معلقة</h3>
                    <p className="text-slate-500">سيتم عرض أي طلبات انضمام جديدة للمدرسين هنا للمراجعة.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
}
