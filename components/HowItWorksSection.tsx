"use client";

import { UserPlus, LayoutDashboard, BookOpen, TrendingUp } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const icons = [UserPlus, LayoutDashboard, BookOpen, TrendingUp];
const colors = [
  "from-blue-500 to-blue-700",
  "from-violet-500 to-violet-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
];

export default function HowItWorksSection() {
  const { t, dir } = useLanguage();

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 section-grid-bg opacity-50" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,1) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-violet-500/20 mb-6">
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
              {t.howItWorks.badge}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5">
            {t.howItWorks.title}{" "}
            <span className="gradient-text">{t.howItWorks.titleAccent}</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-400">
            {t.howItWorks.description}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector Line (desktop) */}
          <div className={`hidden lg:block absolute top-16 ${dir === 'rtl' ? 'right-[calc(12.5%+24px)] left-[calc(12.5%+24px)]' : 'left-[calc(12.5%+24px)] right-[calc(12.5%+24px)]'} h-px bg-gradient-to-r from-blue-500/20 via-violet-500/30 to-amber-500/20 z-0`} />

          {t.howItWorks.steps.map((step: any, index: number) => {
            const Icon = icons[index];
            return (
              <div key={index} className="relative z-10 group">
                <div className="feature-card h-full flex flex-col items-start group-hover:border-blue-500/20">
                  <div className="flex items-center gap-3 mb-6 w-full">
                    <div
                      className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[index]} flex items-center justify-center shadow-lg flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${dir === 'rtl' ? 'group-hover:-rotate-3' : 'group-hover:rotate-3'}`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                      <div className={`absolute -top-2 ${dir === 'rtl' ? '-left-2' : '-right-2'} w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center`}>
                        <span className="text-xs font-bold text-slate-400">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="text-5xl font-black text-slate-800 group-hover:text-slate-700 transition-colors select-none">
                      0{index + 1}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <a
            href="https://app.doraty.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-base px-10 py-4 glow-blue inline-flex"
          >
            {t.common.getStarted}
          </a>
        </div>
      </div>
    </section>
  );
}
