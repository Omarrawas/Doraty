"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  Search, 
  Grid, 
  List, 
  ChevronDown 
} from "lucide-react";
import { motion } from "framer-motion";
import CourseCard from "@/components/common/CourseCard";

export default function ExplorePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [userFavorites, setUserFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState("الكل");
  const [selectedType, setSelectedType] = useState("الكل");

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: cats } = await supabase.from("categories").select("*").order("name");
      const { data: initialCourses } = await supabase.from("courses").select("*, users!instructor_id(*)").limit(20);
      const { data: initialBundles } = await supabase.from("bundles").select("*").limit(5);
      
      if (user) {
          const { data: faves } = await supabase.from("course_favorites").select("course_id").eq("user_id", user.id);
          if (faves) setUserFavorites(faves.map((f: any) => f.course_id));
      }

      if (cats) setCategories(cats);
      if (initialCourses) setCourses(initialCourses);
      if (initialBundles) setBundles(initialBundles);
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    let query = supabase.from("courses").select("*, users!instructor_id(*)");
    
    if (searchQuery) query = query.ilike("title", `%${searchQuery}%`);
    if (selectedCategory) query = query.eq("category_id", selectedCategory);
    
    const { data } = await query;
    if (data) setCourses(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] pt-32 pb-20 px-6 font-cairo">
      <div className="max-w-7xl mx-auto">
        
        {/* Search & Header */}
        <div className="mb-12">
            <h1 className="text-4xl font-black text-white mb-8 tracking-tight">استكشف الدورات</h1>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 relative">
                    <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="ابحث عن دورة، مدرس، أو موضوع..."
                        className="w-full glass py-5 pr-14 pl-8 text-white focus:ring-1 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600 font-bold"
                    />
                </div>
                <button 
                    onClick={handleSearch}
                    className="px-12 py-5 premium-gradient rounded-2xl text-white font-black shadow-lg shadow-purple-900/40 hover:scale-105 transition-all shrink-0"
                >
                    البحث الذكي
                </button>
            </div>
        </div>

        {/* Featured Bundles Section (Legacy Packages Parity) */}
        {bundles.length > 0 && (
            <div className="mb-20">
                <div className="flex items-center justify-between mb-8 px-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-900/20">
                            <Zap size={20} />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">باقات التوفير المتكاملة</h2>
                    </div>
                </div>

                <div className="flex gap-8 overflow-x-auto no-scrollbar pb-8 -mx-6 px-6">
                    {bundles.map((bundle) => (
                        <Link 
                            key={bundle.id}
                            href={`/bundles/${bundle.id}`}
                            className="min-w-[350px] md:min-w-[450px] glass p-8 rounded-[2.5rem] border-white/5 hover:bg-white/[0.04] transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full group-hover:bg-purple-500/20 transition-all" />
                            
                            <div className="relative z-10 space-y-6">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-2xl font-black text-white leading-tight max-w-[70%]">{bundle.title}</h3>
                                    <div className="glass px-3 py-1 rounded-full text-[10px] font-black text-yellow-400 border-yellow-400/20 uppercase tracking-widest">وفر 25%</div>
                                </div>
                                
                                <p className="text-slate-400 font-bold text-sm line-clamp-2 leading-relaxed">{bundle.description}</p>
                                
                                <div className="flex items-center justify-between pt-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full premium-gradient flex items-center justify-center text-white">
                                            <BookOpen size={14} />
                                        </div>
                                        <span className="text-white font-black text-sm">{bundle.course_ids?.length || 0} دورات</span>
                                    </div>
                                    <div className="text-xl font-black text-white">{bundle.price} ل.س</div>
                                </div>

                                <div className="pt-6 flex justify-end">
                                    <span className="text-purple-400 font-black text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                                        عرض محتويات الباقة
                                        <ChevronLeft size={16} />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )}

        {/* Categories Bar */}
        <div className="mb-12 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
            <div className="flex gap-4 min-w-max">
                <button 
                    onClick={() => { setSelectedCategory(null); handleSearch(); }}
                    className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border ${
                        !selectedCategory ? "premium-gradient text-white border-transparent" : "glass text-slate-500 border-white/5 hover:bg-white/5"
                    }`}
                >
                    الكل
                </button>
                {categories.map((cat) => (
                    <button 
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); handleSearch(); }}
                        className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all border ${
                            selectedCategory === cat.id ? "premium-gradient text-white border-transparent" : "glass text-slate-500 border-white/5 hover:bg-white/5"
                        }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="glass p-5 border-white/5 relative group">
                <label className="text-[10px] font-black text-slate-600 mb-2 block uppercase pr-2 tracking-widest leading-loose">المستوى التعليمي</label>
                <select 
                    className="w-full bg-transparent text-white font-black outline-none cursor-pointer appearance-none pr-2"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                >
                    <option className="bg-[#0f172a]">الكل</option>
                    <option className="bg-[#0f172a]">مبتدئ</option>
                    <option className="bg-[#0f172a]">متوسط</option>
                    <option className="bg-[#0f172a]">متقدم</option>
                </select>
                <div className="absolute left-6 top-1/2 translate-y-1 pointer-events-none group-hover:text-purple-400 text-slate-800 transition-colors">
                    <ChevronDown size={18} />
                </div>
            </div>

            <div className="glass p-5 border-white/5 relative group">
                <label className="text-[10px] font-black text-slate-600 mb-2 block uppercase pr-2 tracking-widest leading-loose">نوع الدورة</label>
                <select 
                    className="w-full bg-transparent text-white font-black outline-none cursor-pointer appearance-none pr-2"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                    <option className="bg-[#0f172a]">الكل</option>
                    <option className="bg-[#0f172a]">مسجلة</option>
                    <option className="bg-[#0f172a]">مباشرة</option>
                    <option className="bg-[#0f172a]">حضورية</option>
                </select>
                <div className="absolute left-6 top-1/2 translate-y-1 pointer-events-none group-hover:text-purple-400 text-slate-800 transition-colors">
                    <ChevronDown size={18} />
                </div>
            </div>

            <div className="glass p-5 border-white/5 flex items-center justify-between">
                <div>
                   <label className="text-[10px] font-black text-slate-600 mb-1 block uppercase pr-2 tracking-widest leading-loose">نمط العرض</label>
                   <span className="text-white font-black pr-2 text-sm">{courses.length} دورة متاحة</span>
                </div>
                <div className="flex gap-3">
                    <button className="p-3 rounded-xl bg-purple-500/20 text-purple-400 shadow-lg"><Grid size={20} /></button>
                    <button className="p-3 rounded-xl hover:bg-white/5 text-slate-700 transition-all"><List size={20} /></button>
                </div>
            </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
                <div key={i} className="h-96 glass animate-pulse rounded-3xl" />
            ))
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                isInitialFavorite={userFavorites.includes(course.id)} 
              />
            ))
          ) : (
            <div className="col-span-full py-32 text-center glass border-white/5">
                <div className="w-24 h-24 glass rounded-full flex items-center justify-center mx-auto mb-8 text-slate-800 border-2 border-dashed border-white/5">
                    <Search size={40} />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">لا توجد نتائج مطابقة</h3>
                <p className="text-slate-500 font-medium">حاول البحث بكلمات مختلفة أو تغيير الفلاتر المختارة لاستكشاف المزيد</p>
                <button 
                  onClick={() => {setSearchQuery(""); setSelectedCategory(null); handleSearch();}}
                  className="mt-8 text-purple-400 font-bold hover:underline underline-offset-4"
                >
                  إعادة ضبط جميع الإعدادات
                </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
-slate-500">حاول البحث بكلمات مختلفة أو تغيير الفلاتر المختارة</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
