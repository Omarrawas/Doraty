"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabaseClient";
import { 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Search, 
  Filter, 
  Clock, 
  CreditCard, 
  User as UserIcon,
  BookOpen,
  Image as ImageIcon,
  ChevronDown,
  MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  useEffect(() => {
    async function fetchPayments() {
      const { data } = await supabase
        .from("payments")
        .select("*, users(*), courses(*)")
        .order("created_at", { ascending: false });
      
      if (data) setPayments(data);
      setLoading(false);
    }
    fetchPayments();
  }, []);

  const handleApprove = async (id: string, userId: string, courseId: string) => {
    // 1. Update payment status
    await supabase.from("payments").update({ status: "approved" }).eq("id", id);
    
    // 2. Add enrollment for student
    await supabase.from("enrollments").insert({
        user_id: userId,
        course_id: courseId,
        status: "active"
    });

    setPayments(payments.map(p => p.id === id ? { ...p, status: "approved" } : p));
  };

  const handleReject = async (id: string) => {
    await supabase.from("payments").update({ status: "rejected" }).eq("id", id);
    setPayments(payments.map(p => p.id === id ? { ...p, status: "rejected" } : p));
  };

  const filteredPayments = payments.filter(p => {
    const matchesSearch = (p.transaction_id || "").includes(searchQuery) || (p.users?.full_name || "").includes(searchQuery);
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 font-cairo">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <h1 className="text-3xl font-extrabold text-white mb-2">إيصالات الدفع والاشتراكات</h1>
                <p className="text-slate-500 text-sm">مراجعة والتحقق من عمليات التحويل البنكي وتفعيل اشتراكات الطلاب.</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="glass p-2 flex items-center gap-2">
                    {["pending", "approved", "all"].map((s) => (
                        <button 
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                                statusFilter === s ? "premium-gradient text-white" : "text-slate-500 hover:text-white"
                            }`}
                        >
                            {s === "pending" ? "قيد الانتظار" : s === "approved" ? "تمت الموافقة" : "الكل"}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Search */}
        <div className="relative">
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث برقم العملية أو اسم الطالب..."
                className="w-full glass py-5 pr-14 pl-8 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all placeholder:text-slate-600 font-bold"
            />
        </div>

        {/* Payments Table */}
        <div className="glass border-white/5 overflow-hidden">
            <table className="w-full text-right border-collapse">
                <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                        <th className="px-8 py-5 text-[10px] text-slate-500 uppercase font-black tracking-widest leading-loose">الطالب</th>
                        <th className="px-8 py-5 text-[10px] text-slate-500 uppercase font-black tracking-widest leading-loose">الكورس</th>
                        <th className="px-8 py-5 text-[10px] text-slate-500 uppercase font-black tracking-widest leading-loose">رقم العملية</th>
                        <th className="px-8 py-5 text-[10px] text-slate-500 uppercase font-black tracking-widest leading-loose">التاريخ</th>
                        <th className="px-8 py-5 text-[10px] text-slate-500 uppercase font-black tracking-widest leading-loose">الحالة</th>
                        <th className="px-8 py-5 text-[10px] text-slate-500 uppercase font-black tracking-widest leading-loose">الإجراء</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {loading ? (
                        Array(5).fill(0).map((_, i) => (
                            <tr key={i} className="animate-pulse">
                                <td colSpan={6} className="px-8 py-6 h-20 bg-white/[0.02]" />
                            </tr>
                        ))
                    ) : filteredPayments.length > 0 ? filteredPayments.map((p, i) => (
                        <motion.tr 
                            key={p.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group hover:bg-white/5 transition-all"
                        >
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full premium-gradient p-[1px] shrink-0">
                                        <div className="w-full h-full rounded-full bg-[#0f172a] flex items-center justify-center">
                                            <UserIcon size={16} className="text-slate-400" />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold text-sm">{p.users?.full_name || "مستخدم"}</p>
                                        <p className="text-[10px] text-slate-500 font-bold">{p.users?.phone}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-6 min-w-[200px]">
                                <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
                                    <BookOpen size={14} className="text-purple-400" />
                                    <span className="truncate max-w-[150px]">{p.courses?.title || "كورس غير معروف"}</span>
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <span className="text-sm font-black text-slate-400 group-hover:text-purple-400 transition-colors uppercase tracking-widest">{p.transaction_id || "N/A"}</span>
                            </td>
                            <td className="px-8 py-6">
                                <span className="text-xs text-slate-500 font-bold">{new Date(p.created_at).toLocaleDateString('ar-EG')}</span>
                            </td>
                            <td className="px-8 py-6">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase w-fit ${
                                    p.status === "pending" ? "bg-orange-500/10 text-orange-400" :
                                    p.status === "approved" ? "bg-green-500/10 text-green-400" :
                                    "bg-red-500/10 text-red-500"
                                }`}>
                                    {p.status === "pending" ? <Clock size={12} /> : 
                                     p.status === "approved" ? <CheckCircle2 size={12} /> : 
                                     <XCircle size={12} />}
                                    {p.status === "pending" ? "قيد المراجعة" : p.status === "approved" ? "تم التفعيل" : "مرفوض"}
                                </div>
                            </td>
                            <td className="px-8 py-6">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => setSelectedReceipt(p.receipt_url)}
                                        className="p-3 glass rounded-xl text-slate-400 hover:text-white transition-all shadow-xl" title="عرض الإيصال"
                                    >
                                        <ImageIcon size={18} />
                                    </button>
                                    <AnimatePresence>
                                        {p.status === "pending" && (
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => handleApprove(p.id, p.user_id, p.course_id)}
                                                    className="p-3 bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500/20 transition-all shadow-xl" title="موافقة"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleReject(p.id)}
                                                    className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all shadow-xl" title="رفض"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </td>
                        </motion.tr>
                    )) : (
                        <tr>
                            <td colSpan={6} className="px-8 py-32 text-center text-slate-700 bg-white/[0.01]">
                                <div className="flex flex-col items-center gap-6">
                                    <CreditCard size={48} className="opacity-20" />
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-600 mb-1">لا توجد سجلات دفع</h3>
                                        <p className="text-sm opacity-50">لم يتم العثور على أي عمليات تحويل {statusFilter === "pending" ? "معلقة" : ""} حالياً.</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Receipt Image Modal */}
        <AnimatePresence>
            {selectedReceipt && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-8 md:p-20"
                    onClick={() => setSelectedReceipt(null)}
                >
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl aspect-[3/4] glass border-white/10 rounded-3xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-6 right-6 z-10 flex items-center gap-4">
                            <span className="text-xs font-bold text-white/50 backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">معاينة إيصال التحويل</span>
                            <button 
                                onClick={() => setSelectedReceipt(null)}
                                className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                        <img 
                            src={selectedReceipt} 
                            alt="Receipt" 
                            className="w-full h-full object-contain p-4"
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
}
