"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { 
  QrCode, 
  Key, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  Camera,
  PlayCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ActivatePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [activatedCourse, setActivatedCourse] = useState<any>(null);

  const handleActivate = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setStatus("idle");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setLoading(false);
        setErrorMsg("يرجى تسجيل الدخول أولاً لتفعيل الدورة.");
        setStatus("error");
        return;
    }

    // 1. Check if code exists and is not used
    const { data: qrData, error: qrError } = await supabase
        .from("qr_codes")
        .select("*, courses(*)")
        .eq("code", code.toUpperCase())
        .eq("is_used", false)
        .single();
    
    if (qrError || !qrData) {
        setLoading(false);
        setErrorMsg("كود التفعيل غير صحيح أو تم استخدامه مسبقاً.");
        setStatus("error");
        return;
    }

    // 2. Enroll user in course
    const { error: enrollError } = await supabase
        .from("enrollments")
        .insert({
            user_id: user.id,
            course_id: qrData.course_id,
            enrollment_date: new Date().toISOString()
        });
    
    if (enrollError) {
        setLoading(false);
        setErrorMsg("حدث خطأ أثناء التفعيل. يرجى المحاولة لاحقاً.");
        setStatus("error");
        return;
    }

    // 3. Mark code as used
    await supabase.from("qr_codes").update({ is_used: true }).eq("id", qrData.id);

    setActivatedCourse(qrData.courses);
    setStatus("success");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0f172a] font-cairo">
      <Navbar />

      <div className="pt-40 pb-32 px-6 max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
            {status !== "success" ? (
                <motion.div 
                    key="input-form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass border-white/5 p-12 text-center relative overflow-hidden rounded-[40px]"
                >
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    
                    <div className="relative z-10 space-y-12">
                        <div>
                            <div className="w-20 h-20 rounded-[2rem] premium-gradient flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-900/40">
                                <QrCode className="text-white" size={40} />
                            </div>
                            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">تفعيل بطاقتك التعليمية</h1>
                            <p className="text-slate-500 font-medium text-lg">أدخل الكود المطبوع على خلفية البطاقة للوصول الفوري إلى محتويات الدورة.</p>
                        </div>

                        <div className="flex flex-col gap-6 max-w-md mx-auto">
                            <div className="relative group">
                                <Key className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-purple-400 transition-colors" size={20} />
                                <input 
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    placeholder="أدخل كود التفعيل هنا..."
                                    className="w-full glass py-6 pr-16 pl-8 text-white text-2xl font-black tracking-[0.3em] outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-slate-800 placeholder:text-lg placeholder:tracking-normal placeholder:font-bold"
                                />
                            </div>

                            <button 
                                onClick={handleActivate}
                                disabled={loading}
                                className="w-full py-6 premium-gradient rounded-3xl text-white font-black text-xl shadow-2xl shadow-purple-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Zap size={24} />
                                        <span>تفعيل الدورة الآن</span>
                                    </>
                                )}
                            </button>

                            <button className="flex items-center justify-center gap-2 text-slate-500 font-bold hover:text-white transition-all text-sm py-2">
                                <Camera size={18} />
                                <span>مسح كود الـ QR من الكاميرا</span>
                            </button>
                        </div>

                        {status === "error" && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-5 glass border-red-500/20 bg-red-500/5 text-red-400 font-bold flex items-center gap-4 justify-center"
                            >
                                <XCircle size={20} />
                                <span>{errorMsg}</span>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    key="success-screen"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass border-white/10 p-12 text-center rounded-[50px] shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-green-500/5 animate-pulse" />
                    <div className="relative z-10 space-y-12">
                        <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto text-white shadow-2xl shadow-green-900/40">
                            <CheckCircle2 size={56} />
                        </div>
                        
                        <div>
                            <h2 className="text-5xl font-black text-white mb-6">تهانينا! تم التفعيل بنجاح</h2>
                            <p className="text-slate-400 text-xl font-medium">أصبح بإمكانك الآن البدء بمتابعة كافة دروس دورة:</p>
                            <div className="mt-8 p-8 glass border-purple-500/20 inline-block rounded-3xl">
                                <h3 className="text-3xl font-black text-gradient leading-tight">{activatedCourse?.title}</h3>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                            <Link 
                                href={`/courses/${activatedCourse?.id}`}
                                className="px-16 py-6 premium-gradient rounded-3xl text-white font-black text-xl shadow-2xl shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                            >
                                <PlayCircle size={28} />
                                ابدأ المشاهدة فوراً
                            </Link>
                            <Link 
                                href="/profile"
                                className="px-12 py-6 glass rounded-3xl text-white font-black text-xl hover:bg-white/5 transition-all"
                            >
                                دوراتي المسجلة
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
