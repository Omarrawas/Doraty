"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  BellOff, 
  ChevronLeft,
  Zap,
  Award,
  BookOpen,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("app_notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (data) setNotifications(data);
      }
      setLoading(false);
    }
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    await supabase.from("app_notifications").update({ is_read: true }).eq("id", id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await supabase.from("app_notifications").update({ is_read: true }).eq("user_id", user.id);
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
        case "course": return <BookOpen className="text-blue-400" size={20} />;
        case "exam": return <Award className="text-yellow-400" size={20} />;
        case "support": return <MessageCircle className="text-purple-400" size={20} />;
        default: return <Zap className="text-purple-400" size={20} />;
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#0f172a] pt-40 pb-20 px-6 font-cairo">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-16 px-4">
            <div>
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 glass px-4 py-1.5 rounded-full text-purple-400 text-xs font-black uppercase tracking-widest mb-4 border-purple-500/20"
                >
                    <Bell size={14} />
                    <span>آخر التنبيهات</span>
                </motion.div>
                <h1 className="text-5xl font-black text-white">الإشعارات</h1>
            </div>
            
            {notifications.some(n => !n.is_read) && (
                <button 
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 text-slate-500 hover:text-white font-bold transition-colors text-sm"
                >
                    <CheckCircle2 size={18} />
                    <span>تحديد الكل كمقروء</span>
                </button>
            )}
        </div>

        <div className="space-y-6">
            <AnimatePresence mode="popLayout">
                {notifications.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass p-24 text-center rounded-[3.5rem] border-white/5 space-y-6"
                    >
                        <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center mx-auto text-slate-700">
                            <BellOff size={48} />
                        </div>
                        <h2 className="text-2xl font-bold text-white">لا توجد إشعارات</h2>
                        <p className="text-slate-500">سنقوم بإشعارك بأي تحديثات جديدة فور حدوثها.</p>
                        <Link href="/explore" className="inline-flex items-center gap-3 text-purple-400 font-black hover:text-white transition-all pt-10">
                            استكشف الدورات الجديدة
                            <ChevronLeft size={20} />
                        </Link>
                    </motion.div>
                ) : (
                    notifications.map((notif, i) => (
                        <motion.div 
                            key={notif.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`glass p-8 rounded-[2.5rem] border-white/5 flex gap-8 items-start relative transition-all group hover:bg-white/[0.02] ${
                                !notif.is_read ? "bg-purple-500/[0.02] border-purple-500/10" : "opacity-60"
                            }`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                                !notif.is_read ? "premium-gradient text-white" : "glass text-slate-500"
                            }`}>
                                {getIcon(notif.type)}
                            </div>

                            <div className="flex-1 text-right">
                                <div className="flex items-center gap-4 mb-2">
                                    <h3 className="text-xl font-bold text-white leading-relaxed">{notif.title}</h3>
                                    {!notif.is_read && <span className="w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />}
                                </div>
                                <p className="text-slate-400 text-lg leading-relaxed mb-4">{notif.body}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
                                    <Clock size={14} />
                                    <span>{formatDistanceToNow(new Date(notif.created_at), { addSuffix: true, locale: ar })}</span>
                                </div>
                            </div>

                            <div className="absolute top-8 left-8 flex items-center gap-4">
                                {!notif.is_read && (
                                    <button 
                                        onClick={() => markAsRead(notif.id)}
                                        className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                                    >
                                        تحديد كمقروء
                                    </button>
                                )}
                                <button className="text-slate-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
