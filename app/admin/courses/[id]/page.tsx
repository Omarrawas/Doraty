"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabaseClient";
import { 
  Save, 
  ArrowRight, 
  Plus, 
  GripVertical, 
  Edit, 
  Trash2, 
  PlayCircle, 
  FileText, 
  ChevronRight,
  ChevronDown,
  Layout,
  Image as ImageIcon,
  Video as VideoIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

export default function CourseEditor() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("content"); // content, basic

  useEffect(() => {
    async function fetchData() {
      if (!params.id) return;
      
      // Fetch course
      const { data: courseData } = await supabase
        .from("courses")
        .select("*")
        .eq("id", params.id)
        .single();
      
      if (courseData) setCourse(courseData);

      // Fetch chapters & lessons
      const { data: chapterData } = await supabase
        .from("chapters")
        .select("*, lessons(*)")
        .eq("course_id", params.id)
        .order("order_index");
      
      if (chapterData) setChapters(chapterData);
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  const handleSaveBasic = async () => {
    // Save course basic info
    await supabase.from("courses").update(course).eq("id", params.id);
    alert("تم حفظ البيانات بنجاح");
  };

  const addChapter = async () => {
    const newChapter = {
        course_id: params.id,
        title: "فصل جديد",
        order_index: chapters.length
    };
    const { data } = await supabase.from("chapters").insert(newChapter).select().single();
    if (data) setChapters([...chapters, { ...data, lessons: [] }]);
  };

  const addLesson = async (chapterId: string) => {
    const chapterIndex = chapters.findIndex(c => c.id === chapterId);
    const order = chapters[chapterIndex].lessons.length;
    
    const newLesson = {
        chapter_id: chapterId,
        course_id: params.id,
        title: "درس جديد",
        order_index: order
    };
    const { data } = await supabase.from("lessons").insert(newLesson).select().single();
    if (data) {
        const newChapters = [...chapters];
        newChapters[chapterIndex].lessons.push(data);
        setChapters(newChapters);
    }
  };

  if (loading) return <AdminLayout><div className="flex items-center justify-center py-40 text-white animate-pulse">جاري تحميل محرر الدورات...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 font-cairo pb-32">
        
        {/* Breadcrumbs & Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-3 glass rounded-xl text-slate-400 hover:text-white transition-all">
                    <ArrowRight size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-white mb-2">{course?.title || "تعديل الدورة"}</h1>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-bold uppercase tracking-widest">
                        <span>إدارة المحتوى والمنهاج</span>
                        <div className="w-1 h-1 rounded-full bg-slate-800" />
                        <span>{chapters.length} فصل</span>
                        <div className="w-1 h-1 rounded-full bg-slate-800" />
                        <span>{chapters.reduce((acc, c) => acc + (c.lessons?.length || 0), 0)} درس</span>
                    </div>
                </div>
            </div>
            <button onClick={handleSaveBasic} className="flex items-center gap-2 px-8 py-4 premium-gradient rounded-2xl text-white font-bold shadow-lg shadow-purple-900/40 hover:brightness-110 active:scale-95 transition-all">
                <Save size={18} />
                <span>حفظ جميع التغييرات</span>
            </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-4 border-b border-white/5 pb-1">
            {["content", "basic"].map((t) => (
                <button 
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                        activeTab === t ? "text-purple-400" : "text-slate-600 hover:text-white"
                    }`}
                >
                    {t === "content" ? "المنهاج والدروس" : "المعلومات الأساسية"}
                    {activeTab === t && <motion.div layoutId="tab-underline" className="absolute bottom-[-1px] left-0 w-full h-[2px] premium-gradient" />}
                </button>
            ))}
        </div>

        <AnimatePresence mode="wait">
            {activeTab === "basic" ? (
                <motion.div 
                    key="basic-tab"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass p-8 border-white/5 space-y-6">
                            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                <Layout size={18} className="text-purple-400" />
                                معلومات الدورة الرئيسية
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-slate-500 font-black uppercase mb-1 block mr-1 leading-loose">عنوان الدورة</label>
                                    <input 
                                        type="text"
                                        value={course.title}
                                        onChange={(e) => setCourse({...course, title: e.target.value})}
                                        className="w-full glass p-4 text-white outline-none focus:ring-1 focus:ring-purple-500 transition-all font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 font-black uppercase mb-1 block mr-1 leading-loose">وصف الدورة</label>
                                    <textarea 
                                        value={course.description}
                                        rows={6}
                                        onChange={(e) => setCourse({...course, description: e.target.value})}
                                        className="w-full glass p-4 text-white outline-none focus:ring-1 focus:ring-purple-500 transition-all font-bold resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="glass p-8 border-white/5">
                            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                <ImageIcon size={18} className="text-purple-400" />
                                الوسائط والصور
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-[10px] text-slate-500 font-black uppercase mb-1 block mr-1 leading-loose">رابط صورة الغلاف</label>
                                    <div className="relative group">
                                        <input 
                                            type="text"
                                            value={course.image_url}
                                            onChange={(e) => setCourse({...course, image_url: e.target.value})}
                                            className="w-full glass p-4 text-white outline-none focus:ring-1 focus:ring-purple-500 transition-all font-bold text-xs"
                                        />
                                        <div className="mt-4 aspect-video rounded-2xl overflow-hidden border border-white/5">
                                            <img src={course.image_url} className="w-full h-full object-cover" />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 font-black uppercase mb-1 block mr-1 leading-loose">رابط الفيديو التعريفي</label>
                                    <div className="relative group">
                                        <input 
                                            type="text"
                                            value={course.trailer_url}
                                            onChange={(e) => setCourse({...course, trailer_url: e.target.value})}
                                            className="w-full glass p-4 text-white outline-none focus:ring-1 focus:ring-purple-500 transition-all font-bold text-xs"
                                        />
                                        <div className="mt-4 aspect-video rounded-2xl overflow-hidden border border-white/5 bg-black flex items-center justify-center">
                                            <VideoIcon size={48} className="text-slate-800" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="glass p-8 border-white/5">
                             <h3 className="text-white font-bold mb-6 flex items-center gap-2">التسعير والظهور</h3>
                             <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] text-slate-500 font-black uppercase mb-1 block mr-1 leading-loose tracking-widest">سعر الدورة (0 للمجاني)</label>
                                    <div className="relative">
                                        <input 
                                            type="number"
                                            value={course.price}
                                            onChange={(e) => setCourse({...course, price: parseFloat(e.target.value)})}
                                            className="w-full glass p-4 text-white outline-none focus:ring-1 focus:ring-purple-500 transition-all font-black text-2xl"
                                        />
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs uppercase">ل.س</span>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-sm font-bold text-slate-300">نشر الدورة للطلاب</span>
                                        <button 
                                            onClick={() => setCourse({...course, is_published: !course.is_published})}
                                            className={`w-14 h-8 rounded-full transition-all relative p-1 ${course.is_published ? "premium-gradient" : "bg-white/5 shadow-inner"}`}
                                        >
                                            <motion.div 
                                                animate={{ x: course.is_published ? -24 : 0 }}
                                                className="w-6 h-6 rounded-full bg-white shadow-lg"
                                            />
                                        </button>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    key="content-tab"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                >
                    {/* Chapter List */}
                    <div className="space-y-4">
                        {chapters.map((chapter, chapterIdx) => (
                            <div key={chapter.id} className="glass border-white/5 overflow-hidden">
                                <div className="flex items-center gap-4 p-6 bg-white/[0.02] border-b border-white/5">
                                    <div className="cursor-grab active:cursor-grabbing text-slate-700 hover:text-white transition-colors">
                                        <GripVertical size={20} />
                                    </div>
                                    <input 
                                        type="text"
                                        value={chapter.title}
                                        className="bg-transparent text-white font-extrabold text-lg outline-none focus:text-purple-400 transition-colors w-full"
                                    />
                                    <div className="flex items-center gap-2">
                                        <button className="p-2.5 glass rounded-lg text-slate-500 hover:text-white"><Edit size={16} /></button>
                                        <button className="p-2.5 glass rounded-lg text-red-400 hover:bg-red-500/10"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    {chapter.lessons?.map((lesson: any, lessonIdx: number) => (
                                        <div key={lesson.id} className="flex items-center gap-4 glass group border-transparent hover:border-purple-500/10 transition-all p-2 pl-6">
                                            <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-slate-600 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-all">
                                                <PlayCircle size={24} />
                                                <span className="absolute text-[8px] font-black bottom-1">{lessonIdx + 1}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-white font-bold text-sm truncate">{lesson.title}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">فيديو محمل</span>
                                                    <div className="w-1 h-1 rounded-full bg-slate-800" />
                                                    <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">12:30 م</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-2 text-slate-500 hover:text-white"><ImageIcon size={18} /></button>
                                                <button className="p-2 text-slate-500 hover:text-white"><FileText size={18} /></button>
                                                <div className="w-px h-6 bg-white/5 mx-2" />
                                                <button className="p-2 text-slate-500 hover:text-white"><Edit size={18} /></button>
                                                <button className="p-2 text-red-400 hover:text-red-500"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    <button 
                                        onClick={() => addLesson(chapter.id)}
                                        className="w-full py-4 rounded-2xl border-2 border-dashed border-white/5 text-slate-600 font-bold text-xs hover:border-purple-500/30 hover:text-purple-400 hover:bg-purple-500/5 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
                                    >
                                        <Plus size={16} />
                                        إضافة درس للفصل
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={addChapter}
                        className="w-full py-6 rounded-3xl premium-gradient text-white font-black text-sm shadow-xl shadow-purple-900/40 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-4"
                    >
                        <Plus size={24} />
                        إضافة فصل جديد للمنهاج
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
}
