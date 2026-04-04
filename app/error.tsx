"use client";

import React from "react";
import { 
  RefreshCcw, 
  Home, 
  AlertTriangle,
  Bug
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6 font-cairo">
      <div className="max-w-4xl w-full text-center py-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 blur-[120px] rounded-full" />
        
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
        >
            <div className="w-32 h-32 glass border-red-500/20 rounded-[2.5rem] flex items-center justify-center mx-auto text-red-500 shadow-2xl shadow-red-500/20">
                <AlertTriangle size={60} />
            </div>
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">عذراً، حدث خطأ غير متوقع</h1>
        <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed font-bold">
            نعتذر بشدة عن هذا العطل. لقد قمنا بتسجيل الخطأ وجاري العمل على إصلاحه. يمكنك المحاولة مرة أخرى أو العودة للصفحة الرئيسية.
        </p>

        <div className="glass p-8 border-white/5 rounded-3xl mb-12 max-w-2xl mx-auto text-right bg-white/[0.02]">
            <div className="flex items-center gap-3 text-red-400 text-xs font-black uppercase tracking-widest mb-4">
                <Bug size={14} />
                <span>معلومات تقنية للخبراء</span>
            </div>
            <code className="text-slate-500 text-sm block font-mono break-all line-clamp-2">
                {error.message || "Unknown error occurred"}
                {error.digest && <div className="mt-2 text-slate-600">ID: {error.digest}</div>}
            </code>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <button 
                onClick={() => reset()}
                className="px-10 py-5 premium-gradient text-white rounded-2xl font-black text-lg shadow-2xl shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
                <RefreshCcw size={20} />
                إعادة المحاولة
            </button>
            <Link 
                href="/" 
                className="px-10 py-5 glass border-white/10 text-white rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center gap-3"
            >
                <Home size={20} />
                العودة للرئيسية
            </Link>
        </div>

        <p className="mt-16 text-slate-600 text-sm font-bold">إذا استمرت المشكلة، يرجى التواصل مع فريق الدعم الفني.</p>
      </div>
    </div>
  );
}
