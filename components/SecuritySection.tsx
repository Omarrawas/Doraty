"use client";

import { Shield, Lock, EyeOff, Server, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const icons = [Lock, Shield, EyeOff, Server];

export default function SecuritySection() {
  const { t } = useLanguage();

  return (
    <section id="security" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Left Side: Content */}
          <div className="flex-1 w-full lg:w-1/2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/20 mb-6">
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                {t.security.badge}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              {t.security.title}{" "}
              <span className="gradient-text">{t.security.titleAccent}</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-8">
              {t.security.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              {t.security.labels.map((label: string) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl glass border border-white/5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium text-slate-300">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Security Cards */}
          <div className="flex-1 w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-blue-500/5 blur-[100px] -z-10" />

            {t.security.items.map((item: any, index: number) => {
              const Icon = icons[index];
              return (
                <div
                  key={index}
                  className="feature-card group hover:border-blue-500/30"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-5 group-hover:bg-blue-500 group-hover:border-blue-400 transition-all duration-300">
                    <Icon className="w-6 h-6 text-blue-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-400 transition-colors">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
