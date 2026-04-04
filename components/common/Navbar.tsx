"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { 
  GraduationCap, 
  LogIn, 
  User, 
  Menu, 
  X, 
  Book, 
  Zap, 
  Lightbulb, 
  Heart, 
  QrCode, 
  Award, 
  Grid, 
  ShoppingCart,
  Bell
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { cart } = useCart();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
        if (user) {
            supabase.from("app_notifications").select("*", { count: "exact" }).eq("user_id", user.id).eq("is_read", false).then(({ count }) => {
                setUnreadCount(count || 0);
            });
        }
    });
    
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "/", icon: <Zap size={18} /> },
    { name: "استكشف", href: "/explore", icon: <Grid size={18} /> },
    { name: "الدورات", href: "/courses", icon: <Book size={18} /> },
    { name: "تفعيل الكود", href: "/activate", icon: <QrCode size={18} /> },
    { name: "المفضلة", href: "/favorites", icon: <Heart size={18} /> },
    { name: "الشهادات", href: "/profile/certificates", icon: <Award size={18} /> },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4`}>
      <nav 
        className={`max-w-7xl mx-auto flex items-center justify-between px-8 py-4 rounded-2xl transition-all duration-500 ${
          scrolled ? "glass shadow-2xl border-white/10" : "bg-transparent"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/30 group-hover:scale-110 transition-transform">
            <GraduationCap className="text-white" size={24} />
          </div>
          <span className="text-xl font-black text-white tracking-tight hidden sm:block">دورا⁠تــي</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="text-slate-300 font-bold hover:text-purple-400 transition-colors flex items-center gap-2"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Buttons */}
          {/* Notifications Icon (Authenticated) */}
          {user && (
            <Link href="/notifications" className="relative w-11 h-11 glass rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all border-white/5 mx-1">
                <Bell size={20} />
                <AnimatePresence>
                {unreadCount > 0 && (
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-[#1e293b]"
                    >
                        {unreadCount}
                    </motion.div>
                )}
                </AnimatePresence>
            </Link>
          )}

          {/* Cart Icon */}
          <Link href="/cart" className="relative w-11 h-11 glass rounded-xl flex items-center justify-center text-white hover:bg-white/10 transition-all border-white/5">
            <ShoppingCart size={20} />
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 premium-gradient rounded-full flex items-center justify-center text-[10px] font-black border-2 border-[#1e293b]"
                >
                  {cart.length}
                </motion.div>
              )}
            </AnimatePresence>
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              {/* Role-based Dashboard link */}
              <Link href="/admin/dashboard" className="hidden md:flex items-center gap-2 text-purple-400 font-bold hover:text-white transition-all text-sm px-4 py-2 border border-purple-500/20 rounded-xl glass hover:bg-purple-500/5">
                لوحة التحكم
              </Link>
              
              <Link href="/profile" className="flex items-center gap-3 glass pl-6 pr-2 py-2 rounded-full hover:bg-white/10 transition-all group">
              <div className="w-8 h-8 rounded-full premium-gradient p-[1px]">
                  <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center overflow-hidden">
                    <User className="text-slate-300" size={16} />
                  </div>
              </div>
              <span className="text-sm font-bold text-slate-200 hidden md:block">حسابي</span>
            </Link>
          ) : (
            <Link href="/auth/login" className="flex items-center gap-2 glass px-6 py-2.5 rounded-xl text-white font-bold hover:bg-white/10 transition-all border-white/10">
              <LogIn size={18} />
              <span>دخول</span>
            </Link>
          )}

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-11 h-11 glass rounded-xl flex items-center justify-center text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-[100%] left-6 right-6 mt-4 glass border-white/5 p-6 space-y-4 shadow-2xl z-40 overflow-hidden"
          >
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-4 p-4 rounded-xl text-slate-300 hover:bg-purple-500/10 hover:text-purple-400 transition-all font-bold"
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
