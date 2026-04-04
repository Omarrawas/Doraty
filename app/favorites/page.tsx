"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import CourseCard from "@/components/common/CourseCard";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Heart, Search, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
          setLoading(false);
          return;
      }

      const { data } = await supabase
        .from("course_favorites")
        .select("course_id, courses(*, users!instructor_id(*))")
        .eq("user_id", user.id);
      
      if (data) setFavorites(data.map(f => f.courses));
      setLoading(false);
    }
    fetchFavorites();
  }, []);

  return (
    <main className="min-h-screen bg-[#0f172a] font-cairo">
      <Navbar />
      
      <div className="pt-40 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl premium-gradient flex items-center justify-center shadow-lg shadow-purple-900/20">
                    <Heart className="text-white" size={24} fill="currentColor" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white mb-1">دوراتي المفضلة</h1>
                    <p className="text-slate-500 text-sm">سرعة الوصول لكل ما يهمك من علم ومعرفة</p>
                </div>
            </div>
            <Link href="/explore" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                <span className="font-bold text-sm">اكتشف المزيد</span>
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </Link>
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="h-96 glass animate-pulse rounded-3xl" />
                ))}
            </div>
        ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {favorites.map((course) => (
                    <CourseCard key={course.id} course={course} isInitialFavorite={true} />
                ))}
            </div>
        ) : (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-32 text-center glass border-white/5 rounded-[40px]"
            >
                <div className="w-24 h-24 glass rounded-full flex items-center justify-center mx-auto mb-8 text-slate-800 border-2 border-dashed border-white/5">
                    <Heart size={40} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">قائمتك فارغة حالياً</h3>
                <p className="text-slate-500 font-medium max-w-md mx-auto">لم تقم بإضافة أي دورة للمفضلة بعد. تصفح مكتبتنا الواسعة وابدأ بجمع ما يلهمك!</p>
                <Link 
                  href="/explore"
                  className="mt-10 px-12 py-5 premium-gradient rounded-3xl text-white font-black hover:scale-105 transition-all inline-block shadow-2xl shadow-purple-900/40"
                >
                  استكشف جميع الدورات
                </Link>
            </motion.div>
        )}
      </div>

      <Footer />
    </main>
  );
}
