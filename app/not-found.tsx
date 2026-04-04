"use client";

import React from "react";
import { 
  Home, 
  Search, 
  ArrowRight, 
  Ghost,
  Compass
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6 overflow-hidden relative font-cairo">
      
      {/* Background Decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full animate-pulse delay-1000" />
      
      <div className="max-w-3xl w-full text-center relative z-10">
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-12 relative inline-block"
        >
            <div className="text-[12rem] md:text-[18rem] font-black text-white/5 leading-none select-none">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                    animate={{ y: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-32 h-32 md:w-48 md:h-48 glass rounded-[3rem] flex items-center justify-center text-purple-400 shadow-2xl border-white/10"
                >
                    <Compass size={80} className="md:size-32" />
                </motion.div>
            </div>
        </motion.div>

        <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight"
        >
            يبدو أنك <span className="text-purple-500 italic">تُهت في الفضاء</span>
        </motion.h1>
        
        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed"
        >
            الصفحة التي تبحث عنها غير موجودة أو تم نقلها. لا تقلق، يمكنك دائماً العودة إلى طريق التعلم الصحيح.
        </motion.p>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
        >
            <Link 
                href="/" 
                className="px-10 py-5 premium-gradient text-white rounded-2xl font-black text-lg shadow-2xl shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
                <Home size={20} />
                العودة للرئيسية
            </Link>
            
            <Link 
                href="/explore" 
                className="px-10 py-5 glass border-white/10 text-white rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center gap-3"
            >
                <Search size={20} />
                استكشف الدورات
            </Link>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-20 pt-10 border-t border-white/5 flex items-center justify-center gap-10 text-slate-600 font-bold text-sm"
        >
            <span>أكاديمية دوراتي &copy; 2026</span>
            <div className="w-1 h-1 bg-slate-800 rounded-full" />
            <a href="/help" className="hover:text-purple-400 transition-colors">مركز المساعدة</a>
        </motion.div>
      </div>
    </div>
  );
}
