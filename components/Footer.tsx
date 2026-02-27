"use client";

import Link from "next/link";
import { Github, Twitter, Youtube, Mail } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="relative pt-24 pb-12 border-t border-white/5 section-grid-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative w-8 h-8 overflow-hidden group-hover:scale-110 transition-transform">
                <Image
                  src="/logo.png"
                  alt="Doraty Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold gradient-text-blue">{t.hero.title}</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              {t.footer.description}
            </p>
            <div className="flex items-center gap-4">
              {[Twitter, Github, Youtube].map((Icon: any, i: number) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg glass border border-white/5 text-slate-400 hover:text-white hover:border-white/20 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
              {t.footer.product}
            </h4>
            <ul className="space-y-4">
              {[t.nav.features, t.nav.howItWorks, t.nav.platforms, t.nav.security].map((link: string) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-sm text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
              {t.footer.legal}
            </h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-500 hover:text-blue-400 transition-colors"
                >
                  {t.common.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-500 hover:text-blue-400 transition-colors"
                >
                  {t.common.termsOfService}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6">
              {t.footer.contact}
            </h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-500" />
                <a
                  href="mailto:support@doraty.app"
                  className="hover:text-blue-400 transition-colors"
                >
                  support@doraty.app
                </a>
              </li>
              <li className="mt-8">
                <div className="p-4 rounded-xl glass border border-white/5">
                  <p className="text-xs italic text-slate-400 leading-relaxed">
                    {t.hero.subtitle}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600">
            © 2026 {t.hero.title}. {t.common.allRightsReserved}
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-slate-700 uppercase tracking-widest font-bold">
              Designed with Excellence
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
