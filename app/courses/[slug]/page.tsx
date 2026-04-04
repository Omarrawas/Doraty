"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/lib/CartContext";
import { motion } from "framer-motion";
import { 
  Star, Users, Play, ShoppingCart, CheckCircle2, 
  Award, BookOpen, Clock, Video, Calendar, Lock
} from "lucide-react";
import MainLayout from "@/components/MainLayout";

export default function CourseDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart } = useCart();

  const isInCart = cart.find(i => i.id === course?.id);

  useEffect(() => {
    async function fetchCourseData() {
      const { data: courseData } = await supabase
        .from("courses")
        .select("*, users!instructor_id(*)")
        .eq("id", slug)
        .single();
      
      if (courseData) {
        setCourse(courseData);
        
        if (courseData.delivery_mode === 'live' || courseData.delivery_mode === 'in_person') {
            // Fetch Sessions instead of Chapters
            const { data: sessionsData } = await supabase
              .from("sessions")
              .select("*")
              .eq("course_id", courseData.id)
              .order("scheduled_at", { ascending: true });
            
            if (sessionsData) setSessions(sessionsData);
        } else {
            // Fetch Chapters
            const { data: chaptersData } = await supabase
              .from("chapters")
              .select("*, lessons(*)")
              .eq("course_id", courseData.id)
              .order("order_index");
            if (chaptersData) setChapters(chaptersData);
        }

        // Fetch Reviews
        const { data: reviewsData } = await supabase
          .from("course_reviews")
          .select("*, users(*)")
          .eq("course_id", courseData.id)
          .order("created_at", { ascending: false });
        if (reviewsData) setReviews(reviewsData);
      }
      setLoading(false);
    }
    fetchCourseData();
  }, [slug]);

  const handleAddToCart = () => {
    if (course) {
        addToCart({
            id: course.id,
            title: course.title,
            price: course.price,
            image_url: course.image_url,
            instructor: course.users?.full_name
        });
    }
  };

  const handleEnrollDirectly = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert("يرجى تسجيل الدخول أولاً");
        return;
    }
    await supabase.from("enrollments").upsert({
        user_id: user.id,
        course_id: course.id,
        status: "active"
    });
    alert("تم الاشتراك بنجاح!");
  };

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!course) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white text-2xl">الدورة غير موجودة</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] pb-20 font-cairo">
      {/* Course Header Banner */}
      <div className="relative h-[500px] overflow-hidden">
        <img src={course.image_url} className="absolute inset-0 w-full h-full object-cover blur-[100px] opacity-20 scale-125" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f172a]/80 to-[#0f172a]" />
        
        <div className="relative max-w-7xl mx-auto pt-40 px-6 flex flex-col md:flex-row gap-16 items-start z-10">
          {/* Main Info */}
          <div className="flex-1">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center gap-4 mb-8">
                    <span className="glass px-5 py-2 text-purple-400 text-xs font-black uppercase tracking-widest rounded-full bg-purple-500/5 border-purple-500/20">{course.category || "برمجة"}</span>
                    <div className="flex items-center gap-2 text-yellow-400 glass px-4 py-1.5 rounded-full border-yellow-500/10">
                        <Star size={16} fill="currentColor" />
                        <span className="font-black text-sm">{course.rating || "4.9"}</span>
                    </div>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                    {course.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-8 text-slate-400">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl border-2 border-purple-500/30 overflow-hidden shadow-xl shadow-purple-900/20">
                            <img src={course.users?.avatar_url || "/person.jpg"} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">المدرب المعتمد</p>
                            <span className="font-bold text-white">أ. {course.users?.full_name}</span>
                        </div>
                    </div>
                    <div className="w-px h-10 bg-white/5 hidden sm:block" />
                    <div className="flex items-center gap-2">
                        <Users size={20} className="text-purple-500" />
                        <span className="font-bold text-slate-200">{course.students_count || 1200} طالب طموح</span>
                    </div>
                </div>
            </motion.div>
          </div>

          {/* Checkout Card (Desktop Overlay) */}
          <div className="hidden lg:block w-[450px] -mb-60 z-30">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-10 sticky top-32 shadow-3xl shadow-black/80 border-white/5 rounded-[3rem] bg-white/[0.01] backdrop-blur-3xl overflow-hidden"
            >
              <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-purple-500/10 blur-[80px] rounded-full" />
              
              <div className="relative rounded-[2rem] overflow-hidden mb-10 aspect-video shadow-2xl group">
                <img src={course.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="w-20 h-20 premium-gradient rounded-full flex items-center justify-center text-white shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                    <Play size={28} fill="currentColor" />
                  </button>
                </div>
              </div>

              <div className="flex items-end justify-between mb-10">
                <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">سعر الدورة</p>
                    <div className="text-5xl font-black text-white">
                        {course.price} <span className="text-sm font-normal text-slate-600 pr-1">ل.س</span>
                    </div>
                </div>
                <div className="text-green-400 font-bold bg-green-500/10 px-4 py-1 rounded-lg border border-green-500/20 text-xs">خصم الإطلاق</div>
              </div>

              <div className="flex flex-col gap-5">
                <button 
                    onClick={handleEnrollDirectly}
                    className="w-full py-6 premium-gradient rounded-[1.5rem] text-white font-black text-xl shadow-2xl shadow-purple-900/40 hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  سجل الآن في الدورة
                </button>
                <button 
                    onClick={handleAddToCart}
                    disabled={isInCart}
                    className={`w-full py-6 glass rounded-[1.5rem] text-white font-black text-xl flex items-center justify-center gap-3 transition-all border-white/5 ${
                        isInCart ? "bg-purple-500/10 border-purple-500/30 text-purple-400 cursor-default" : "hover:bg-white/5"
                    }`}
                >
                  <ShoppingCart size={22} className={isInCart ? "fill-purple-400" : ""} />
                  <span>{isInCart ? "في السلة" : "إضافة للسلة"}</span>
                </button>
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <div className="glass p-4 border-white/5 rounded-2xl flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-purple-400" />
                  <span className="text-[10px] text-slate-400 font-bold">دخول دائم</span>
                </div>
                <div className="glass p-4 border-white/5 rounded-2xl flex items-center gap-3">
                  <Award size={18} className="text-purple-400" />
                  <span className="text-[10px] text-slate-400 font-bold">شهادة معتمدة</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 mt-20 md:mt-40 grid grid-cols-1 lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2 space-y-24">
          
          {/* Description */}
          <section>
            <h2 className="text-3xl font-black text-white mb-10 flex items-center gap-4">
                <CheckCircle2 className="text-purple-500" size={32} />
                ماذا ستتعلم في هذه الرحلة؟
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(course.description?.split('\n') || []).filter((l: string) => l.trim()).map((line: string, i: number) => (
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="glass p-6 border-white/5 rounded-2xl flex gap-4 bg-white/[0.01]"
                >
                  <div className="w-6 h-6 rounded-full premium-gradient flex items-center justify-center shrink-0 mt-1">
                    <CheckCircle2 className="text-white" size={14} />
                  </div>
                  <p className="text-slate-400 font-medium leading-relaxed">{line}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Curriculum / Sessions */}
          <section>
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-black text-white flex items-center gap-4">
                    {course.delivery_mode === 'live' || course.delivery_mode === 'in_person' ? (
                        <><Video className="text-purple-500" size={32} /> مواعيد الجلسات المباشرة</>
                    ) : (
                        <><BookOpen className="text-purple-500" size={32} /> منهج الدورة الاحترافي</>
                    )}
                </h2>
                <div className="glass px-6 py-2 rounded-xl text-slate-500 font-bold text-sm">
                    {course.delivery_mode === 'live' || course.delivery_mode === 'in_person' 
                        ? `${sessions.length} جلسات`
                        : `${chapters.length} فصول • ${chapters.reduce((sum, c) => sum + (c.lessons?.length || 0), 0)} دروس`}
                </div>
            </div>
            
            <div className="space-y-6">
              {course.delivery_mode === 'live' || course.delivery_mode === 'in_person' ? (
                  sessions.length === 0 ? (
                      <div className="glass p-10 rounded-3xl border-white/5 text-center text-slate-500">لا توجد جلسات مجدولة حتى الآن.</div>
                  ) : (
                      sessions.map((session, i) => {
                          const statusColor = session.status === 'upcoming' 
                                ? "text-orange-400" 
                                : session.status === 'live_now'
                                    ? "text-red-400" 
                                    : session.status === 'completed' 
                                        ? "text-green-400" 
                                        : "text-slate-400";
                          const isFinished = session.status === 'completed';
                          const hasRecording = isFinished && session.recording_url;

                          return (
                              <motion.div 
                                  initial={{ opacity: 0, y: 20 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  key={session.id} 
                                  className="glass overflow-hidden border-white/5 rounded-3xl"
                              >
                                  <div className="p-8 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-colors">
                                      <div className="flex items-center gap-6">
                                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black shadow-xl shadow-purple-900/20 bg-white/5 border border-white/10 ${statusColor}`}>
                                              {session.platform === 'zoom' ? <Video size={24} /> : <BookOpen size={24} />}
                                          </div>
                                          <div>
                                              <h3 className="text-xl font-black text-white mb-2">{session.title}</h3>
                                              <div className="flex items-center gap-6 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                                                  <div className="flex items-center gap-2"><Calendar size={14} className={statusColor} /> <span>{new Date(session.scheduled_at).toLocaleString('ar-SA')}</span></div>
                                              </div>
                                          </div>
                                      </div>
                                      <div>
                                          {!isFinished ? (
                                              <button onClick={handleEnrollDirectly} className={`px-6 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 transition-colors border border-white/10 ${statusColor}`}>
                                                  أنت غير مسجل
                                              </button>
                                          ) : (
                                              <button onClick={handleEnrollDirectly} className="px-6 py-3 rounded-xl font-bold bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors border border-purple-500/20">
                                                  {hasRecording ? "مشاهدة التسجيل" : "منتهية"} <Lock size={16} className="inline ml-1" />
                                              </button>
                                          )}
                                      </div>
                                  </div>
                              </motion.div>
                          );
                      })
                  )
              ) : (
                  chapters.map((chapter, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        key={chapter.id} 
                        className="glass overflow-hidden border-white/5 rounded-3xl"
                    >
                      <div className="p-8 flex items-center justify-between group cursor-pointer hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl premium-gradient flex items-center justify-center font-black text-xl text-white shadow-xl shadow-purple-900/20">
                            {i + 1}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-white mb-2">{chapter.title}</h3>
                            <div className="flex items-center gap-6 text-[10px] text-slate-500 font-black uppercase tracking-widest">
                              <div className="flex items-center gap-2"><BookOpen size={14} className="text-purple-400" /> <span>{chapter.lessons?.length || 0} دروس</span></div>
                              <div className="flex items-center gap-2"><Clock size={14} className="text-blue-400" /> <span>{chapter.duration_label || "1 ساعة"}</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/[0.02] px-8 py-4">
                        {chapter.lessons?.map((lesson: any) => (
                          <Link 
                            key={lesson.id} 
                            href={lesson.is_free ? `/lessons/${lesson.id}` : "#"} 
                            className={`py-5 border-b border-white/5 last:border-0 flex items-center justify-between group ${
                              !lesson.is_free ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                            }`}
                          >
                            <div className="flex items-center gap-5">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                                  lesson.is_free ? "glass text-purple-400 group-hover:premium-gradient group-hover:text-white" : "text-slate-700"
                              }`}>
                                <Play size={18} fill={lesson.is_free ? "currentColor" : "none"} className={lesson.is_free ? "" : "opacity-20"} />
                              </div>
                              <span className="text-slate-300 font-bold group-hover:text-white transition-colors">{lesson.title}</span>
                              {lesson.is_free && <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-3 py-1 rounded-full uppercase tracking-widest">متاح للمعاينة</span>}
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-slate-600 font-mono italic">{lesson.duration_label || "10:00"}</span>
                              {!lesson.is_free && <Lock size={16} className="text-slate-800" />}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  ))
              )}
            </div>
          </section>

          {/* Reviews Section */}
          <section id="reviews" className="pt-20">
            <h2 className="text-3xl font-black text-white mb-12 flex items-center gap-4">
                <Star className="text-yellow-500" size={32} />
                آراء وتجارب الطلاب
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {reviews.length > 0 ? (
                    reviews.map((rev) => (
                        <div key={rev.id} className="glass p-8 border-white/5 rounded-[2.5rem] bg-white/[0.01]">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/20">
                                    <img src={rev.users?.avatar_url || "/person.jpg"} className="w-full h-full object-cover" />
                                </div>
                                <div className="text-right">
                                    <h4 className="text-white font-bold">{rev.users?.full_name}</h4>
                                    <div className="flex items-center gap-1 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={10} className={i < rev.rating ? "text-yellow-500 fill-yellow-500" : "text-slate-600"} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-slate-400 leading-relaxed font-medium">"{rev.comment}"</p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full glass p-12 text-center rounded-3xl border-white/5">
                        <p className="text-slate-500 font-bold mb-4">لا توجد مراجعات لهذه الدورة بعد.</p>
                        <p className="text-xs text-slate-700">كن أول من يترك انطباعه ومساعد زملائك!</p>
                    </div>
                )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
