"use client";

import { Globe, Smartphone, Monitor, Download, ExternalLink, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const icons = [Globe, Smartphone, Monitor];
const colors = [
  "from-violet-600 to-purple-700",
  "from-emerald-600 to-green-700",
  "from-blue-600 to-blue-800",
];
const glows = [
  "rgba(139,92,246,0.4)",
  "rgba(16,185,129,0.4)",
  "rgba(37,99,235,0.4)",
];
const borders = [
  "border-violet-500/30",
  "border-emerald-500/30",
  "border-blue-500/30",
];
const hoverBorders = [
  "hover:border-violet-500/60",
  "hover:border-emerald-500/60",
  "hover:border-blue-500/60",
];

export default function PlatformSection() {
  const { t, dir, locale } = useLanguage();

  return (
    <section id="platforms" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-emerald-500/20 mb-6">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              {t.platforms.badge}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5">
            {t.platforms.title}{" "}
            <span className="gradient-text">{t.platforms.titleAccent}</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-400">
            {t.platforms.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.platforms.cards.map((card: any, index: number) => {
            const Icon = icons[index];
            const isWeb = index === 0;
            return (
              <div
                key={index}
                className={`relative rounded-2xl border ${borders[index]} ${hoverBorders[index]} transition-all duration-300 hover:scale-[1.02] overflow-hidden group`}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
                }}
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${glows[index]}, transparent)`,
                  }}
                />

                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors[index]} flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110 ${dir === 'rtl' ? 'group-hover:-rotate-3' : 'group-hover:rotate-3'}`}
                      style={{ boxShadow: `0 8px 30px ${glows[index]}` }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    {index === 1 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
                        ⭐ {dir === 'rtl' ? 'مميز' : 'Featured'}
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {card.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6 group-hover:text-slate-300 transition-colors">
                    {card.description}
                  </p>

                  <ul className="space-y-2 mb-8 lowercase">
                    {card.features.map((feature: string) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-slate-400"
                      >
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {isWeb ? (
                    <a
                      href="https://doraty-app.vercel.app"
                      className="btn-primary w-full justify-center text-sm py-3"
                    >
                      {card.cta}
                      <ExternalLink className="w-4 h-4 rtl:rotate-180" />
                    </a>
                  ) : index === 1 ? (
                      <div className="flex flex-col gap-3">
                        <a
                          href="https://github.com/Omarrawas/doraty-app/releases/latest/download/app-release.apk"
                          className="btn-primary w-full justify-center text-sm py-3"
                        >
                          <Download className="w-4 h-4" />
                          {card.cta}
                        </a>
                        <div className="grid grid-cols-1 gap-2 mt-1">
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1 px-1">
                            {locale === "ar" ? "إصدارات مخصصة للمعمارية:" : "Architecture specific builds:"}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: "ARM64-v8a", file: "app-arm64-v8a-release.apk" },
                              { label: "ARM-v7a", file: "app-armeabi-v7a-release.apk" },
                              { label: "x86_64", file: "app-x86_64-release.apk" },
                            ].map((arch) => (
                              <a
                                key={arch.file}
                                href={`https://github.com/Omarrawas/doraty-app/releases/latest/download/${arch.file}`}
                                className="text-[10px] bg-white/5 hover:bg-blue-500/10 border border-white/10 hover:border-blue-500/30 text-slate-400 hover:text-blue-400 px-2 py-1.5 rounded-md transition-all flex-1 text-center font-medium"
                              >
                                {arch.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      </div>
                  ) : (
                        <a
                          href="https://github.com/Omarrawas/doraty-app/releases/latest/download/Doraty-Windows.zip"
                          className="btn-primary w-full justify-center text-sm py-3"
                    >
                      <Download className="w-4 h-4" />
                      {card.cta}
                        </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-600 mt-8">
          {t.platforms.note}
        </p>
      </div>
    </section>
  );
}
