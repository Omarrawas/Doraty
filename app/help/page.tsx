"use client";

import React, { useState } from "react";
import { 
  HelpCircle, 
  Search, 
  Plus, 
  MessageCircle, 
  Mail, 
  Phone, 
  Facebook, 
  Instagram, 
  ChevronDown,
  Zap,
  ShieldCheck,
  CreditCard,
  Monitor
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    category: "عام",
    icon: <Zap className="text-yellow-400" size={20} />,
    items: [
      { q: "كيف يمكنني البدء في التعلم؟", a: "ببساطة قم بإنشاء حساب، ثم تصفح الدورات المتاحة وأضف ما يعجبك إلى السلة. بعد إتمام عملية الاشتراك، ستظهر الدورات في صفحة 'دوراتي'." },
      { q: "هل تتوفر شهادات إتمام؟", a: "نعم، كل دورة في منصة دوراتي تأتي مع شهادة إتمام إلكترونية معتمدة تظهر في ملفك الشخصي فور إنهاء كافة الدروس والاختبارات بنجاح." }
    ]
  },
  {
    category: "الاشتراكات والدفع",
    icon: <CreditCard className="text-green-400" size={20} />,
    items: [
      { q: "كيف أقوم بتفعيل كود الاشتراك؟", a: "انتقل إلى صفحة 'تفعيل الكود' من القائمة الرئيسية، أدخل الكود الموجود على البطاقة التي اشتريتها، وسيتم تفعيل الدورة فوراً في حسابك." },
      { q: "ما هي طرق الدفع المتاحة؟", a: "حالياً نعتمد بشكل أساسي على بطاقات الشحن (الرموز السرية) المتوفرة في نقاط البيع المعتمدة، كما ندعم الدفع الإلكتروني عبر بوابات مختارة قادمة قريباً." }
    ]
  },
  {
    category: "الدعم التقني",
    icon: <Monitor className="text-blue-400" size={20} />,
    items: [
      { q: "الفيديوهات لا تعمل أو تقطع باستمرار، ماذا أفعل؟", a: "تأكد من سرعة اتصالك بالإنترنت. مشغل الفيديو الخاص بنا ذكي ويقوم بتعديل الجودة تلقائياً، ولكن يمكنك أيضاً اختيار جودة أقل يدوياً من إعدادات الفيديو." },
      { q: "نسيت كلمة المرور الخاصة بي، كيف استعيدها؟", a: "من صفحة تسجيل الدخول، اضغط على 'نسيت كلمة المرور' وسيتم إرسال رابط لإعادة التعيين إلى بريدك الإلكتروني المسجل." }
    ]
  }
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0f172a] pt-40 pb-20 px-6 font-cairo">
      <div className="max-w-4xl mx-auto text-center mb-20">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 glass rounded-full text-purple-400 text-sm font-black mb-8 border-purple-500/20"
        >
            <HelpCircle size={18} />
            <span>مركز الدعم والمساعدة</span>
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tight">كيف يمكننا <span className="text-purple-500 italic">مساعدتك</span> اليوم؟</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12">نحن هنا لضمان حصولك على أفضل تجربة تعليمية. تصفح الأسئلة الشائعة أو تواصل معنا مباشرة.</p>
        
        <div className="relative max-w-xl mx-auto">
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
            <input 
                type="text" 
                placeholder="ابحث عن سؤالك هنا..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-6 pr-16 pl-6 glass border-white/5 rounded-3xl text-white font-bold placeholder:text-slate-600 focus:outline-none focus:border-purple-500/30 transition-all shadow-2xl"
            />
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Navigation */}
        <div className="lg:col-span-1 space-y-3">
            {faqs.map((cat, idx) => (
                <button 
                    key={idx}
                    onClick={() => { setActiveCategory(idx); setOpenIndex(null); }}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all font-bold ${
                        activeCategory === idx ? "premium-gradient text-white shadow-xl shadow-purple-900/30" : "glass text-slate-400 hover:text-white border-white/5"
                    }`}
                >
                    <div className="flex items-center gap-4">
                        {cat.icon}
                        <span>{cat.category}</span>
                    </div>
                </button>
            ))}
            
            <div className="pt-8 border-t border-white/5 mt-8">
                <h3 className="text-white font-black text-xs uppercase tracking-widest mb-6 px-4">تواصل مباشر</h3>
                <div className="space-y-3">
                    <a href="#" className="flex items-center gap-4 p-4 glass rounded-2xl text-slate-400 hover:text-green-500 hover:bg-green-500/5 transition-all text-sm font-bold border-white/5">
                        <MessageCircle size={20} />
                        <span>واتساب الدعم</span>
                    </a>
                    <a href="#" className="flex items-center gap-4 p-4 glass rounded-2xl text-slate-400 hover:text-blue-400 hover:bg-blue-400/5 transition-all text-sm font-bold border-white/5">
                        <Facebook size={20} />
                        <span>صفحة فيسبوك</span>
                    </a>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
            <h2 className="text-2xl font-black text-white px-2 mb-8">{faqs[activeCategory].category}</h2>
            
            <div className="space-y-4">
                {faqs[activeCategory].items.filter(i => 
                    i.q.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    i.a.toLowerCase().includes(searchTerm.toLowerCase())
                ).map((item, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="glass border-white/5 rounded-3xl overflow-hidden shadow-sm"
                    >
                        <button 
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex items-center justify-between p-8 text-right group"
                        >
                            <span className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">{item.q}</span>
                            <div className={`transition-transform duration-500 text-purple-400 ${openIndex === i ? "rotate-180" : ""}`}>
                                <ChevronDown size={24} />
                            </div>
                        </button>
                        
                        <AnimatePresence>
                            {openIndex === i && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden bg-white/[0.01]"
                                >
                                    <div className="p-8 pt-0 text-slate-400 leading-relaxed text-lg border-r-4 border-purple-500/20 mr-8 mb-8 mt-2">
                                        {item.a}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Need more help? */}
            <div className="mt-20 glass p-12 rounded-[3.5rem] border-white/5 flex flex-col md:flex-row items-center justify-between gap-12 bg-white/[0.01]">
                <div className="text-center md:text-right">
                    <h3 className="text-3xl font-black text-white mb-4">لم تجد إجابة لسؤالك؟</h3>
                    <p className="text-slate-400 text-lg">فريقنا متاح دائماً للإجابة على استفساراتك وتقديم المساعدة اللازمة.</p>
                </div>
                <button className="px-12 py-6 premium-gradient text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                    <MessageCircle size={24} />
                    تواصل معنا الآن
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}
