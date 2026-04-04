"use client";

import React from "react";
import { GraduationCap, Target, Users, ShieldCheck, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border-purple-500/30"
          >
            <GraduationCap className="text-purple-400" size={16} />
            <span className="text-sm font-semibold text-purple-200">من نحن؟</span>
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">قـصـة <span className="text-gradient">دورا⁠تــي</span></h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">نحن نؤمن أن التعليم هو المفتاح الأساسي للتغيير والنجاح. انطلقنا من شغف كبير لنشر المعرفة وتسهيل وصولها لكل مبدع وباحث عن التميز.</p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-10 border-white/5 relative overflow-hidden"
            >
                <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-purple-500/10 blur-3xl rounded-full" />
                <div className="w-14 h-14 premium-gradient rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-purple-900/30">
                    <Target className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">رؤيـتـنـا</h3>
                <p className="text-slate-400 leading-relaxed">أن نكون المنصة التعليمية الرائدة في الوطن العربي، التي تخرج أجيالاً قادرة على الابتكار والمنافسة في سوق العمل العالمي بأحدث المهارات والتقنيات.</p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass p-10 border-white/5 relative overflow-hidden"
            >
                <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full" />
                <div className="w-14 h-14 premium-gradient rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-purple-900/30">
                    <Zap className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">رسـالـتـنـا</h3>
                <p className="text-slate-400 leading-relaxed">توفير تجربة تعليمية متميزة عبر دورات تدريبية متخصصة بجودة عالية، مقدمة من نخبة من المحاضرين، مع دعم فني متواصل وبيئة تعليمية محفزة.</p>
            </motion.div>
        </div>

        {/* Why Us / Stats */}
        <div className="text-center mb-32">
            <h2 className="text-3xl font-bold text-white mb-16">لماذا يختارنا الطلاب؟</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { icon: <Users size={32} />, label: "أكثر من 10,000", sub: "طالب نشط" },
                    { icon: <Book size={32} />, label: "أكثر من 200", sub: "دورة تدريبية" },
                    { icon: <Award size={32} />, label: "شهادات معتمدة", sub: "دولياً ومحلياً" },
                    { icon: <ShieldCheck size={32} />, label: "أمان وموثوقية", sub: "100% مضمونة" }
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="space-y-4"
                    >
                        <div className="w-16 h-16 glass rounded-2xl mx-auto flex items-center justify-center text-purple-400">
                            {stat.icon}
                        </div>
                        <div className="text-2xl font-black text-white">{stat.label}</div>
                        <div className="text-slate-500 text-sm">{stat.sub}</div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* CTA */}
        <div className="glass p-12 md:p-20 text-center border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 via-transparent to-indigo-900/10" />
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 relative z-10">هل أنت مستعد للانضمام إلينا؟</h2>
            <p className="text-slate-400 mb-12 max-w-xl mx-auto relative z-10">ابدأ رحلتك التعليمية الآن واستفد من الخصومات الحالية على كافة الباقات والدورات الجديدة.</p>
            <div className="flex justify-center gap-6 relative z-10">
                <a href="/courses" className="px-10 py-4 premium-gradient rounded-2xl text-white font-bold shadow-lg shadow-purple-900/30">تصفح الدورات</a>
                <a href="/auth/register" className="px-10 py-4 glass rounded-2xl text-white font-bold hover:bg-white/10 transition-colors">سجل مجاناً</a>
            </div>
        </div>

      </div>
    </div>
  );
}

// Dummy Book icon for stats
function Book({size}: {size: number}) {
    return <GraduationCap size={size} />;
}
