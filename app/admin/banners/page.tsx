"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabaseClient";
import { 
  Plus, 
  Trash2, 
  Edit, 
  ImageIcon, 
  Link as LinkIcon, 
  Search, 
  Monitor,
  MoreVertical,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminBanners() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      const { data } = await supabase.from("banners").select("*").order("created_at", { ascending: false });
      if (data) setBanners(data);
      setLoading(false);
    }
    fetchBanners();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 font-cairo">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-3xl font-extrabold text-white mb-2">إدارة الإعلانات</h1>
                <p className="text-slate-500 text-sm">تحكم في صور البانر المتحركة والعروض الترويجية على الصفحة الرئيسية.</p>
            </div>
            <button className="flex items-center gap-2 px-8 py-4 premium-gradient rounded-2xl text-white font-bold shadow-lg shadow-purple-900/40 hover:brightness-110 active:scale-95 transition-all">
                <Plus size={20} />
                <span>إضافة إعلان جديد</span>
            </button>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
                Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-64 glass animate-pulse border-white/5" />
                ))
            ) : banners.length > 0 ? banners.map((b, i) => (
                <motion.div 
                    key={b.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass border-white/5 hover:border-purple-500/20 transition-all group overflow-hidden"
                >
                    <div className="h-48 relative overflow-hidden">
                        <img src={b.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent opacity-60" />
                        <div className="absolute bottom-4 right-6 pr-2">
                             <h3 className="text-white font-black text-xl leading-tight">{b.title}</h3>
                             <p className="text-xs text-purple-400 font-bold uppercase">{b.subtitle || "إعلان عام"}</p>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                                    <LinkIcon size={12} className="text-blue-400" />
                                    <span className="max-w-[150px] truncate">{b.action_url || "لا يوجد رابط"}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-3 glass rounded-xl text-slate-500 hover:text-white"><Edit size={16} /></button>
                                <button className="p-3 glass rounded-xl text-red-400 hover:bg-red-500/10"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )) : (
                <div className="col-span-full py-20 text-center glass border-white/5">
                    <Monitor size={48} className="text-slate-700 mx-auto mb-6 opacity-20" />
                    <p className="text-slate-500">لا توجد إعلانات نشطة حالياً</p>
                </div>
            )}
        </div>

      </div>
    </AdminLayout>
  );
}
