"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  Lightbulb, 
  Share2, 
  Play, 
  Pause, 
  ChevronDown,
  ChevronUp,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function TipsPage() {
  const [tips, setTips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchTips() {
      const { data } = await supabase
        .from("platform_tips")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setTips(data);
      setLoading(false);
    }
    fetchTips();
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollPos = e.currentTarget.scrollTop;
    const index = Math.round(scrollPos / window.innerHeight);
    if (index !== activeIndex) setActiveIndex(index);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative font-cairo">
      
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 p-8 z-50 flex items-center justify-between pointer-events-none">
        <Link href="/" className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white pointer-events-auto hover:bg-white/10 transition-all border-white/5">
            <X size={24} />
        </Link>
        <div className="glass px-6 py-2 rounded-full border-white/5 flex items-center gap-3 text-white pointer-events-auto">
            <Lightbulb className="text-yellow-400" size={18} />
            <span className="font-black text-sm uppercase tracking-widest">نصائح المنصة</span>
        </div>
        <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white pointer-events-auto hover:bg-white/10 transition-all border-white/5">
            <Share2 size={24} />
        </button>
      </div>

      {/* Snap Scroll Container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scrollbar-none"
      >
        {tips.length === 0 ? (
            <div className="h-full w-full flex items-center justify-center text-center p-12">
                <div className="space-y-6">
                    <Lightbulb size={80} className="text-slate-800 mx-auto" />
                    <h2 className="text-3xl font-bold text-white">لا توجد نصائح حالياً</h2>
                    <p className="text-slate-500">سنقوم بإضافة نصائح تعليمية قريباً.</p>
                </div>
            </div>
        ) : (
            tips.map((tip, i) => (
                <div key={tip.id} className="h-screen w-screen snap-start relative flex items-center justify-center bg-zinc-900 border-b border-white/5">
                    
                    {/* Video / Content Background */}
                    <div className="absolute inset-0 z-0">
                        {tip.video_url ? (
                            <video 
                                src={tip.video_url} 
                                className="w-full h-full object-cover opacity-60"
                                autoPlay={i === activeIndex}
                                loop
                                muted
                                playsInline
                            />
                        ) : (
                            <div className="w-full h-full premium-gradient opacity-10" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90" />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 w-full max-w-xl p-8 mt-auto mb-20 text-right">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={`title-${i}`}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-3 glass px-4 py-1.5 rounded-full text-purple-400 text-[10px] font-black uppercase tracking-widest border-purple-500/20">
                                <BookOpen size={12} />
                                <span>نصيحة تعليمية</span>
                            </div>
                            <h2 className="text-4xl font-black text-white leading-tight">{tip.title}</h2>
                            <p className="text-slate-300 text-lg leading-relaxed font-bold line-clamp-3">{tip.description}</p>
                            
                            <div className="pt-8 flex items-center gap-6">
                                <button className="w-16 h-16 premium-gradient text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-purple-900/40 hover:scale-110 active:scale-95 transition-transform">
                                    <Play size={28} />
                                </button>
                                <div>
                                    <h4 className="text-white font-bold">شاهد الخطوات</h4>
                                    <p className="text-slate-500 text-sm">فيديو تعليمي قصير</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Scroll Icons */}
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-8 items-center">
                        <div className="flex flex-col items-center gap-2">
                             <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-white">
                                <BookOpen size={24} />
                             </div>
                             <span className="text-[10px] text-white font-bold">اقرأ</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                             <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-white">
                                <Share2 size={24} />
                             </div>
                             <span className="text-[10px] text-white font-bold">مشاركة</span>
                        </div>
                    </div>
                </div>
            ))
        )}
      </div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-8 left-8 flex flex-col gap-4 text-white/30">
        <ChevronUp size={24} className="animate-bounce" />
        <div className="flex flex-col gap-2">
            {tips.map((_, i) => (
                <div key={i} className={`w-1 h-3 rounded-full transition-all ${i === activeIndex ? "bg-purple-500 h-6" : "bg-white/10"}`} />
            ))}
        </div>
        <ChevronDown size={24} className="animate-bounce" />
      </div>

    </div>
  );
}
