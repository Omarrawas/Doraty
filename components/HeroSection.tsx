"use client";

import {
  Monitor,
  Smartphone,
  Globe,
  Download,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden section-grid-bg noise-overlay">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 animate-float"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute top-1/4 -right-40 w-80 h-80 rounded-full opacity-15 animate-float"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)",
            filter: "blur(60px)",
            animationDelay: "2s",
          }}
        />
        <div
          className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full opacity-10 animate-float"
          style={{
            background:
              "radial-gradient(circle, rgba(34,197,94,0.5) 0%, transparent 70%)",
            filter: "blur(60px)",
            animationDelay: "4s",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/30 mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-slate-300 font-medium">
            {t.hero.badge}
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-4 animate-slide-up">
          <span className="gradient-text">{t.hero.title}</span>
        </h1>

        <p className="text-2xl sm:text-3xl font-semibold text-slate-200 mb-6 animate-slide-up">
          {t.hero.subtitle}
        </p>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed mb-12 animate-slide-up">
          {t.hero.description}
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-slide-up">
          <a
            href="https://doraty-app.vercel.app"
            className="btn-primary text-base px-8 py-4 glow-blue w-full sm:w-auto justify-center"
            id="hero-signin-btn"
          >
            {t.hero.ctaSignIn}
            <ExternalLink className="w-4 h-4 rtl:rotate-180" />
          </a>
          <a
            href="https://doraty-app.vercel.app"
            className="btn-secondary text-base px-8 py-4 w-full sm:w-auto justify-center"
            id="hero-webapp-btn"
          >
            <Globe className="w-4 h-4" />
            {t.hero.ctaWebApp}
          </a>
        </div>

        {/* Download Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in">
          <p className="text-slate-500 text-sm font-medium w-full sm:w-auto text-center sm:text-right sm:mr-2">
            {t.hero.downloadFor}
          </p>

          {/* Windows */}
          <a
            href="#platforms"
            id="hero-windows-btn"
            className="group flex items-center gap-3 px-5 py-3 rounded-xl glass border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <svg
              className="w-5 h-5 text-blue-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.8" />
            </svg>
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
              Windows
            </span>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </a>

          {/* Android */}
          <a
            href="#platforms"
            id="hero-android-btn"
            className="group flex items-center gap-3 px-5 py-3 rounded-xl glass border border-white/10 hover:border-green-500/40 hover:bg-green-500/5 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <svg
              className="w-5 h-5 text-green-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.523 15.341c-.285 0-.518-.23-.518-.52V8.85c0-.286.233-.518.518-.518.287 0 .521.232.521.518v5.972c0 .29-.234.52-.521.52zm-11.046 0c-.286 0-.52-.23-.52-.52V8.85c0-.286.234-.518.52-.518.287 0 .52.232.52.518v5.972c0 .29-.233.52-.52.52zM8.294 5.853l-.98-1.8a.2.2 0 0 0-.273-.073.2.2 0 0 0-.073.273l1 1.833A6.9 6.9 0 0 0 5 12h14a6.9 6.9 0 0 0-2.968-5.913l.999-1.834a.2.2 0 0 0-.346-.2l-.98 1.8A6.87 6.87 0 0 0 12 5.1a6.87 6.87 0 0 0-3.706 1.053zM10 9.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM5.522 17.28c0 .75.61 1.36 1.36 1.36h.42v2.84c0 .286.232.52.519.52.287 0 .519-.234.519-.52V18.64h1.32v2.84c0 .286.232.52.518.52.286 0 .519-.234.519-.52V18.64h.42c.75 0 1.36-.61 1.36-1.36V8.37H5.52v8.91zm12.956 0V8.37h-8.956v8.91c0 .75.61 1.36 1.36 1.36h.42v2.84c0 .286.233.52.519.52.287 0 .52-.234.52-.52V18.64h1.319v2.84c0 .286.232.52.519.52.286 0 .519-.234.519-.52V18.64h.419c.75 0 1.361-.61 1.361-1.36z" />
            </svg>
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
              Android
            </span>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-green-400 transition-colors" />
          </a>

          {/* Web */}
          <a
            href="https://doraty-app.vercel.app"
            id="hero-web-btn"
            className="group flex items-center gap-3 px-5 py-3 rounded-xl glass border border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Globe className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
              Web Version
            </span>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </a>
        </div>

        {/* Stats Row */}
        <div className="mt-20 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { value: "3", label: t.hero.stats.platforms },
            { value: "∞", label: t.hero.stats.exams },
            { value: "100%", label: t.hero.stats.cloud },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
    </section>
  );
}
