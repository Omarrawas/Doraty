"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabaseClient";
import { 
  Plus, 
  Search, 
  HelpCircle, 
  Clock, 
  MoreVertical, 
  Edit, 
  Trash2, 
  BookOpen, 
  Target,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";

export default function TeacherExams() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchExams() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch exams for courses owned by this teacher
      const { data: examsData } = await supabase
        .from("exams")
        .select("*, courses(*)")
        .eq("courses.instructor_id", user.id);
      
      if (examsData) setExams(examsData);
      setLoading(false);
    }
    fetchExams();
  }, []);

  const filteredExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.courses?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 font-cairo">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 font-cairo">
            <div>
                <h1 className="text-3xl font-extrabold text-white mb-2">إدارة الاختبارات</h1>
                <p className="text-slate-500 text-sm">أنشئ وقم بإدارة الاختبارات التقيمية لطلابك.</p>
            </div>
            <button className="flex items-center gap-2 px-8 py-4 premium-gradient rounded-2xl text-white font-bold shadow-lg shadow-purple-900/40 hover:brightness-110 active:scale-95 transition-all">
                <Plus size={20} />
                <span>إنشاء اختبار جديد</span>
            </button>
        </div>

        {/* Search */}
        <div className="relative">
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث باسم الاختبار أو الدورة..."
                className="w-full glass py-5 pr-14 pl-8 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600 font-bold"
            />
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
                Array(6).fill(0).map((_, i) => (
                    <div key={i} className="h-64 glass animate-pulse border-white/5" />
                ))
            ) : filteredExams.length > 0 ? filteredExams.map((exam, i) => (
                <motion.div 
                    key={exam.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass p-8 border-white/5 hover:border-purple-500/20 transition-all group relative overflow-hidden"
                >
                    <div className="flex items-start justify-between mb-8">
                        <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-purple-400 bg-white/5 border-purple-500/10 transition-colors group-hover:bg-purple-500/10">
                            <HelpCircle size={28} />
                        </div>
                        <button className="p-2 text-slate-700 hover:text-white transition-colors"><MoreVertical size={20} /></button>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-white font-bold text-lg mb-2 leading-tight px-2">{exam.title}</h3>
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold px-2 uppercase truncate">
                            <BookOpen size={12} className="text-purple-400" />
                            <span>{exam.courses?.title || "دورة عامة"}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="glass p-3 border-white/5">
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">الأسئلة</p>
                            <div className="flex items-center gap-2 text-white font-bold">
                                <FileText size={14} className="text-blue-400" />
                                <span>{exam.questions_count || 0} سؤال</span>
                            </div>
                        </div>
                        <div className="glass p-3 border-white/5">
                            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">المدة</p>
                            <div className="flex items-center gap-2 text-white font-bold">
                                <Clock size={14} className="text-orange-400" />
                                <span>{exam.duration || 60} دقيقة</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex-1 py-3 px-4 glass rounded-xl text-[10px] font-black text-slate-500 hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                             إدارة الأسئلة
                        </button>
                        <button className="p-3 glass rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                            <Edit size={16} />
                        </button>
                        <button className="p-3 glass rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                            <Trash2 size={16} />
                        </button>
                    </div>
                    
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-purple-500 opacity-20 transition-all group-hover:opacity-100" />
                </motion.div>
            )) : (
                <div className="col-span-full py-32 text-center glass border-white/5">
                    <Target size={48} className="text-slate-700 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">لا توجد اختبارات متاحة</h3>
                    <p className="text-slate-500">ابدأ بإضافة أول اختبار تقييمي لدوراتك التدريبية.</p>
                </div>
            )}
        </div>

      </div>
    </AdminLayout>
  );
}
