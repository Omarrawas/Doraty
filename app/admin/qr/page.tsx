"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabaseClient";
import { 
  Plus, 
  Search, 
  QrCode, 
  Download, 
  Trash2, 
  CheckCircle2, 
  XCircle,
  Copy,
  Layout,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminQR() {
  const [codes, setCodes] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);
  
  const [genData, setGenData] = useState({
    course_id: "",
    count: 10,
  });

  useEffect(() => {
    async function fetchData() {
        const { data: qrData } = await supabase.from("qr_codes").select("*, courses(title)").order("created_at", { ascending: false });
        const { data: courseData } = await supabase.from("courses").select("id, title");
        if (qrData) setCodes(qrData);
        if (courseData) setCourses(courseData);
        setLoading(false);
    }
    fetchData();
  }, []);

  const generateCodes = async () => {
    if (!genData.course_id) return alert("يرجى اختيار الكورس");
    
    const newCodes = Array.from({ length: genData.count }).map(() => ({
        course_id: genData.course_id,
        code: Math.random().toString(36).substring(2, 12).toUpperCase(),
        is_used: false
    }));

    const { data } = await supabase.from("qr_codes").insert(newCodes).select("*, courses(title)");
    if (data) {
        setCodes([...data, ...codes]);
        setShowGenerator(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 font-cairo">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight">إدارة أكواد التفعيل</h1>
                <p className="text-slate-500 text-sm">توليد وإدارة بطاقات التفعيل الفيزيائية للدورات.</p>
            </div>
            <button 
                onClick={() => setShowGenerator(true)}
                className="flex items-center gap-2 px-8 py-4 premium-gradient rounded-2xl text-white font-bold shadow-lg shadow-purple-900/40 hover:scale-105 transition-all"
            >
                <Plus size={20} />
                <span>توليد أكواد جديدة</span>
            </button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { label: "إجمالي الأكواد", val: codes.length, icon: <QrCode />, color: "text-blue-400" },
                { label: "أكواد مستخدمة", val: codes.filter(c => c.is_used).length, icon: <CheckCircle2 />, color: "text-green-400" },
                { label: "أكواد متاحة", val: codes.filter(c => !c.is_used).length, icon: <Zap />, color: "text-yellow-400" },
            ].map((s, i) => (
                <div key={i} className="glass p-6 border-white/5 flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl bg-white/[0.02] flex items-center justify-center ${s.color}`}>
                        {s.icon}
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-loose">{s.label}</p>
                        <h4 className="text-2xl font-black text-white">{s.val}</h4>
                    </div>
                </div>
            ))}
        </div>

        {/* List */}
        <div className="glass border-white/5 overflow-hidden">
            <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                <h3 className="text-white font-bold text-sm">سجل الأكواد الأخير</h3>
                <div className="relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700" size={16} />
                    <input className="glass py-2 pr-10 pl-4 text-xs text-white outline-none focus:ring-1 focus:ring-purple-500 rounded-lg" placeholder="بحث عن كود..." />
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="px-8 py-5 text-[10px] text-slate-600 font-bold uppercase tracking-widest">الكود</th>
                            <th className="px-8 py-5 text-[10px] text-slate-600 font-bold uppercase tracking-widest">الدورة</th>
                            <th className="px-8 py-5 text-[10px] text-slate-600 font-bold uppercase tracking-widest">الحالة</th>
                            <th className="px-8 py-5 text-[10px] text-slate-600 font-bold uppercase tracking-widest">تاريخ الإنشاء</th>
                            <th className="px-8 py-5 text-[10px] text-slate-600 font-bold uppercase tracking-widest text-center">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {codes.map((c) => (
                            <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.01] transition-all group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-black tracking-widest font-mono text-sm">{c.code}</span>
                                        <button className="text-slate-800 hover:text-white transition-colors opacity-0 group-hover:opacity-100"><Copy size={14} /></button>
                                    </div>
                                </td>
                                <td className="px-8 py-5 font-bold text-slate-400 text-sm">{c.courses?.title}</td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                        c.is_used ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-400"
                                    }`}>
                                        {c.is_used ? "مستخدم" : "متاح"}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-slate-600 text-xs font-bold">{new Date(c.created_at).toLocaleDateString("ar-EG")}</td>
                                <td className="px-8 py-5 text-center">
                                    <button className="text-red-400/50 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Generator Modal Overlay */}
        <AnimatePresence>
            {showGenerator && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 pb-20">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowGenerator(false)}
                        className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass border-white/10 w-full max-w-xl p-10 relative z-10 shadow-2xl space-y-8"
                    >
                        <div>
                            <h2 className="text-2xl font-black text-white mb-2">توليد دفعة أكواد جديدة</h2>
                            <p className="text-slate-500 text-sm font-medium">سيتم إنشاء أكواد عشوائية فريدة مرتبطة بالكتاب المختار.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] text-slate-600 font-bold mb-2 block uppercase tracking-widest">الدورة المستهدفة</label>
                                <select 
                                    className="w-full glass p-4 text-white outline-none focus:ring-1 focus:ring-purple-500 font-bold"
                                    value={genData.course_id}
                                    onChange={(e) => setGenData({...genData, course_id: e.target.value})}
                                >
                                    <option value="" className="bg-[#0f172a]">اختر الدورة...</option>
                                    {courses.map(c => <option key={c.id} value={c.id} className="bg-[#0f172a]">{c.title}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-600 font-bold mb-2 block uppercase tracking-widest">عدد الأكواد المطلوب توليدها</label>
                                <input 
                                    type="number"
                                    className="w-full glass p-4 text-white outline-none focus:ring-1 focus:ring-purple-500 font-black text-xl"
                                    value={genData.count}
                                    onChange={(e) => setGenData({...genData, count: parseInt(e.target.value)})}
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button 
                                onClick={generateCodes}
                                className="flex-1 py-4 premium-gradient rounded-2xl text-white font-black shadow-xl shadow-purple-900/40 hover:scale-[1.02] transition-all"
                            >
                                توليد الآن
                            </button>
                            <button 
                                onClick={() => setShowGenerator(false)}
                                className="flex-1 py-4 glass border-white/5 rounded-2xl text-slate-500 font-bold"
                            >
                                إلغاء
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
}
