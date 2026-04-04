"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Search, Filter, BookOpen, Clock, Star, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      let query = supabase
        .from("courses")
        .select("*, users!instructor_id(full_name, avatar_url)");
      
      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query.eq("is_published", true);
      if (data) setCourses(data);
      setLoading(false);
    }
    fetchCourses();
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#0f172a] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">تصفح جميع الدورات</h1>
          <p className="text-slate-400">اختر الدورة المناسبة لك وابدأ رحلة التعلم اليوم</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text"
              placeholder="ابحث عن دورة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass py-4 pr-12 pl-4 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            />
          </div>
          <button className="glass px-8 flex items-center gap-2 text-white hover:bg-white/10 transition-colors">
            <Filter size={20} />
            <span>تصفية</span>
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-[450px] glass animate-pulse rounded-3xl" />
            ))
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -8 }}
                className="glass overflow-hidden border-white/5 flex flex-col group"
              >
                <div className="relative h-48">
                  <img 
                    src={course.image_url || "/placeholder.jpg"} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4 glass px-3 py-1 flex items-center gap-1">
                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                    <span className="text-xs text-white font-bold">{course.rating || "4.8"}</span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500/30">
                      <img src={course.users?.avatar_url || "/person.jpg"} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-sm text-slate-400 font-medium">{course.users?.full_name}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-4 line-clamp-2">{course.title}</h3>
                  
                  <div className="flex items-center gap-4 mb-6 text-slate-500 text-sm">
                    <div className="flex items-center gap-1">
                      <BookOpen size={16} />
                      <span>{course.lessons_count || 0} درس</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{course.duration_total || "12 ساعة"}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="text-2xl font-bold text-purple-400">
                      {course.price} ل.س
                    </div>
                    <button className="w-12 h-12 rounded-xl premium-gradient flex items-center justify-center text-white shadow-lg shadow-purple-500/20 hover:scale-110 transition-transform">
                      <PlayCircle size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center glass">
              <p className="text-slate-400 text-xl">لا توجد دورات مطابقة لبحثك</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
