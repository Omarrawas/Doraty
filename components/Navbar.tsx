"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const { locale, t, toggleLanguage, dir } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.features, href: "#features" },
    { label: t.nav.howItWorks, href: "#how-it-works" },
    { label: t.nav.platforms, href: "#platforms" },
    { label: t.nav.security, href: "#security" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-dark py-3 shadow-xl shadow-black/20"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/40 transition-shadow duration-300">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text-blue">{t.hero.title}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors duration-200 font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass border border-white/10 hover:border-white/20 transition-all text-xs font-bold text-slate-300 hover:text-white"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              {locale === "ar" ? "English" : "عربي"}
            </button>

            <a
              href="https://doraty-app.vercel.app"
              className="btn-secondary text-sm py-2 px-4 whitespace-nowrap"
            >
              {t.common.openWebApp}
            </a>
            <a
              href="https://doraty-app.vercel.app"
              className="btn-primary text-sm py-2 px-5 whitespace-nowrap"
            >
              {t.common.signIn}
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Toggle language"
            >
              <Globe className="w-4 h-4" />
            </button>
            <button
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10 overflow-hidden animate-fade-in">
            <div className="flex flex-col gap-2 pt-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all font-medium"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
                <a
                  href="https://doraty-app.vercel.app"
                  className="btn-secondary text-sm text-center"
                >
                  {t.common.openWebApp}
                </a>
                <a
                  href="https://doraty-app.vercel.app"
                  className="btn-primary text-sm text-center justify-center"
                >
                  {t.common.signIn}
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
