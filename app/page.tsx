"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { BookOpen, GraduationCap, Sparkles, TrendingUp, Search, User, ArrowLeft, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import TopTeachers from "@/components/home/TopTeachers";
import LiveCourseCard from "@/components/home/LiveCourseCard";
import Link from "next/link";

export default function Home() {
  const [courses, setCourses] = useState<any[]>([]);
  const [liveCourses, setLiveCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      const { data, error } = await supabase
        .from("courses")
        .select("*, users!instructor_id(full_name, avatar_url)")
        .limit(3);
      if (data) setCourses(data);
      setLoading(false);
    }

    async function fetchLiveCourses() {
      const { data } = await supabase
        .from("courses")
        .select("*, users!instructor_id(full_name, avatar_url)")
        .in("delivery_mode", ["live", "in_person"])
        .eq("is_published", true)
        .limit(10);
      if (data) setLiveCourses(data);
    }

    fetchCourses();
    fetchLiveCourses();
  }, []);

  return (
    <main className="min-h-screen bg-[#0f172a] font-cairo overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-60 pb-32 px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 -right-20 w-[600px] h-[600px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-indigo-900/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass mb-12 border-purple-500/30 group cursor-default"
          >
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping" />
            <Sparkles className="text-purple-400" size={16} />
            <span className="text-xs font-black text-purple-200 uppercase tracking-widest leading-loose">المنصة التعليمية الأفضل لعام 2024</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black text-white mb-10 leading-[1.1] tracking-tight"
          >
            استثمر في <span className="text-gradient">مستقبلك</span> <br />
            مع أكاديمية دوراتي
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto mb-16 leading-relaxed font-medium"
          >
            نحن هنا لنضع بين يديك أفضل الدورات التعليمية المتخصصة بأعلى جودة وتقنيات حديثة لتساعدك في الوصول إلى أهدافك المهنية والشخصية.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8"
          >
            <Link href="/explore" className="px-12 py-5 premium-gradient rounded-3xl text-white font-black text-lg shadow-2xl shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3">
                <PlayCircle size={24} />
                ابدأ رحلتك الآن
            </Link>
            <Link href="/explore" className="px-12 py-5 glass rounded-3xl text-white font-black text-lg hover:bg-white/10 transition-all duration-300">
               تصفح الدورات
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Quick Look */}
      <section className="py-12 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
                { label: "دورة تدريبية", val: "150+" },
                { label: "طالب نشط", val: "10K+" },
                { label: "مدرب خبير", val: "45+" },
                { label: "ساعة تعليمية", val: "2.5K+" },
            ].map((s, i) => (
                <div key={i} className="text-center group">
                    <h3 className="text-3xl font-black text-white mb-1 group-hover:text-purple-400 transition-colors uppercase">{s.val}</h3>
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em] leading-loose">{s.label}</p>
                </div>
            ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-32 px-6 max-w-7xl mx-auto relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-[2px] premium-gradient rounded-full" />
                <span className="text-purple-400 font-bold text-xs uppercase tracking-widest leading-loose">تعلم بذكاء</span>
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-2 leading-[1.2]">أبرز الدورات المختارة</h2>
            <p className="text-slate-500 text-sm max-w-md">مجموعة مختارة بعناية من أهم الدورات التعليمية التي تصنف كالأكثر طلباً وتأثيراً في مسارك المهني.</p>
          </div>
          <Link href="/explore" className="flex items-center gap-2 text-white font-bold group hover:text-purple-400 transition-colors">
            <span>مشاهدة جميع الدورات</span>
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-96 glass animate-pulse rounded-3xl" />
            ))
          ) : (
            courses.map((course, i) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass overflow-hidden group cursor-pointer border-white/5 hover:border-purple-500/20 transition-all flex flex-col h-full"
              >
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={course.image_url || "/placeholder.jpg"} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-0 group-hover:opacity-60 transition-opacity" />
                  <div className="absolute top-4 left-4 glass px-4 py-1.5 text-[10px] text-white font-black uppercase tracking-widest rounded-lg">
                    {course.category}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 premium-gradient p-[1px]">
                      <div className="w-full h-full rounded-full bg-[#0f172a] overflow-hidden flex items-center justify-center">
                        <img src={course.users?.avatar_url || "/person.jpg"} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{course.users?.full_name}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-6 line-clamp-2 leading-snug group-hover:text-purple-400 transition-colors">{course.title}</h3>
                  <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-white font-black text-2xl">
                        <span className="text-purple-400">{course.price || "مجانية"}</span>
                        {course.price && <span className="text-[10px] text-slate-600 font-bold uppercase mr-1">ل.س</span>}
                    </div>
                    <Link href={`/courses/${course.id}`} className="p-3 glass rounded-xl text-slate-400 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-xl">
                        <ArrowLeft size={20} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Top Teachers Section */}
      <TopTeachers />

      {/* Live & In-person Courses */}
      {liveCourses.length > 0 && (
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
                <span className="text-red-400 font-bold text-xs uppercase tracking-widest">مباشر الآن</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white leading-tight">دورات مباشرة وحضورية</h2>
              <p className="text-slate-500 text-sm mt-1 max-w-md">انضم إلى جلسات تفاعلية مباشرة أو احضر شخصياً مع أفضل المدرسين.</p>
            </div>
            <Link
              href="/explore"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm font-medium shrink-0"
            >
              عرض الكل
              <ArrowLeft size={15} />
            </Link>
          </div>

          {/* Horizontal scroll */}
          <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide">
            {liveCourses.map((course, i) => (
              <LiveCourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Box */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="glass p-12 md:p-24 border-white/5 relative overflow-hidden rounded-[40px] text-center">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/10 blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">هل أنت مستعد لنقل مهاراتك <br /> إلى <span className="text-gradient">المستوى التالي؟</span></h2>
                <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto font-medium">انضم إلى أكثر من 10,000 طالب وبدأ رحلتك التعليمية الآن مع أفضل المدرسين في الوطن العربي.</p>
                <Link href="/auth/register" className="px-16 py-6 premium-gradient rounded-3xl text-white font-black text-xl shadow-2xl shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all inline-block">
                    سجل حسابك مجاناً
                </Link>
            </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
