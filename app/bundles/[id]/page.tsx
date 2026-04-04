"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  ShoppingCart, 
  ChevronLeft, 
  Zap, 
  CheckCircle2, 
  Star,
  GraduationCap,
  Layers,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/lib/CartContext";
import Link from "next/link";
import CourseCard from "@/components/common/CourseCard";

export default function BundlePage({ params }: { params: { id: string } }) {
  const [bundle, setBundle] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchBundle() {
      const { data: bundleData } = await supabase
        .from("bundles")
        .select("*")
        .eq("id", params.id)
        .single();
      
      if (bundleData) {
        setBundle(bundleData);
        // Fetch courses in this bundle
        const { data: coursesData } = await supabase
          .from("courses")
          .select("*")
          .in("id", bundleData.course_ids || []);
        if (coursesData) setCourses(coursesData);
      }
      setLoading(false);
    }
    fetchBundle();
  }, [params.id]);

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#0f172a] pt-40 pb-20 px-6 font-cairo">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-4 mb-16 px-4">
            <Link href="/explore" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2">
                <ChevronLeft size={18} />
                <span>العودة للاستكشاف</span>
            </Link>
            <div className="w-1 h-1 bg-slate-800 rounded-full" />
            <span className="text-purple-400 font-black">تفاصيل الباقة</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-16">
                
                {/* Bundle Intro */}
                <div className="space-y-8">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-24 h-24 premium-gradient rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-purple-900/40"
                    >
                        <Layers size={48} />
                    </motion.div>
                    
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">{bundle?.title}</h1>
                        <p className="text-slate-400 text-xl font-bold leading-relaxed">{bundle?.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-6 pt-4">
                        <div className="glass px-6 py-3 rounded-2xl border-white/5 flex items-center gap-3">
                            <BookOpen className="text-purple-400" size={20} />
                            <span className="text-white font-bold">{courses.length} دورات تدريبية</span>
                        </div>
                        <div className="glass px-6 py-3 rounded-2xl border-white/5 flex items-center gap-3">
                            <Zap className="text-yellow-400" size={20} />
                            <span className="text-white font-bold">خصم تجميعي 25%</span>
                        </div>
                    </div>
                </div>

                {/* Courses List */}
                <div className="space-y-12">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-black text-white tracking-tight">الدورات المتضمنة بالباقة</h2>
                        <div className="w-20 h-1 bg-purple-500/20 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {courses.map((course, i) => (
                            <motion.div 
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <CourseCard course={course} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-4">
                <div className="glass p-10 border-white/5 rounded-[3.5rem] sticky top-32 space-y-10">
                    <div>
                        <div className="text-slate-500 font-bold mb-2">سعر الباقة الإجمالي</div>
                        <div className="flex items-end gap-4">
                            <span className="text-6xl font-black text-white">{bundle?.price}</span>
                            <span className="text-slate-400 text-lg mb-4 font-bold">ل.س</span>
                        </div>
                        <div className="mt-4 flex items-center gap-3 text-green-400 text-sm font-black uppercase tracking-widest">
                            <Zap size={14} />
                            <span>توفر حوالي 15,000 ل.س</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button 
                            onClick={() => addToCart({ id: bundle.id, title: bundle.title, price: bundle.price, image: bundle.image_url, isBundle: true })}
                            className="w-full py-5 premium-gradient text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            <ShoppingCart size={22} />
                            إضافة الباقة للسلة
                        </button>
                        <p className="text-center text-slate-500 font-bold text-xs uppercase tracking-widest">ضمان الوصول مدى الحياة</p>
                    </div>

                    <div className="pt-10 border-t border-white/5 space-y-6">
                        <h4 className="text-white font-bold">ماذا ستتعلم؟</h4>
                        <div className="space-y-4">
                            {[
                                "إتقان المفاهيم الأساسية والمتقدمة",
                                "تطبيقات عملية ومشاريع حقيقية",
                                "شهادة معتمدة لكل دورة في الباقة",
                                "دعم فني مباشر من المدرسين"
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-6 h-6 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400 shrink-0 mt-1">
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <span className="text-slate-400 font-bold text-sm leading-relaxed">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
