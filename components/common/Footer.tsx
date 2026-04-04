"use client";

import React from "react";
import { 
  Instagram, 
  Linkedin, 
  Youtube, 
  Twitter as XIcon, 
  MessageSquare,
  Music,
  HelpCircle,
  Apple,
  Play,
  Ghost
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#121212] pt-28 pb-14 px-8 border-t border-white/5 font-cairo text-right">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          
          {/* Logo Column */}
          <div className="space-y-10">
            <div className="flex items-center gap-2 justify-end">
                <span className="text-3xl font-black text-white tracking-tighter">doraty<span className="text-purple-500">:</span></span>
            </div>
            <p className="text-slate-400 font-medium leading-[1.8] text-[15px]">
                هدفنا الرئيسي هو دمج التكنولوجيا مع جودة التعليم بطريقة سلسة ليتمكن الجميع من الحصول على أفضل أنواع التعليم بأسلوب واضح ومبسط.
            </p>
            <div className="flex items-center gap-3 justify-end">
                {[
                  { icon: <Instagram size={18} />, href: "#" },
                  { icon: <XIcon size={18} />, href: "#" },
                  { icon: <Youtube size={18} />, href: "#" },
                  { icon: <Linkedin size={18} />, href: "#" },
                  { icon: <Ghost size={18} />, href: "#" }, // Snapchat placeholder
                  { icon: <Music size={18} />, href: "#" }, // TikTok icon
                ].map((social, i) => (
                    <motion.a 
                        key={i}
                        href={social.href}
                        whileHover={{ scale: 1.1, color: "#a855f7" }}
                        className="w-11 h-11 glass rounded-xl flex items-center justify-center text-slate-400 border-white/5 bg-white/[0.02]"
                    >
                        {social.icon}
                    </motion.a>
                ))}
            </div>
          </div>

          {/* Links Column */}
          <div className="space-y-10">
            <h4 className="text-white font-black text-sm uppercase tracking-widest">الروابط</h4>
            <ul className="space-y-5">
              {[
                "الرئيسية", 
                "اشترك", 
                "اتصل بنا", 
                "اشتراك الشركات؟ تواصل معنا", 
                "دورات غير مشمولة بالإشتراكات"
              ].map((link, i) => (
                <li key={i}>
                    <Link href="#" className="text-slate-400 hover:text-white font-bold transition-all hover:translate-x-[-4px] block">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Column */}
          <div className="space-y-10">
            <h4 className="text-white font-black text-sm uppercase tracking-widest">عن دورات</h4>
            <ul className="space-y-5">
              {[
                "سياسة الخصوصية", 
                "الشروط والاحكام", 
                "الأسئلة الشائعة"
              ].map((link, i) => (
                <li key={i}>
                    <Link href="#" className="text-slate-400 hover:text-white font-bold transition-all hover:translate-x-[-4px] block">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Apps Column */}
          <div className="space-y-10">
            <h4 className="text-white font-black text-sm uppercase tracking-widest">التطبيقات</h4>
            <div className="space-y-5">
                <a href="#" className="flex items-center gap-5 glass p-5 rounded-3xl border-white/5 hover:bg-white/[0.04] transition-all group max-w-[240px] mr-auto lg:mr-0">
                    <Apple className="text-white group-hover:text-purple-400" size={28} />
                    <div className="text-right">
                        <div className="text-[11px] text-slate-500 font-black uppercase">تنزيل من</div>
                        <div className="text-lg text-white font-black">App Store</div>
                    </div>
                </a>
                <a href="https://play.google.com/store/apps/details?id=com.doraty.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 glass p-5 rounded-3xl border-white/5 hover:bg-white/[0.04] transition-all group max-w-[240px] mr-auto lg:mr-0">
                    <Play className="text-white group-hover:text-purple-400 fill-white group-hover:fill-purple-400" size={28} />
                    <div className="text-right">
                        <div className="text-[11px] text-slate-500 font-black uppercase">تنزيل من</div>
                        <div className="text-lg text-white font-black">Google Play</div>
                    </div>
                </a>
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-16 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="flex items-center gap-10">
            <span className="text-slate-600 font-bold text-sm">حقوق الطبع محفوظة &copy; 2026 دورات</span>
          </div>

          <div className="flex items-center gap-5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
               <div className="glass px-4 py-2 rounded-xl border-white/5 text-[11px] font-black text-slate-400">VISA</div>
               <div className="glass px-4 py-2 rounded-xl border-white/5 text-[11px] font-black text-slate-400">MADA</div>
               <div className="glass px-4 py-2 rounded-xl border-white/5 text-[11px] font-black text-slate-400">MASTERCARD</div>
               <div className="glass px-4 py-2 rounded-xl border-white/5 text-[11px] font-black text-slate-400">KNET</div>
          </div>

          <Link href="/help" className="flex items-center gap-5 text-slate-500 hover:text-white transition-all group text-right">
            <div>
                <div className="text-[11px] font-black text-slate-600 uppercase mb-1">الحصول على مساعدة</div>
                <div className="text-[15px] font-black group-hover:text-purple-400">للمساعدة الرجاء الضغط هنا</div>
            </div>
            <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center group-hover:bg-purple-500/10 transition-all border-white/5">
                <HelpCircle size={22} className="group-hover:text-purple-400" />
            </div>
          </Link>

        </div>
      </div>
    </footer>
  );
}
