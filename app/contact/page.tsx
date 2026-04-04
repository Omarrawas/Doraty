"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      alert("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border-purple-500/30"
          >
            <MessageSquare className="text-purple-400" size={16} />
            <span className="text-sm font-semibold text-purple-200">نحن هنا لمساعدتكم</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">تواصل معنا</h1>
          <p className="text-slate-400 max-w-xl mx-auto">لديكم استفسار أو اقتراح؟ يسعدنا دائماً سماع آرائكم والتواصل معكم عبر كافة القنوات المتاحة</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: <Mail className="text-purple-400" />, title: "البريد الإلكتروني", value: "support@doraty.com", desc: "نرد خلال 24 ساعة" },
              { icon: <Phone className="text-purple-400" />, title: "رقم الهاتف", value: "+963 930 112 233", desc: "من 9 صباحاً حتى 9 مساءً" },
              { icon: <MapPin className="text-purple-400" />, title: "العنوان", value: "دمشق، سوريا", desc: "حي القنوات، مبنى رقم 12" },
              { icon: <Clock className="text-purple-400" />, title: "ساعات العمل", value: "السبت - الخميس", desc: "دعم فني متواصل" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 border-white/5 flex gap-5 group"
              >
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center shrink-0 group-hover:premium-gradient group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">{item.title}</h4>
                  <p className="text-purple-200 font-medium text-sm mb-1">{item.value}</p>
                  <p className="text-slate-500 text-xs">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass p-8 md:p-12 border-white/5 shadow-2xl relative"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 pr-2">الاسم الكامل</label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full glass py-4 px-6 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                      placeholder="أدخل اسمك"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-300 pr-2">البريد الإلكتروني</label>
                    <input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full glass py-4 px-6 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 pr-2">الموضوع</label>
                  <input 
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full glass py-4 px-6 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                    placeholder="كيف يمكننا مساعدتك؟"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-300 pr-2">الرسالة</label>
                  <textarea 
                    rows={6}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full glass py-4 px-6 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <button 
                  type="submit"
                  disabled={sending}
                  className="px-12 py-4 premium-gradient rounded-2xl text-white font-bold text-lg shadow-xl shadow-purple-900/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-3"
                >
                  {sending ? "جاري الإرسال..." : (
                    <>
                      <span>إرسال الرسالة</span>
                      <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
