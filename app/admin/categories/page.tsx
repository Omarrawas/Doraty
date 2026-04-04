"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabaseClient";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Layers, 
  ChevronRight, 
  Search, 
  GripVertical,
  MoreVertical,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from("categories").select("*").order("name");
      if (data) setCategories(data);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 font-cairo">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-3xl font-extrabold text-white mb-2">إدارة التصنيفات</h1>
                <p className="text-slate-500 text-sm">تنظيم وتصنيف الدورات التعليمية لسهولة الوصول إليها.</p>
            </div>
            <button className="flex items-center gap-2 px-8 py-4 premium-gradient rounded-2xl text-white font-bold shadow-lg shadow-purple-900/40 hover:brightness-110 active:scale-95 transition-all">
                <Plus size={20} />
                <span>إضافة تصنيف جديد</span>
            </button>
        </div>

        {/* Search */}
        <div className="relative">
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن تصنيف..."
                className="w-full glass py-5 pr-14 pl-8 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600 font-bold"
            />
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
                Array(8).fill(0).map((_, i) => (
                    <div key={i} className="h-32 glass animate-pulse border-white/5" />
                ))
            ) : filteredCategories.length > 0 ? filteredCategories.map((c, i) => (
                <motion.div 
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass p-5 border-white/5 hover:border-purple-500/20 transition-all group relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl glass flex items-center justify-center text-slate-500 group-hover:text-purple-400 transition-colors">
                            <Layers size={20} />
                        </div>
                        <button className="p-1.5 text-slate-700 hover:text-white"><MoreVertical size={16} /></button>
                    </div>
                    <h3 className="text-white font-bold mb-1 truncate px-1">{c.name}</h3>
                    <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{c.slug || "no-slug"}</span>
                        <div className="flex items-center gap-1">
                            <button className="p-2 text-slate-600 hover:text-white transition-all"><Edit size={14} /></button>
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
            )) : (
                <div className="col-span-full py-20 text-center glass border-white/5">
                    <Zap size={48} className="text-slate-700 mx-auto mb-6 opacity-20" />
                    <p className="text-slate-500">لا توجد تصنيفات مطابقة</p>
                </div>
            )}
        </div>

      </div>
    </AdminLayout>
  );
}
