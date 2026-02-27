"use client";

import {
  ClipboardList,
  Database,
  LayoutDashboard,
  Monitor,
  Shield,
  Cloud,
  Users,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const icons = [
  ClipboardList,
  Database,
  LayoutDashboard,
  Monitor,
  Shield,
  Cloud,
  Users,
  BarChart3,
  Sparkles,
];

const colors = [
  "from-blue-500 to-blue-700",
  "from-violet-500 to-violet-700",
  "from-sky-500 to-sky-700",
  "from-emerald-500 to-emerald-700",
  "from-red-500 to-red-700",
  "from-cyan-500 to-cyan-700",
  "from-orange-500 to-orange-700",
  "from-pink-500 to-pink-700",
  "from-amber-500 to-amber-700",
];

const glows = [
  "rgba(59,130,246,0.3)",
  "rgba(139,92,246,0.3)",
  "rgba(14,165,233,0.3)",
  "rgba(16,185,129,0.3)",
  "rgba(239,68,68,0.3)",
  "rgba(6,182,212,0.3)",
  "rgba(249,115,22,0.3)",
  "rgba(236,72,153,0.3)",
  "rgba(245,158,11,0.3)",
];

export default function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/20 mb-6">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              {t.features.badge}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5">
            {t.features.title}{" "}
            <span className="gradient-text">{t.features.titleAccent}</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-400">
            {t.features.description}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.features.list.map((feature: any, index: number) => {
            const Icon = icons[index];
            return (
              <div
                key={index}
                className="feature-card group"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[index]} flex items-center justify-center mb-5 shadow-lg transition-all duration-300 group-hover:scale-110`}
                  style={{
                    boxShadow: `0 4px 20px ${glows[index]}`,
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
