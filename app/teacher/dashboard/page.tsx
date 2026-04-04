"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabaseClient";
import { 
  Users, 
  BookOpen, 
  CheckSquare, 
  TrendingUp, 
  Clock, 
  Calendar,
  ChevronRight,
  ArrowUpRight,
  Target
} from "lucide-react";
import { motion } from "framer-motion";

export default function TeacherDashboard() {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [myCourses, setMyCourses] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTeacherStats() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch my courses
      const { data: courses } = await supabase
        .from("courses")
        .select("*, enrollments(count)")
        .eq("instructor_id", user.id);
      
      if (courses) {
        setMyCourses(courses);
        const totalStudents = courses.reduce((acc, c) => acc + (c.enrollments?.[0]?.count || 0), 0);
        
        setStats({
          courses_count: courses.length,
          students_count: totalStudents,
          active_exams: 12, // Mock fallback
          avg_score: "84%"
        });
      }
      setLoading(false);
    }
    fetchTeacherStats();
  }, []);

  const instructorStats = [
    { label: "مشاركاتي", value: stats.courses_count || 0, icon: <BookOpen size={20} />, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "طلابـي", value: stats.students_count || 0, icon: <Users size={20} />, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "الاختبارات", value: stats.active_exams || 0, icon: <CheckSquare size={20} />, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "متوسط الدرجات", value: stats.avg_score || "0%", icon: <Target size={20} />, color: "text-orange-400", bg: "bg-orange-500/10" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-12 pb-20">
        
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-extrabold text-white mb-2">لوحة المعلم</h1>
                <p className="text-slate-500 text-sm">مرحباً بك مجدداً دكتور، إليك ملخص لأداء دوراتك.</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="glass px-4 py-2 flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Calendar size={14} />
                    <span>آخر 30 يوم</span>
                </div>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {instructorStats.map((stat, i) => (
                <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-6 border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-all"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                            {stat.icon}
                        </div>
                        <ArrowUpRight size={18} className="text-slate-800 transition-colors group-hover:text-white" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold mb-1 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 blur-3xl rounded-full" />
                </motion.div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Courses List */}
            <div className="lg:col-span-2 glass p-8 border-white/5">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <BookOpen size={18} className="text-purple-400" />
                        دوراتي الحالية
                    </h3>
                    <button className="text-xs text-purple-400 font-bold hover:underline">عرض الكل</button>
                </div>
                
                <div className="space-y-4">
                    {myCourses.length > 0 ? myCourses.slice(0, 4).map((course, i) => (
                        <div key={course.id} className="flex items-center gap-6 p-4 rounded-2xl glass hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group">
                            <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-white/5">
                                <img src={course.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-white font-bold text-sm truncate">{course.title}</h4>
                                <p className="text-[10px] text-slate-500 mt-0.5">{course.category || "عام"}</p>
                            </div>
                            <div className="flex items-center gap-6 px-6 border-r border-white/5">
                                <div className="text-center">
                                    <p className="text-[9px] text-slate-600 font-bold uppercase mb-0.5">طالب</p>
                                    <p className="text-xs font-black text-white">{course.enrollments?.[0]?.count || 0}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] text-slate-600 font-bold uppercase mb-0.5">التقييم</p>
                                    <p className="text-xs font-black text-yellow-500">4.9</p>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-700 group-hover:text-white transition-colors" />
                        </div>
                    )) : (
                        <p className="text-slate-600 text-sm text-center py-10">لم تقم بإضافة أي دورات بعد</p>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
                <div className="glass p-8 border-white/5">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-green-400" />
                        إجراءات سريعة
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                        <button className="w-full py-4 rounded-xl premium-gradient text-white font-bold text-sm shadow-lg shadow-purple-900/40 hover:brightness-110 active:scale-95 transition-all">
                            إضافة درس جديد
                        </button>
                        <button className="w-full py-4 rounded-xl glass border-purple-500/20 text-purple-400 font-bold text-sm hover:bg-white/5 transition-all">
                            إنشاء اختبار سريع
                        </button>
                    </div>
                </div>

                <div className="glass p-8 border-white/5">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2 text-sm italic">
                        <Clock size={16} className="text-slate-500" />
                        أحدث التنبيهات
                    </h3>
                    <div className="space-y-4">
                        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                            <p className="text-[10px] text-blue-400 font-bold mb-1">تنبيه النظام</p>
                            <p className="text-xs text-slate-400 leading-relaxed">تمت إضافة 5 طلاب جدد لدورة "الفيزياء المتقدمة" اليوم.</p>
                        </div>
                        <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10">
                            <p className="text-[10px] text-purple-400 font-bold mb-1">تقييم جديد</p>
                            <p className="text-xs text-slate-400 leading-relaxed">كتب الطالب محمد تقييماً إيجابياً لدورتك الأخيرة.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </AdminLayout>
  );
}
