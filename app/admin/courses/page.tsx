"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabaseClient";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  BarChart2, 
  Eye, 
  EyeOff,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // all, published, draft

  useEffect(() => {
    async function fetchData() {
      const { data: catData } = await supabase.from("categories").select("*");
      if (catData) setCategories(catData);
      
      const { data: courseData } = await supabase
        .from("courses")
        .select("*, users!instructor_id(*)")
        .order("created_at", { ascending: false });
      
      if (courseData) setCourses(courseData);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || 
                         (filter === "published" && course.is_published) || 
                         (filter === "draft" && !course.is_published);
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذه الدورة؟ سيتم حذف جميع الدروس المرتبطة بها.")) {
      await supabase.from("courses").delete().eq("id", id);
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const togglePublish = async (id: string, current: boolean) => {
    await supabase.from("courses").update({ is_published: !current }).eq("id", id);
    setCourses(courses.map(c => c.id === id ? { ...c, is_published: !current } : c));
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 font-cairo">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-3xl font-extrabold text-white mb-2">إدارة الدورات</h1>
                <p className="text-slate-500 text-sm">إجمالي {courses.length} دورة تعليمية متاحة في النظام.</p>
            </div>
            <button className="flex items-center gap-2 px-8 py-4 premium-gradient rounded-2xl text-white font-bold shadow-lg shadow-purple-900/40 hover:brightness-110 active:scale-95 transition-all outline-none">
                <Plus size={20} />
                <span>إنشاء دورة جديدة</span>
            </button>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2 relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث باسم الدورة أو المعلم..."
                    className="w-full glass py-4 pr-12 pl-6 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600"
                />
            </div>
            <div className="glass p-2 flex items-center gap-2">
                {["all", "published", "draft"].map((f) => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                            filter === f ? "premium-gradient text-white" : "text-slate-500 hover:text-white"
                        }`}
                    >
                        {f === "all" ? "الكل" : f === "published" ? "المنشور" : "المسودة"}
                    </button>
                ))}
            </div>
            <div className="glass px-6 py-4 flex items-center justify-between relative group cursor-pointer">
                <span className="text-slate-400 text-sm font-bold">كل التصنيفات</span>
                <ChevronDown size={14} className="text-slate-600 group-hover:text-white transition-colors" />
            </div>
        </div>

        {/* Courses Table/Grid */}
        <div className="grid grid-cols-1 gap-4">
            {loading ? (
                Array(5).fill(0).map((_, i) => (
                    <div key={i} className="h-24 glass animate-pulse border-white/5" />
                ))
            ) : filteredCourses.length > 0 ? (
                <div className="space-y-4">
                    {filteredCourses.map((course, i) => (
                        <motion.div 
                            key={course.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass p-2 border-white/5 hover:border-purple-500/20 transition-all group overflow-hidden"
                        >
                            <div className="flex items-center gap-6">
                                {/* Thumbnail */}
                                <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0">
                                    <img src={course.image_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                
                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-bold leading-tight truncate px-2">{course.title}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-[10px] text-slate-500 px-2 font-bold uppercase truncate">
                                        <span className="text-purple-400">أ. {course.users?.full_name}</span>
                                        <span>{course.category}</span>
                                        <span className={course.is_published ? "text-green-500" : "text-orange-500"}>
                                            {course.is_published ? "منشور" : "مسودة"}
                                        </span>
                                    </div>
                                </div>

                                {/* Stats Mini */}
                                <div className="hidden md:flex items-center gap-8 px-8 border-r border-white/5">
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">الطلاب</p>
                                        <p className="text-sm font-black text-white">{course.students_count || 0}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] text-slate-600 font-bold uppercase mb-1">السعر</p>
                                        <p className="text-sm font-black text-purple-400">{course.price || 0}<span className="text-[8px] pr-0.5">ل.س</span></p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 px-4 ml-6 shrink-0">
                                    <button 
                                        onClick={() => togglePublish(course.id, course.is_published)}
                                        className={`p-3 rounded-xl transition-all ${course.is_published ? "text-green-400 hover:bg-green-500/10" : "text-slate-400 hover:bg-white/10"}`} title={course.is_published ? "إلغاء النشر" : "نشر"}
                                    >
                                        {course.is_published ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                    <button className="p-3 text-blue-400 rounded-xl hover:bg-blue-500/10 transition-all" title="إحصائيات">
                                        <BarChart2 size={18} />
                                    </button>
                                    <button className="p-3 text-slate-400 rounded-xl hover:bg-white/10 transition-all" title="تعديل">
                                        <Edit size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(course.id)}
                                        className="p-3 text-red-400 rounded-xl hover:bg-red-500/10 transition-all font-bold" title="حذف"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="glass p-20 text-center border-white/5">
                    <BookOpen size={48} className="text-slate-700 mx-auto mb-6" />
                    <h3 className="text-xl font-bold text-white mb-2">لا توجد دورات مطابقة</h3>
                    <p className="text-slate-500">حاول البحث بكلمات مختلفة أو تغيير الفلاتر.</p>
                </div>
            )}
        </div>

      </div>
    </AdminLayout>
  );
}
