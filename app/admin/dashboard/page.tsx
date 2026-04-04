"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabaseClient";
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  Activity,
  ArrowDownRight,
  Clock,
  User as UserIcon,
  HelpCircle,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>({});
  const [recentAttempts, setRecentAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      // 1. Fetch system stats
      const { data: usersCount } = await supabase.from("users").select("id", { count: "exact" });
      const { data: coursesCount } = await supabase.from("courses").select("id", { count: "exact" });
      const { data: enrollmentsCount } = await supabase.from("enrollments").select("id", { count: "exact" });
      
      setStats({
        total_users: usersCount?.length || 0,
        total_courses: coursesCount?.length || 0,
        total_enrollments: enrollmentsCount?.length || 0,
        total_revenue: 1250000, // Mock revenue logic
        growth_rate: "+12.5%"
      });

      // 2. Fetch recent exam attempts
      const { data: attempts } = await supabase
        .from("exam_submissions")
        .select("*, users(*), exams(*)")
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (attempts) setRecentAttempts(attempts);
      setLoading(false);
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: "إجمالي الطلاب", value: stats.total_users, icon: <Users size={20} />, color: "text-blue-400", bg: "bg-blue-500/10", trend: "+5.2%", isUp: true },
    { label: "الدورات النشطة", value: stats.total_courses, icon: <BookOpen size={20} />, color: "text-purple-400", bg: "bg-purple-500/10", trend: "+2", isUp: true },
    { label: "إجمالي الاشتراكات", value: stats.total_enrollments, icon: <Activity size={20} />, color: "text-green-400", bg: "bg-green-500/10", trend: "+12.5%", isUp: true },
    { label: "إجمالي الإيرادات", value: `${stats.total_revenue?.toLocaleString()} ل.س`, icon: <CreditCard size={20} />, color: "text-yellow-400", bg: "bg-yellow-500/10", trend: "-2.1%", isUp: false },
  ];

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-extrabold text-white mb-2">لوحة التحكم العامة</h1>
                <p className="text-slate-500 text-sm">مرحباً بك مجدداً، إليك ملخص لأداء المنصة اليوم.</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">آخر تحديث</span>
                    <span className="text-xs text-slate-300 font-bold">منذ 5 دقائق</span>
                </div>
                <button className="p-3 glass rounded-xl text-slate-400 hover:text-white transition-all"><Clock size={20} /></button>
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, i) => (
                <motion.div 
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass p-6 border-white/5 relative overflow-hidden group hover:scale-[1.02] transition-all"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                            {card.icon}
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-bold ${card.isUp ? "text-green-400" : "text-red-400"}`}>
                            {card.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            <span>{card.trend}</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold mb-1">{card.label}</p>
                        <h3 className="text-2xl font-black text-white">{card.value}</h3>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 blur-3xl rounded-full" />
                </motion.div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Performance Summary Chart (SVG Hack for mirror image) */}
            <div className="lg:col-span-2 glass p-8 border-white/5">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <TrendingUp size={18} className="text-purple-400" />
                        نمو الاشتراكات والأرباح
                    </h3>
                    <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-2 text-slate-400"><div className="w-2.5 h-2.5 rounded-full bg-purple-500" /> <span>النمو</span></div>
                        <div className="flex items-center gap-2 text-slate-400"><div className="w-2.5 h-2.5 rounded-full bg-slate-700" /> <span>السابق</span></div>
                    </div>
                </div>
                
                <div className="h-64 flex items-end justify-between px-2 gap-4">
                    {[35, 50, 45, 60, 80, 70, 95].map((h, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                            <div className="w-full relative flex items-end justify-center min-h-[150px]">
                                <motion.div 
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    className={`w-full max-w-[40px] rounded-t-xl transition-all ${i === 6 ? "premium-gradient shadow-lg shadow-purple-900/40" : "bg-white/5 group-hover:bg-white/10"}`}
                                />
                                {i === 6 && <div className="absolute top-[-30px] glass px-2 py-1 text-[10px] text-white font-bold">+12%</div>}
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold uppercase">{["سبت", "أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة"][i]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-1 glass p-8 border-white/5 overflow-hidden flex flex-col">
                <h3 className="text-white font-bold mb-8 flex items-center gap-2">
                    <Activity size={18} className="text-green-400" />
                    أحدث محاولات الاختبارات
                </h3>
                
                <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar">
                    {recentAttempts.length > 0 ? recentAttempts.map((attempt, i) => (
                        <motion.div 
                            key={attempt.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-4 p-4 rounded-2xl glass hover:bg-white/5 transition-all border border-transparent hover:border-white/5"
                        >
                            <div className="w-10 h-10 rounded-full premium-gradient p-[1px] shrink-0">
                                <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                                    <UserIcon size={16} className="text-slate-400" />
                                </div>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h4 className="text-sm font-bold text-white truncate">{attempt.users?.full_name || "مستخدم"}</h4>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 truncate mb-1">
                                    <HelpCircle size={10} />
                                    <span>{attempt.exams?.title || "اختبار"}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-[10px] font-black uppercase ${attempt.percentage >= 50 ? "text-green-400" : "text-red-400"}`}>
                                        {attempt.percentage >= 50 ? "ناجح" : "راسب"} ({attempt.percentage}%)
                                    </span>
                                </div>
                            </div>
                            <Award size={14} className={attempt.percentage >= 50 ? "text-green-400" : "text-slate-700"} />
                        </motion.div>
                    )) : (
                        <p className="text-slate-600 text-sm text-center py-20">لا توجد محاولات حديثة</p>
                    )}
                </div>
                
                <button className="w-full mt-6 py-3 rounded-xl border border-white/5 text-slate-500 text-xs font-bold hover:bg-white/5 hover:text-white transition-all">
                    عرض جميع المحاولات
                </button>
            </div>
        </div>

      </div>
    </AdminLayout>
  );
}
