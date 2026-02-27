"use client";

import Link from "next/link";
import { Shield, ChevronLeft, ChevronRight, Globe, Lock, Eye, Database } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPolicy() {
  const { t, locale, dir } = useLanguage();

  const content = {
    ar: {
      title: "سياسة الخصوصية",
      lastUpdated: "آخر تحديث: 27 فبراير 2026",
      introduction: "في دوراتي، نلتزم بحماية خصوصيتك. توضح هذه السياسة كيف نجمع ونستخدم ونحمي معلوماتك الشخصية.",
      sections: [
        {
          title: "المعلومات التي نجمعها",
          icon: Shield,
          content: "نحن نجمع معلومات محدودة فقط اللازمة لتشغيل الخدمة: بيانات حساب جوجل (الاسم، البريد الإلكتروني، وصورة الملف الشخصي) لإنشاء حسابك وتأمين دخولك."
        },
        {
          title: "كيفية استخدام بياناتك",
          icon: Globe,
          content: "نستخدم بريدك الإلكتروني لتعريفك في النظام، وربطك بالكورسات، وحفظ نتائج اختباراتك. نحن لا نرسل رسائل ترويجية مزعجة ولا نستخدم بياناتك لأغراض إعلانية."
        },
        {
          title: "تخزين البيانات وأمنها",
          icon: Lock,
          content: "يتم تخزين جميع البيانات في خوادم مشفرة ومدارة بواسطة Supabase. نستخدم تقنيات حديثة لضمان عدم الوصول غير المصرح به لمعلوماتك."
        },
        {
          title: "مشاركة البيانات",
          icon: Eye,
          content: "نحن لا نبيع ولا نؤجر ولا نشارك بياناتك الشخصية مع أطراف ثالثة لأغراضهم التجارية. مشاركة البيانات تقتصر فقط على ما هو ضروري تقنياً لتقديم الخدمة."
        }
      ]
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: February 27, 2026",
      introduction: "At Doraty, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information.",
      sections: [
        {
          title: "Information We Collect",
          icon: Shield,
          content: "We collect only limited information necessary to operate the service: Google account data (name, email, and profile picture) to create your account and secure your login."
        },
        {
          title: "How We Use Your Data",
          icon: Globe,
          content: "We use your email to identify you in the system, link you to courses, and save your exam results. We do not send spam or use your data for advertising purposes."
        },
        {
          title: "Data Storage & Security",
          icon: Lock,
          content: "All data is stored in encrypted servers managed by Supabase. We use modern technologies to ensure unauthorized access to your information is prevented."
        },
        {
          title: "Data Sharing",
          icon: Eye,
          content: "We do not sell, rent, or share your personal data with third parties for their commercial purposes. Data sharing is limited only to what is technically necessary to provide the service."
        }
      ]
    }
  };

  const activeContent = locale === "ar" ? content.ar : content.en;

  return (
    <main className="min-h-screen bg-slate-900 section-grid-bg pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-blue-400 transition-colors">
            {t.common.backToHome}
          </Link>
          {dir === "rtl" ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          <span className="text-slate-300">{activeContent.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            {activeContent.title}
          </h1>
          <p className="text-slate-400 font-medium">
            {activeContent.lastUpdated}
          </p>
        </div>

        {/* Intro */}
        <div className="glass p-8 rounded-2xl border-white/10 mb-12">
          <p className="text-lg text-slate-300 leading-relaxed italic">
            &quot;{activeContent.introduction}&quot;
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {activeContent.sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <section key={index} className="feature-card border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {section.title}
                  </h2>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  {section.content}
                </p>
              </section>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center pt-8 border-t border-white/5">
          <p className="text-sm text-slate-500">
            {t.footer.contact}: <a href="mailto:support@doraty.app" className="text-blue-400 hover:underline">support@doraty.app</a>
          </p>
        </div>
      </div>
    </main>
  );
}
