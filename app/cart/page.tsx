"use client";

import React, { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { 
  Trash2, 
  ShoppingBag, 
  ChevronLeft, 
  CreditCard, 
  ArrowRight,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function CartPage() {
  const { cart, removeFromCart, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        alert("يرجى تسجيل الدخول أولاً");
        setLoading(false);
        return;
    }

    try {
        // Enroll in all courses in cart
        for (const item of cart) {
            await supabase.from("enrollments").upsert({
                user_id: user.id,
                course_id: item.id,
                status: "active"
            });
        }
        
        setSuccess(true);
        clearCart();
    } catch (e) {
        console.error("Enrollment failed", e);
    } finally {
        setLoading(false);
    }
  };

  if (success) {
    return (
        <div className="min-h-screen bg-[#0f172a] pt-40 pb-20 px-6 font-cairo">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto glass p-12 text-center border-white/5 rounded-[3rem]"
            >
                <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-900/20 border border-green-500/20">
                    <CheckCircle size={56} />
                </div>
                <h1 className="text-4xl font-black text-white mb-4">تم الاشتراك بنجاح!</h1>
                <p className="text-slate-400 mb-12 text-lg">لقد تمت إضافة الدورات إلى حسابك بنجاح. يمكنك الآن البدء بالتعلم فوراً.</p>
                
                <Link 
                    href="/profile" 
                    className="inline-flex items-center gap-3 px-10 py-5 premium-gradient text-white rounded-2xl font-black text-lg shadow-xl shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all"
                >
                    ابدأ التعلم الآن
                    <ArrowRight size={20} />
                </Link>
            </motion.div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] pt-40 pb-20 px-6 font-cairo">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Cart List */}
            <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-4xl font-black text-white uppercase tracking-wider">سلة المشتريات</h1>
                    <span className="glass px-4 py-1.5 text-slate-500 rounded-lg font-bold text-xs">{cart.length} دورات</span>
                </div>

                <AnimatePresence mode="popLayout">
                    {cart.length === 0 ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass p-20 text-center border-white/5 rounded-[3rem]"
                        >
                            <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-600">
                                <ShoppingBag size={48} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">السلة فارغة حالياً</h2>
                            <p className="text-slate-500 mb-10">لم تقم بإضافة أي دورات بعد. استكشف دوراتنا الآن!</p>
                            <Link href="/explore" className="px-10 py-4 premium-gradient text-white rounded-2xl font-black inline-flex items-center gap-3 hover:scale-105 transition-all">
                                تصفح الدورات
                                <ChevronLeft size={20} />
                            </Link>
                        </motion.div>
                    ) : (
                        cart.map((item) => (
                            <motion.div 
                                key={item.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="glass p-6 border-white/5 flex flex-col md:flex-row items-center gap-8 rounded-[2rem] hover:border-purple-500/20 transition-all group"
                            >
                                <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
                                    <img src={item.image_url || "/course.jpg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                
                                <div className="flex-1 text-right w-full">
                                    <p className="text-purple-400 text-[10px] font-black uppercase tracking-widest mb-1">أ. {item.instructor}</p>
                                    <h3 className="text-white font-black text-xl mb-4 line-clamp-1">{item.title}</h3>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 font-bold">
                                        <span className="text-green-400">وصول مدى الحياة</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                                        <span>75+ درس</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 w-full md:w-auto">
                                    <div className="text-left w-full md:w-32">
                                        <p className="text-2xl font-black text-white">{item.price} <span className="text-[10px] text-slate-600">ل.س</span></p>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="w-12 h-12 glass border-white/5 rounded-xl flex items-center justify-center text-slate-600 hover:bg-red-500/20 hover:text-red-500 transition-all shrink-0"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
                <div className="glass p-10 border-white/5 rounded-[3rem] sticky top-32 shadow-2xl space-y-8 bg-white/[0.02]">
                    <h2 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-4">
                        <CreditCard className="text-purple-400" />
                        ملخص الطلب
                    </h2>

                    <div className="space-y-4 pt-4">
                        <div className="flex justify-between text-slate-500 font-bold">
                            <span>عدد الدورات</span>
                            <span>{cart.length}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 font-bold">
                            <span>رسوم التسجيل</span>
                            <span className="text-green-500">مجاناً</span>
                        </div>
                        <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                            <div>
                                <p className="text-[10px] text-slate-500 font-black uppercase mb-1">المجموع الكلي</p>
                                <p className="text-4xl font-black text-white">{total} <span className="text-xs text-slate-700">ل.س</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 glass border-yellow-500/20 bg-yellow-500/5 rounded-2xl flex gap-4">
                        <AlertCircle className="text-yellow-500 shrink-0" size={20} />
                        <p className="text-xs text-slate-400 leading-relaxed">
                            بمجرد الضغط على تأكيد الاشتراك، ستتمكن من الوصول لكافة الدروس والملفات المرفقة فوراً.
                        </p>
                    </div>

                    <button 
                        disabled={cart.length === 0 || loading}
                        onClick={handleEnroll}
                        className="w-full py-6 premium-gradient text-white rounded-3xl font-black text-xl shadow-2xl shadow-purple-900/40 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-4"
                    >
                        {loading ? "جاري التفعيل..." : "تأكيد الاشتراك وتفعيل الحساب"}
                    </button>

                    <Link href="/explore" className="block text-center text-slate-500 font-bold text-sm hover:text-white transition-colors">
                        العودة لاستكشاف المزيد
                    </Link>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
