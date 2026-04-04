"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { 
  Timer, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle,
  Award,
  RefreshCw,
  Home,
  XCircle,
  Clock,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

export default function ExamPage() {
  const { id } = useParams();
  const router = useRouter();
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [status, setStatus] = useState<"loading" | "intro" | "active" | "result" | "review">("loading");
  const [result, setResult] = useState<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function fetchExam() {
      const { data: examData } = await supabase.from("exams").select("*").eq("id", id).single();
      if (examData) {
        setExam(examData);
        setSecondsLeft(examData.duration * 60);
        
        const { data: qData } = await supabase.from("questions").select("*").eq("exam_id", id).order("order_index");
        if (qData) {
            let processedQuestions = [...qData];
            
            // 1. Shuffle Questions if enabled
            if (examData.shuffle_questions) {
                processedQuestions.sort(() => Math.random() - 0.5);
            }

            // 2. Shuffle Options if enabled
            if (examData.shuffle_options) {
                processedQuestions = processedQuestions.map(q => {
                    const originalOptions = [...q.options];
                    const shuffledOptions = [...originalOptions].sort(() => Math.random() - 0.5);
                    const newCorrectIndex = shuffledOptions.indexOf(originalOptions[q.correct_answer]);
                    return { ...q, options: shuffledOptions, correct_answer: newCorrectIndex, original_options: originalOptions };
                });
            }

            setQuestions(processedQuestions);
        }
        setStatus("intro");
      }
    }
    fetchExam();
  }, [id]);

  const startExam = () => {
    setStatus("active");
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const submitExam = async () => {
    clearInterval(timerRef.current!);
    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) {
        score += q.points || 1;
      }
    });

    const totalPoints = questions.reduce((sum, q) => sum + (q.points || 1), 0);
    const percentage = Math.round((score / totalPoints) * 100);
    
    setResult({ score, totalPoints, percentage });
    setStatus("result");

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        await supabase.from("exam_submissions").insert({
            exam_id: id,
            user_id: user.id,
            score: score,
            percentage: percentage
        });
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const renderContent = (content: string) => {
    // Basic KaTeX detection for equations wrapped in $ or $$
    const parts = content.split(/(\$\$[\s\S]+?\$\$|\$.+?\$)/);
    return parts.map((part, i) => {
      if (part.startsWith("$$")) return <BlockMath key={i} math={part.slice(2, -2)} />;
      if (part.startsWith("$")) return <InlineMath key={i} math={part.slice(1, -1)} />;
      return <span key={i}>{part}</span>;
    });
  };

  if (status === "loading") return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white"><div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#0f172a] pt-32 pb-20 px-6 font-cairo">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {status === "intro" && (
            <motion.div key="intro" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass p-12 text-center border-white/5 rounded-[40px] shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-500/5 blur-3xl rounded-full translate-y-1/2" />
                <div className="w-24 h-24 premium-gradient rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-xl shadow-purple-900/40 rotate-6">
                    <HelpCircle size={48} className="text-white" />
                </div>
                <h1 className="text-4xl font-black text-white mb-6 uppercase tracking-wider">{exam.title}</h1>
                <p className="text-slate-400 mb-12 max-w-lg mx-auto text-lg font-medium leading-relaxed">{exam.description || "هذا الاختبار مصمم لتقييم مهاراتك بعمق. استعد جيداً!"}</p>
                
                <div className="flex flex-wrap justify-center gap-6 mb-12">
                    <div className="glass px-8 py-5 border-white/5 rounded-2xl flex items-center gap-4 bg-white/[0.02]">
                        <Clock className="text-purple-400" size={24} />
                        <div className="text-right">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">الزمن المتاح</span>
                            <span className="text-white font-black text-xl">{exam.duration} دقيقة</span>
                        </div>
                    </div>
                    <div className="glass px-8 py-5 border-white/5 rounded-2xl flex items-center gap-4 bg-white/[0.02]">
                        <Award className="text-green-400" size={24} />
                        <div className="text-right">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block">إجمالي النقاط</span>
                            <span className="text-white font-black text-xl">{questions.reduce((sum, q) => sum + (q.points || 1), 0)} نقطة</span>
                        </div>
                    </div>
                </div>

                <button onClick={startExam} className="px-20 py-6 premium-gradient rounded-3xl text-white font-black text-xl shadow-2xl shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all">ابدأ الآن</button>
            </motion.div>
          )}

          {status === "active" && (
            <motion.div key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 glass p-8 border-white/5 sticky top-24 z-30 shadow-2xl backdrop-blur-3xl rounded-[2rem]">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl premium-gradient flex items-center justify-center text-white font-black text-2xl shadow-inner uppercase">
                            {currentIdx + 1}
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mb-1">التقدم الحالي</p>
                            <h4 className="text-white font-black text-lg">من أصل {questions.length} أسئلة</h4>
                        </div>
                    </div>
                    
                    <div className={`flex items-center gap-4 px-10 py-5 rounded-2xl border-2 transition-all ${
                        secondsLeft < 120 ? "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse" : "glass text-purple-400 border-white/10"
                    }`}>
                        <Timer size={28} />
                        <span className="font-black text-3xl font-mono tracking-tighter">{formatTime(secondsLeft)}</span>
                    </div>
                </div>

                <div className="space-y-10">
                    <motion.div key={currentIdx} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="glass p-12 border-white/5 rounded-[3rem] shadow-xl relative overflow-hidden">
                        <div className="text-3xl font-black text-white mb-12 leading-tight tracking-tight">
                            {renderContent(questions[currentIdx].text)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {questions[currentIdx].options.map((opt: string, i: number) => (
                                <button 
                                    key={i}
                                    onClick={() => setAnswers({...answers, [questions[currentIdx].id]: i})}
                                    className={`w-full p-8 rounded-[2rem] border-2 text-right transition-all group flex items-start gap-5 ${
                                        answers[questions[currentIdx].id] === i 
                                        ? "premium-gradient text-white border-transparent shadow-2xl shadow-purple-900/40" 
                                        : "glass border-white/5 text-slate-500 hover:border-purple-500/20"
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center shrink-0 mt-1 transition-all ${
                                        answers[questions[currentIdx].id] === i ? "border-white" : "border-slate-800"
                                    }`}>
                                        {answers[questions[currentIdx].id] === i && <motion.div layoutId="choice" className="w-3 h-3 bg-white rounded-full" />}
                                    </div>
                                    <span className="font-black text-lg leading-snug">{renderContent(opt)}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    <div className="flex items-center gap-6">
                        <button disabled={currentIdx === 0} onClick={() => setCurrentIdx(currentIdx - 1)} className="flex-1 py-6 glass rounded-[2rem] text-slate-500 font-black uppercase tracking-widest hover:bg-white/5 disabled:opacity-10 transition-all flex items-center justify-center gap-3">
                            <ChevronRight size={24} />
                            السابق
                        </button>
                        {currentIdx === questions.length - 1 ? (
                            <button onClick={submitExam} className="flex-[2] py-6 premium-gradient rounded-[2rem] text-white font-black text-lg uppercase tracking-widest shadow-2xl shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3">
                                إنهاء الاختبار
                                <CheckCircle size={24} />
                            </button>
                        ) : (
                            <button onClick={() => setCurrentIdx(currentIdx + 1)} className="flex-[2] py-6 glass border-purple-500/20 text-purple-400 font-black uppercase tracking-widest hover:bg-purple-500/5 transition-all flex items-center justify-center gap-3">
                                التالي
                                <ChevronLeft size={24} />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
          )}

          {status === "result" && (
            <motion.div key="result" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="glass p-16 text-center border-white/5 rounded-[4rem] relative overflow-hidden shadow-2xl">
                <div className={`absolute top-0 right-0 w-full h-3 ${result.percentage >= 50 ? "bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]" : "bg-red-500 shadow-[0_0_20px_rgba(239,44,44,0.5)]"}`} />
                <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-12 ${result.percentage >= 50 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                    {result.percentage >= 50 ? <Award size={64} /> : <AlertTriangle size={64} />}
                </div>
                <h2 className="text-5xl font-black text-white mb-4 leading-tight">{result.percentage >= 50 ? "إنجاز مذهل!" : "محاولة جيدة"}</h2>
                <p className="text-slate-500 text-xl font-medium mb-16">{result.percentage >= 50 ? "لقد اجتزت الاختبار بنجاح باهر" : "تحتاج لمزيد من المراجعة للمادة العلمية"}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
                    <div className="glass p-8 border-white/5 rounded-3xl bg-white/[0.02]">
                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] block mb-4">النقاط</span>
                        <div className="text-4xl font-black text-white">{result.score} <span className="text-base font-normal text-slate-700">/ {result.totalPoints}</span></div>
                    </div>
                    <div className="glass p-8 border-white/5 rounded-3xl bg-white/[0.02]">
                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] block mb-4">النسبة</span>
                        <div className="text-4xl font-black text-white">{result.percentage}%</div>
                    </div>
                    <div className="glass p-8 border-white/5 rounded-3xl bg-white/[0.02]">
                        <span className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em] block mb-4">النتيجة</span>
                        <div className={`text-2xl font-black mt-1 ${result.percentage >= 50 ? "text-green-400" : "text-red-400"}`}>{result.percentage >= 50 ? "ناجح وموثق" : "لم تجتز"}</div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-center">
                    <button onClick={() => setStatus("review")} className="px-12 py-6 glass text-purple-400 font-black text-lg rounded-2xl hover:bg-purple-500/5 transition-all flex items-center justify-center gap-3">
                        <Eye size={24} />
                        مراجعة إجاباتي
                    </button>
                    <button onClick={() => router.push("/profile")} className="px-16 py-6 premium-gradient text-white font-black text-lg rounded-3xl shadow-2xl shadow-purple-900/40 hover:scale-105 transition-all flex items-center justify-center gap-3">
                        <Home size={24} />
                        قائمة دوراتي
                    </button>
                </div>
            </motion.div>
          )}

          {status === "review" && (
            <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                <div className="flex items-center justify-between glass p-8 border-white/5 rounded-3xl sticky top-24 z-30 shadow-2xl backdrop-blur-3xl">
                    <h2 className="text-2xl font-black text-white">مراجعة الأسئلة</h2>
                    <button onClick={() => setStatus("result")} className="px-8 py-3 glass border-white/5 rounded-xl text-slate-500 font-bold hover:text-white transition-all">العودة للنتيجة</button>
                </div>

                <div className="space-y-10">
                    {questions.map((q, idx) => (
                        <div key={q.id} className="glass p-12 border-white/5 rounded-[3rem] shadow-xl relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-8">
                                <span className="text-slate-600 font-black text-xl">#{idx + 1}</span>
                                {answers[q.id] === q.correct_answer ? <CheckCircle className="text-green-500" size={24} /> : <XCircle className="text-red-500" size={24} />}
                            </div>
                            <h3 className="text-2xl font-black text-white mb-10 leading-tight">{renderContent(q.text)}</h3>
                            <div className="space-y-6">
                                {q.options.map((opt: string, i: number) => {
                                    const isUserChoice = answers[q.id] === i;
                                    const isCorrect = q.correct_answer === i;
                                    return (
                                        <div key={i} className={`p-8 rounded-[2rem] border-2 flex items-start gap-5 transition-all ${
                                            isCorrect ? "bg-green-500/10 border-green-500/30 text-white" :
                                            isUserChoice ? "bg-red-500/10 border-red-500/30 text-white" :
                                            "glass border-white/5 text-slate-600"
                                        }`}>
                                            <div className="mt-1 shrink-0">
                                                {isCorrect ? <CheckCircle size={24} className="text-green-500" /> : isUserChoice ? <XCircle size={24} className="text-red-500" /> : <div className="w-6 h-6 rounded-full border-2 border-slate-800" />}
                                            </div>
                                            <span className="font-bold text-lg">{renderContent(opt)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            {q.explanation && (
                                <div className="mt-10 p-8 glass border-purple-500/10 bg-purple-500/5 rounded-2xl">
                                    <h4 className="text-purple-400 font-black text-sm uppercase tracking-widest mb-3 flex items-center gap-2"><HelpCircle size={16} /> التوضيح التعليمي:</h4>
                                    <p className="text-slate-400 font-medium leading-relaxed">{renderContent(q.explanation)}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
