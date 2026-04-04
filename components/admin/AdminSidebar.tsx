"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Layers, 
  CreditCard, 
  Image as ImageIcon, 
  Settings, 
  ChevronRight,
  GraduationCap,
  Zap,
  Award,
  QrCode,
  Video
} from "lucide-react";
import { motion } from "framer-motion";

interface SidebarProps {
  role: "admin" | "teacher" | "super_admin";
}

export default function AdminSidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const adminLinks = [
    { name: "الإحصائيات", href: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "إدارة الدورات", href: "/admin/courses", icon: <BookOpen size={20} /> },
    { name: "جلسات البث المباشر", href: "/admin/sessions", icon: <Video size={20} /> },
    { name: "إدارة المدرسين", href: "/admin/teachers", icon: <Users size={20} /> },
    { name: "التصنيفات", href: "/admin/categories", icon: <Layers size={20} /> },
    { name: "الباقات", href: "/admin/bundles", icon: <Zap size={20} /> },
    { name: "إيصالات الدفع", href: "/admin/payments", icon: <CreditCard size={20} /> },
    { name: "الإعلانات", href: "/admin/banners", icon: <ImageIcon size={20} /> },
    { name: "أكواد التفعيل", href: "/admin/qr", icon: <QrCode size={20} /> },
  ];

  const teacherLinks = [
    { name: "لوحة التحكم", href: "/teacher/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "دوراتي", href: "/admin/courses", icon: <BookOpen size={20} /> }, // Sharing the same course list filtered by instructor
    { name: "الاختبارات", href: "/teacher/exams", icon: <HelpCircle size={20} /> },
    { name: "نتائج الطلاب", href: "/teacher/results", icon: <Award size={20} /> },
  ];

  const links = (role === "admin" || role === "super_admin") ? adminLinks : teacherLinks;

  return (
    <aside className="w-80 h-screen sticky top-0 bg-[#0f172a] border-l border-white/5 flex flex-col p-6 z-[80]">
      {/* Sidebar Logo */}
      <div className="flex items-center gap-4 mb-12 pr-2">
        <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center">
            <GraduationCap className="text-white" size={24} />
        </div>
        <div>
            <h1 className="text-xl font-black text-white">دورا⁠تــي</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{role === "admin" ? "لوحة الإدآرة" : "لوحة المدرس"}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${
                isActive ? "premium-gradient text-white shadow-lg shadow-purple-900/40" : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`${isActive ? "text-white" : "text-slate-500 group-hover:text-purple-400"} transition-colors`}>
                    {link.icon}
                </span>
                <span className="font-bold">{link.name}</span>
              </div>
              <ChevronRight size={16} className={`${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`} />
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Info */}
      <div className="mt-auto pt-6 border-t border-white/5">
        <Link href="/profile" className="flex items-center gap-4 p-4 rounded-2xl glass hover:bg-white/10 transition-all">
            <div className="w-10 h-10 rounded-full premium-gradient p-[1px]">
                <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                    <Users size={16} className="text-slate-300" />
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-white truncate">حسابي الشخصي</p>
                <p className="text-[10px] text-slate-500 truncate">إعدادات الحساب</p>
            </div>
            <Settings size={16} className="text-slate-600" />
        </Link>
      </div>
    </aside>
  );
}
