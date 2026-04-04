"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User, Book, Settings, LogOut, ChevronRight, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profileData } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(profileData);

        const { data: enrollments } = await supabase
          .from("enrollments")
          .select("*, courses(*)")
          .eq("user_id", user.id);
        
        if (enrollments) {
          setEnrolledCourses(enrollments.map(e => ({
            ...e.courses,
            progress: e.progress_percentage || 0
          })));
        }
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">يرجى تسجيل الدخول أولاً</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass p-8 text-center border-white/5">
            <div className="w-24 h-24 rounded-full premium-gradient mx-auto mb-4 p-1">
              <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                <img src={profile?.avatar_url || "/person.jpg"} className="w-full h-full object-cover" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{profile?.full_name || "طالب دوراتي"}</h2>
            <p className="text-slate-500 text-sm mb-6">{user.email}</p>
            <div className="h-px bg-white/5 mb-6" />
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-500/10 text-purple-400 font-bold">
                <div className="flex items-center gap-3">
                  <Book size={18} />
                  <span>دوراتي</span>
                </div>
                <ChevronRight size={16} />
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-white/5 transition-colors">
                <Settings size={18} />
                <span>الإعدادات</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={18} />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>

          <div className="glass p-6 border-white/5">
            <h3 className="text-white font-bold mb-4">إحصائياتي</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-400">
                <Award className="text-purple-400" size={18} />
                <span className="text-sm">0 دورات مكتملة</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <Clock className="text-purple-400" size={18} />
                <span className="text-sm">0 ساعة تعلم</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">دوراتي التدريبية</h1>
            <span className="text-slate-500">{enrolledCourses.length} دورة</span>
          </div>

          {enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrolledCourses.map((course) => (
                <motion.div 
                  key={course.id}
                  whileHover={{ y: -5 }}
                  className="glass overflow-hidden border-white/5 group"
                >
                  <div className="h-32 overflow-hidden relative">
                    <img src={course.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/40" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-white font-bold mb-4 line-clamp-1">{course.title}</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>التقدم</span>
                            <span>{course.progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${course.progress}%` }}
                                className="h-full premium-gradient"
                            />
                        </div>
                    </div>
                    <Link 
                        href={`/courses/${course.id}`}
                        className="block w-full mt-6 py-3 rounded-xl glass text-center text-white text-sm font-bold hover:bg-white/10 transition-colors"
                    >
                        متابعة التعلم
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="glass p-20 text-center border-white/5">
              <Book className="text-slate-700 mx-auto mb-6" size={64} />
              <h3 className="text-xl font-bold text-white mb-2">لم تشترك في أي دورة بعد</h3>
              <p className="text-slate-500 mb-8">ابدأ رحلتك التعليمية الآن وتصفح مئات الدورات المميزة</p>
              <a href="/courses" className="inline-block px-10 py-4 premium-gradient rounded-2xl text-white font-bold shadow-lg shadow-purple-900/30">
                تصفح الدورات
              </a>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
