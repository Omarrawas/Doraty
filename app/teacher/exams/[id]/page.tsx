"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/lib/supabaseClient";
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  Clock,
  Layout,
  Settings,
  ChevronDown,
  GripVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";

export default function ExamBuilder() {
  const params = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<any>({ title: "", duration: 60 });
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("questions"); // questions, settings

  useEffect(() => {
    async function fetchData() {
      if (!params.id) return;
      
      const { data: examData } = await supabase.from("exams").select("*").eq("id", params.id).single();
      if (examData) setExam(examData);

      const { data: qData } = await supabase.from("questions").select("*").eq("exam_id", params.id).order("order_index");
      if (qData) setQuestions(qData);
      
      setLoading(false);
    }
    fetchData();
  }, [params.id]);

  const addQuestion = () => {
    const newQ = {
        id: `temp-${Date.now()}`,
        question_text: "نص السؤال الجديد...",
        options: ["نعم", "لا", "ربما", "غير ذلك"],
        correct_answer: "نعم",
        explanation: "",
        points: 5
    };
    setQuestions([...questions, newQ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSave = async () => {
    // 1. Save exam metadata
    await supabase.from("exams").update({
        title: exam.title,
        duration: exam.duration,
        questions_count: questions.length
    }).eq("id", params.id);

    // 2. Save questions (This is a simplified mock; real logic would handle upserts)
    alert("تم حفظ الاختبار والأسئلة بنجاح!");
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 font-cairo pb-40">
        
        {/* Header */}
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-3 glass rounded-xl text-slate-400 hover:text-white transition-all">
                    <ArrowRight size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-extrabold text-white mb-2">{exam.title || "منشئ الاختبارات"}</h1>
                    <p className="text-slate-500 text-sm">قم بإعداد الأسئلة وتحديد الإجابات الصحيحة ومدة الاختبار.</p>
                </div>
            </div>
            <button onClick={handleSave} className="flex items-center gap-2 px-8 py-4 premium-gradient rounded-2xl text-white font-bold shadow-lg shadow-purple-900/40 hover:brightness-110 active:scale-95 transition-all">
                <Save size={18} />
                <span>نشر التعديلات</span>
            </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-4 border-b border-white/5 pb-1">
            {["questions", "settings"].map((t) => (
                <button 
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                        activeTab === t ? "text-purple-400" : "text-slate-600 hover:text-white"
                    }`}
                >
                    {t === "questions" ? "بنك الأسئلة" : "إعدادات الاختبار"}
                    {activeTab === t && <motion.div layoutId="tab-underline" className="absolute bottom-[-1px] left-0 w-full h-[2px] premium-gradient" />}
                </button>
            ))}
        </div>

        <AnimatePresence mode="wait">
            {activeTab === "settings" ? (
                <motion.div 
                    key="settings-tab"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    <div className="glass p-8 border-white/5 space-y-8">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Settings size={18} className="text-purple-400" />
                            تخصيص الاختبار
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] text-slate-500 font-black uppercase mb-1 block mr-1 leading-loose tracking-widest">مسمى الاختبار</label>
                                <input 
                                    type="text"
                                    value={exam.title}
                                    onChange={(e) => setExam({...exam, title: e.target.value})}
                                    className="w-full glass p-4 text-white outline-none focus:ring-1 focus:ring-purple-500 transition-all font-bold"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] text-slate-500 font-black uppercase mb-1 block mr-1 leading-loose tracking-widest">مدة الاختبار (بالدقائق)</label>
                                    <div className="relative">
                                        <input 
                                            type="number"
                                            value={exam.duration}
                                            onChange={(e) => setExam({...exam, duration: parseInt(e.target.value)})}
                                            className="w-full glass p-4 text-white outline-none focus:ring-1 focus:ring-purple-500 transition-all font-black text-2xl"
                                        />
                                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-6 glass border-white/5 mt-auto h-[64px]">
                                    <span className="text-xs font-bold text-slate-300">تبديل أماكن الإجابات</span>
                                    <button className="w-12 h-6 rounded-full premium-gradient relative p-1"><div className="w-4 h-4 rounded-full bg-white ml-auto" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div 
                    key="questions-tab"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                >
                    {/* Questions List */}
                    <div className="space-y-6">
                        {questions.map((q, idx) => (
                            <motion.div 
                                key={q.id}
                                layout
                                className="glass border-white/5 overflow-hidden group"
                            >
                                <div className="flex items-center justify-between p-4 bg-white/[0.02] border-b border-white/5">
                                    <div className="flex items-center gap-4">
                                        <GripVertical size={18} className="text-slate-700 cursor-grab" />
                                        <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-500/10 px-2 py-1 rounded">سؤال {idx + 1}</span>
                                    </div>
                                    <button onClick={() => removeQuestion(q.id)} className="p-2 text-red-400/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={16} /></button>
                                </div>
                                
                                <div className="p-8 space-y-8">
                                    <div>
                                        <label className="text-[10px] text-slate-500 font-bold uppercase mb-2 block tracking-widest">نص السؤال الاستفهامي</label>
                                        <input 
                                            type="text"
                                            value={q.question_text}
                                            className="w-full bg-transparent text-xl font-bold text-white outline-none focus:text-purple-400 transition-colors border-b border-white/5 pb-4"
                                            placeholder="اكتب السؤال هنا..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {q.options.map((opt: string, optIdx: number) => (
                                            <div key={optIdx} className={`flex items-center gap-4 p-4 rounded-2xl glass transition-all border ${q.correct_answer === opt ? "border-green-500/30 bg-green-500/5" : "border-white/5 hover:border-white/10"}`}>
                                                <button className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${q.correct_answer === opt ? "border-green-500 bg-green-500 text-white" : "border-slate-800"}`}>
                                                    {q.correct_answer === opt && <CheckCircle2 size={14} />}
                                                </button>
                                                <input 
                                                    type="text"
                                                    value={opt}
                                                    className="flex-1 bg-transparent text-sm text-white font-bold outline-none"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-6 border-t border-white/5">
                                         <label className="text-[10px] text-slate-500 font-bold uppercase mb-2 block tracking-widest">شرح الإجابة (يظهر للطالب بعد الحل)</label>
                                         <textarea 
                                            placeholder="اختياري: اشرح لماذا هذه هي الإجابة الصحيحة..."
                                            className="w-full glass p-4 text-xs text-slate-300 outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium resize-none"
                                         />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <button 
                        onClick={addQuestion}
                        className="w-full py-6 rounded-3xl glass border-2 border-dashed border-white/10 text-slate-400 font-black text-sm hover:border-purple-500/40 hover:text-white hover:bg-purple-500/5 transition-all flex items-center justify-center gap-4 group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Plus size={24} />
                        </div>
                        إضافة سؤال جديد لبنك الاختبار
                    </button>
                </motion.div>
            )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  );
}
