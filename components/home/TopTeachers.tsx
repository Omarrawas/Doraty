"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { User, Star, BookOpen, GraduationCap, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TopTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTeachers() {
      const { data } = await supabase
        .from("users")
        .select("id, full_name, avatar_url, specialization, bio")
        .eq("role", "teacher")
        .limit(4);
      
      if (data) setTeachers(data);
      setLoading(false);
    }
    fetchTeachers();
  }, []);

  if (!loading && teachers.length === 0) return null;

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative overflow-hidden font-cairo">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-900/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 relative z-10">
        <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-[2px] premium-gradient rounded-full" />
                <span className="text-purple-400 font-bold text-xs uppercase tracking-widest leading-loose">نخبة الكادر التعليمي</span>
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-2">أفضل المدربين في دوراتي</h2>
            <p className="text-slate-500 text-sm max-w-xl">تعلم من خبراء الصناعة والأساتذة المتخصصين الذين كرسوا حياتهم لنشر العلم والمعرفة بصورة مبسطة وحديثة.</p>
        </div>
        <Link href="/explore" className="flex items-center gap-2 text-white font-bold group hover:text-purple-400 transition-colors">
            <span>اكتشف جميع المدرسين</span>
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {loading ? (
            Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-80 glass animate-pulse rounded-3xl border-white/5" />
            ))
        ) : (
            teachers.map((teacher, i) => (
                <motion.div 
                    key={teacher.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass group hover:bg-white/5 border-white/5 hover:border-purple-500/20 transition-all p-6 flex flex-col items-center text-center overflow-hidden"
                >
                    <div className="relative mb-6">
                        <div className="w-24 h-24 rounded-full premium-gradient p-[1px] group-hover:rotate-12 transition-transform duration-500 shadow-xl shadow-purple-900/20">
                            <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden border-2 border-[#0f172a]">
                                <img 
                                    src={teacher.avatar_url || "/person.jpg"} 
                                    alt={teacher.full_name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform">
                             <GraduationCap size={16} className="text-purple-600" />
                        </div>
                    </div>

                    <h3 className="text-white font-black text-lg mb-1 truncate w-full">{teacher.full_name}</h3>
                    <p className="text-purple-400 text-[10px] font-bold uppercase tracking-widest mb-4 truncate w-full px-2">{teacher.specialization || "مدرب متخصص"}</p>
                    
                    <p className="text-slate-500 text-xs line-clamp-2 mb-8 leading-relaxed h-8">
                        {teacher.bio || "خبير تعليمي يسعى لتقديم المادة العلمية بأفضل الطرق الحديثة."}
                    </p>

                    <div className="flex items-center gap-4 w-full pt-6 border-t border-white/5 mb-8">
                        <div className="flex-1 flex flex-col items-center border-l border-white/5">
                            <span className="text-white font-bold text-sm">24+</span>
                            <span className="text-[10px] text-slate-600 font-bold uppercase">كورس</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center">
                            <span className="text-white font-bold text-sm">1.2K</span>
                            <span className="text-[10px] text-slate-600 font-bold uppercase">طالب</span>
                        </div>
                    </div>

                    <Link 
                        href={`/explore?teacher=${teacher.id}`}
                        className="w-full py-4 rounded-xl glass border-purple-500/20 text-purple-400 font-bold text-xs hover:bg-purple-500/10 transition-all uppercase tracking-widest"
                    >
                        عرض الدورات
                    </Link>
                    
                    {/* Decorative gradient blur */}
                    <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-purple-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
            ))
        )}
      </div>
    </section>
  );
}
