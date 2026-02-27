"use client";

import Link from "next/link";
import { FileText, ChevronLeft, ChevronRight, UserCheck, ShieldAlert, Scale, HelpCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TermsOfService() {
  const { t, locale, dir } = useLanguage();

  const content = {
    ar: {
      title: "شروط الخدمة",
      lastUpdated: "آخر تحديث: 27 فبراير 2026",
      introduction: "باستخدامك لمنصة دوراتي، فإنك توافق على الالتزام بهذه الشروط. يرجى قراءتها بعناية قبل البدء.",
      sections: [
        {
          title: "قبول الشروط",
          icon: UserCheck,
          content: "بمجرد إنشاء حساب في دوراتي، فإنك توافق على شروط الخدمة هذه. إذا كنت معلماً، فأنت توافق على تحمل مسؤولية المحتوى الذي تنشئه."
        },
        {
          title: "مسؤولية الحساب",
          icon: UserCheck,
          content: "أنت مسؤول عن الحفاظ على أمان حسابك. دوراتي ليست مسؤولة عن أي خسارة أو ضرر ناتج عن فشلك في الحفاظ على أمان حسابك."
        },
        {
          title: "الاستخدام المقبول",
          icon: ShieldAlert,
          content: "يُمنع استخدام المنصة لأي غرض غير قانوني. لا يجوز لك انتهاك حقوق الملكية الفكرية للمحتوى التعليمي أو محاولة اختراق النظام."
        },
        {
          title: "حقوق الملكية",
          icon: Scale,
          content: "المحتوى الذي تنشئه (اختبارات، أسئلة) يظل ملكاً لك. منصة دوراتي وجميع ميزاتها وعلامتها التجارية تظل ملكاً لمطوري دوراتي."
        },
        {
          title: "تعديل الخدمة",
          icon: HelpCircle,
          content: "نحن نحتفظ بالحق في تعديل أو إيقاف الخدمة في أي وقت. سنبذل قصارى جهدنا لإبلاغ المستخدمين بأي تغييرات جوهرية قبل حدوثها."
        }
      ]
    },
    en: {
      title: "Terms of Service",
      lastUpdated: "Last Updated: February 27, 2026",
      introduction: "By using the Doraty platform, you agree to comply with these terms. Please read them carefully before starting.",
      sections: [
        {
          title: "Acceptance of Terms",
          icon: UserCheck,
          content: "By creating an account on Doraty, you agree to these Terms of Service. If you are a teacher, you agree to take responsibility for the content you create."
        },
        {
          title: "Account Responsibility",
          icon: UserCheck,
          content: "You are responsible for maintaining the security of your account. Doraty is not responsible for any loss or damage resulting from your failure to keep your account secure."
        },
        {
          title: "Acceptable Use",
          icon: ShieldAlert,
          content: "It is prohibited to use the platform for any illegal purpose. You may not violate the intellectual property rights of educational content or attempt to hack the system."
        },
        {
          title: "Ownership Rights",
          icon: Scale,
          content: "The content you create (exams, questions) remains yours. The Doraty platform, all its features, and its brand remain the property of Doraty developers."
        },
        {
          title: "Service Modification",
          icon: HelpCircle,
          content: "We reserve the right to modify or discontinue the service at any time. We will make our best effort to inform users of any material changes before they occur."
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
        <div className="glass p-8 rounded-2xl border-white/10 mb-12 border-l-4 border-l-blue-500 rtl:border-l-0 rtl:border-r-4 rtl:border-r-blue-500">
          <p className="text-lg text-slate-300 leading-relaxed font-medium">
            {activeContent.introduction}
          </p>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 gap-6">
          {activeContent.sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <section key={index} className="feature-card border-white/5 bg-slate-800/20 hover:bg-slate-800/40 transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 transition-colors">
                    <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                    {index + 1}. {section.title}
                  </h2>
                </div>
                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                  {section.content}
                </p>
              </section>
            );
          })}
        </div>

        {/* Contact Note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-600">
            {t.footer.contact}: <a href="mailto:support@doraty.app" className="text-slate-500 hover:text-blue-400 underline">support@doraty.app</a>
          </p>
        </div>
      </div>
    </main>
  );
}
