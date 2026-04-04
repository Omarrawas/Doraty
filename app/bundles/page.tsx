"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Package, CheckCircle, ArrowRight, Zap, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function BundlesPage() {
  const [bundles, setBundles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBundles() {
      const { data } = await supabase
        .from("bundles")
        .select("*, bundle_courses(courses(*))");
      if (data) {
        setBundles(data.map(b => ({
          ...b,
          courses: b.bundle_courses?.map((bc: any) => bc.courses) || []
        })));
      }
      setLoading(false);
    }
    fetchBundles();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border-purple-500/30">
            <Zap className="text-purple-400" size={16} />
            <span className="text-sm font-semibold text-purple-200">عروض وخصومات حصرية</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">باقات التوفير</h1>
          <p className="text-slate-400 max-w-xl mx-auto">وفر الكثير عند اشتراكك في باقات الدورات المتكاملة والمصممة بعناية لضمان تجربة تعليمية شاملة</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-[600px] glass animate-pulse rounded-3xl" />
            ))
          ) : bundles.map((bundle, index) => (
            <motion.div 
              key={bundle.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-8 border-white/5 flex flex-col relative group"
            >
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-600/10 blur-2xl rounded-full" />
              
              <div className="w-14 h-14 premium-gradient rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-purple-500/20">
                <Package className="text-white" size={28} />
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">{bundle.title}</h2>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed line-clamp-3">
                {bundle.description || "باقة تعليمية متكاملة تشمل مجموعة من أفضل الدورات في هذا المجال بخصم يفوق 30%"}
              </p>

              <div className="space-y-4 mb-10 flex-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">الدورات المشمولة:</p>
                {bundle.courses.map((course: any) => (
                  <div key={course.id} className="flex items-start gap-3">
                    <CheckCircle className="text-purple-500 mt-1 shrink-0" size={18} />
                    <span className="text-slate-200 text-sm font-medium line-clamp-1">{course.title}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-white/5">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-black text-white">{bundle.price}</span>
                  <span className="text-slate-500 line-through text-sm">{(bundle.price * 1.4).toFixed(0)}</span>
                  <span className="text-purple-400 font-bold">ل.س</span>
                </div>

                <button className="w-full py-4 premium-gradient rounded-2xl text-white font-bold shadow-lg shadow-purple-900/40 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3">
                  <ShoppingBag size={20} />
                  <span>اشترك الآن وفر 40%</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
