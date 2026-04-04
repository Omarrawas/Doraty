"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { 
  Award, 
  Download, 
  ExternalLink, 
  Search, 
  ShieldCheck,
  Trophy,
  ArrowRight,
  Share2
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertificates() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
          setLoading(false);
          return;
      }

      const { data } = await supabase
        .from("certificates")
        .select("*, courses(title, image_url, users!instructor_id(full_name))")
        .eq("user_id", user.id);
      
      if (data) setCertificates(data);
      setLoading(false);
    }
    fetchCertificates();
  }, []);

  return (
    <main className="min-h-screen bg-[#0f172a] font-cairo">
      <Navbar />

      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-3xl premium-gradient flex items-center justify-center shadow-2xl shadow-purple-900/40">
                    <Trophy className="text-white" size={32} />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">إنجازاتي وشهاداتي</h1>
                    <p className="text-slate-500 font-medium text-lg">سجل حافل بالنجاح والمعرفة المثبتة رسمياً.</p>
                </div>
            </div>
            
            <div className="hidden md:flex items-center gap-3 glass border-white/5 px-6 py-3 rounded-2xl">
                <ShieldCheck className="text-purple-400" size={20} />
                <span className="text-white font-bold text-sm tracking-tight">جميع الشهادات معتمدة وموثقة من قبل المنصة</span>
            </div>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-80 glass animate-pulse rounded-[2.5rem]" />
                ))}
            </div>
        ) : certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {certificates.map((cert) => (
                     <motion.div 
                        key={cert.id}
                        whileHover={{ y: -8 }}
                        className="glass overflow-hidden border-white/5 rounded-[2.5rem] group shadow-xl relative"
                    >
                        <div className="absolute top-6 right-6 z-10 px-4 py-2 glass border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
                            <CheckCircle2 size={12} />
                            <span>موثقة</span>
                        </div>

                        <div className="p-10 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-purple-400 border-2 border-purple-500/10 shadow-lg shadow-purple-900/20">
                                    <Award size={32} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-black text-white mb-1 truncate leading-tight group-hover:text-purple-400 transition-colors">{cert.courses?.title}</h3>
                                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">المدرس: {cert.courses?.users?.full_name}</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex justify-between text-xs font-bold text-slate-700">
                                    <span className="uppercase tracking-widest">تاريخ الإصدار</span>
                                    <span className="text-slate-400">{new Date(cert.issued_at).toLocaleDateString("ar-EG")}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-slate-700">
                                    <span className="uppercase tracking-widest">رقم الشهادة</span>
                                    <span className="text-slate-400 font-mono tracking-widest">#{cert.id.substring(0, 8).toUpperCase()}</span>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button className="flex-1 px-6 py-4 premium-gradient rounded-2xl text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 hover:scale-105 active:scale-95 transition-all">
                                    <Download size={18} />
                                    تحميل الشهادة
                                </button>
                                <button className="p-4 glass rounded-2xl text-slate-500 hover:text-white transition-all">
                                    <Share2 size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        ) : (
            <div className="py-32 text-center glass border-white/5 rounded-[50px] relative overflow-hidden backdrop-blur-3xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
                <div className="relative z-10">
                    <div className="w-24 h-24 glass rounded-full flex items-center justify-center mx-auto mb-10 text-slate-800 border-2 border-dashed border-white/5">
                        <Award size={48} />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-4">لا توجد شهادات حالياً</h3>
                    <p className="text-slate-500 font-bold text-xl max-w-md mx-auto leading-relaxed">أكمل دوراتك التدريبية واجتز الاختبارات النهائية للحصول على شهاداتك الرسمية الموثقة.</p>
                    <Link 
                        href="/explore"
                        className="mt-12 px-16 py-6 premium-gradient rounded-3xl text-white font-black text-xl hover:scale-105 transition-all inline-flex items-center gap-4 shadow-2xl shadow-purple-900/40"
                    >
                        تصفح الدورات المتوفرة
                        <ArrowRight size={24} />
                    </Link>
                </div>
            </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

// CheckCircle icon for status badge
const CheckCircle2 = ({ size, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
);
