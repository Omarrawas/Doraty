"use client";

import React, { useState, useEffect } from "react";
import { Star, Clock, Users, Heart, Video, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

interface CourseCardProps {
  course: any;
  isInitialFavorite?: boolean;
}

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function CourseCard({ course, isInitialFavorite = false }: CourseCardProps) {
  const [isFavorite, setIsFavorite] = useState(isInitialFavorite);
  const [loading, setLoading] = useState(false);
  const { addToCart, cart } = useCart();

  const isInCart = cart.find(i => i.id === course.id);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        alert("يرجى تسجيل الدخول أولاً");
        setLoading(false);
        return;
    }
    if (isFavorite) {
        await supabase.from("course_favorites").delete().eq("user_id", user.id).eq("course_id", course.id);
    } else {
        await supabase.from("course_favorites").insert({ user_id: user.id, course_id: course.id });
    }
    setIsFavorite(!isFavorite);
    setLoading(false);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
        id: course.id,
        title: course.title,
        price: course.price,
        image_url: course.image_url,
        instructor: course.users?.full_name
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link href={`/courses/${course.id}`} className="block h-full">
        <div className="glass overflow-hidden border-white/5 flex flex-col h-full hover:border-purple-500/20 transition-all duration-500 relative">
          
          {/* Action Buttons Overlay */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <button 
                onClick={toggleFavorite}
                disabled={loading}
                className="w-10 h-10 glass rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all group/heart"
            >
                <motion.div animate={isFavorite ? { scale: [1, 1.3, 1] } : { scale: 1 }}>
                    <Heart size={20} className={`${isFavorite ? "fill-red-500 text-red-500" : "text-slate-400 group-hover/heart:text-white"} transition-colors`} />
                </motion.div>
            </button>
            <button 
                onClick={handleAddToCart}
                disabled={isInCart}
                className={`w-10 h-10 glass rounded-xl flex items-center justify-center transition-all ${
                    isInCart ? "bg-purple-500/50 text-white cursor-default" : "text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
            >
                <ShoppingCart size={20} className={isInCart ? "fill-white" : ""} />
            </button>
          </div>

          <div className="h-56 relative overflow-hidden">
            <img 
              src={course.image_url || "/placeholder.jpg"} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 delay-75" 
              alt={course.title}
            />
            {course.delivery_mode === 'live' || course.delivery_mode === 'in_person' ? (
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-500/90 backdrop-blur-md text-white px-3 py-1 text-[10px] font-black tracking-widest rounded-lg shadow-lg border border-red-400/50">
                    <Video size={12} strokeWidth={3} />
                    <span>مباشر</span>
                </div>
            ) : (
                (course.lessons_count > 0 || course.lessons?.length > 0) ? (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#434775]/95 backdrop-blur-md text-white px-3 py-1 text-[10px] font-black tracking-widest rounded-lg shadow-lg border border-white/10">
                        <BookOpen size={12} strokeWidth={3} />
                        <span>{course.lessons_count || course.lessons?.length} درس</span>
                    </div>
                ) : null
            )}
            
            <div className={`absolute top-4 ${course.delivery_mode === 'live' || course.delivery_mode === 'in_person' || course.lessons_count > 0 || course.lessons?.length > 0 ? "right-24" : "right-4"} glass px-3 py-1 flex items-center gap-1 text-yellow-400 text-xs font-bold rounded-lg border border-white/5`}>
                <Star size={12} fill="currentColor" />
                <span>{course.rating || "4.9"}</span>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0f172a] to-transparent opacity-60" />
          </div>
          
          <div className="p-6 flex flex-col flex-1 relative">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full premium-gradient p-[1px] shrink-0">
                    <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                        <img src={course.users?.avatar_url || "/person.jpg"} className="w-full h-full object-cover" />
                    </div>
                </div>
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest truncate">أ. {course.users?.full_name}</span>
            </div>

            <h3 className="text-white font-bold text-lg mb-4 line-clamp-2 leading-relaxed min-h-[3.5rem] group-hover:text-purple-400 transition-colors">
                {course.title}
            </h3>
            
            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-1"><Clock size={14} className="text-purple-400" /> <span>{course.duration_label || "15 ساعة"}</span></div>
                    <div className="flex items-center gap-1"><Users size={14} className="text-blue-400" /> <span>{course.students_count || 1200}</span></div>
                </div>
                <div className="text-2xl font-black text-white">
                    {course.price || "0"} <span className="text-[10px] pr-1 text-slate-600 font-bold">ل.س</span>
                </div>
            </div>
          </div>
          
          {/* Progress Bar (Example for enrolled courses) */}
          {course.progress !== undefined && (
            <div className="h-1 bg-white/5 w-full">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    className="h-full premium-gradient"
                />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
