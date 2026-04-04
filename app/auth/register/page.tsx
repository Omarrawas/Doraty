"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { UserPlus, Mail, Lock, User, AlertCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      // Create user profile in the database
      if (authData.user) {
        await supabase.from("users").insert({
          id: authData.user.id,
          full_name: fullName,
          email: email,
        });
      }
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-900/20 blur-[100px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-md p-10 relative z-10 border-white/5 shadow-2xl"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 premium-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/20">
            <UserPlus className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">إنشاء حساب</h1>
          <p className="text-slate-400">انضم لأكثر من 10,000 طالب في أكاديمية دوراتي</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 pr-2">الاسم الكامل</label>
            <div className="relative">
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full glass py-4 pr-12 pl-4 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="أدخل اسمك الكامل"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 pr-2">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass py-4 pr-12 pl-4 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="example@mail.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300 pr-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass py-4 pr-12 pl-4 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm glass !bg-red-500/5 p-4 border-red-500/20">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 premium-gradient rounded-2xl text-white font-bold text-lg shadow-lg shadow-purple-900/30 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 mt-6"
          >
            {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
          </button>
        </form>

        <div className="mt-10 text-center text-slate-400">
          لديك حساب بالفعل؟{" "}
          <Link href="/auth/login" className="text-purple-400 font-bold hover:underline inline-flex items-center gap-1 group">
            <ArrowLeft size={16} className="group-hover:translate-x-[4px] transition-transform" />
            تسجيل الدخول
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
