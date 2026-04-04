import ReactPlayer from "react-player/youtube";

export default function LessonViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("description");
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [playerRef, setPlayerRef] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      
      // 1. Fetch current lesson
      const { data: lessonData } = await supabase
        .from("lessons")
        .select("*, chapters(*, courses(*))")
        .eq("id", id)
        .single();
      
      if (lessonData) {
        setLesson(lessonData);
        setCourse(lessonData.chapters.courses);
        
        // 2. Fetch siblings
        const { data: siblings } = await supabase
          .from("lessons")
          .select("*")
          .eq("chapter_id", lessonData.chapter_id)
          .order("order_index");
        if (siblings) setAllLessons(siblings);

        // 3. Fetch Notes
        if (user) {
            const { data: noteData } = await supabase
                .from("lesson_notes")
                .select("*")
                .eq("lesson_id", id)
                .eq("user_id", user.id)
                .order("timestamp");
            if (noteData) setNotes(noteData);

            const { data: progress } = await supabase
                .from("lesson_progress")
                .select("*")
                .eq("lesson_id", id)
                .eq("user_id", user.id)
                .single();
            if (progress) setIsCompleted(progress.is_completed);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [id]);

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase.from("lesson_notes").insert({
        lesson_id: id,
        user_id: user.id,
        content: newNote,
        timestamp: Math.floor(currentTime)
    }).select().single();

    if (data) {
        setNotes([...notes, data].sort((a, b) => a.timestamp - b.timestamp));
        setNewNote("");
    }
  };

  const jumpToNote = (timestamp: number) => {
    if (playerRef) playerRef.seekTo(timestamp, 'seconds');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center font-cairo text-white animate-pulse">جاري التحميل...</div>;
  if (!lesson) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center font-cairo text-white">الدرس غير متاح</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col font-cairo">
      {/* Top Navigation */}
      <div className="pt-24 px-6 flex items-center justify-between z-10 sticky top-0 bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/5 pb-4">
        <button onClick={() => router.back()} className="glass p-3 rounded-xl text-slate-300 hover:text-white transition-colors">
            <ChevronRight size={20} />
        </button>
        <div className="text-center">
            <span className="text-[10px] text-purple-400 font-black uppercase tracking-[0.3em] block mb-1">{course?.title}</span>
            <h1 className="text-lg font-black text-white">{lesson.title}</h1>
        </div>
        <button onClick={() => {}} className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
            isCompleted ? "bg-green-500/20 text-green-400 border border-green-500/30" : "glass text-slate-300 hover:bg-white/5"
        }`}>
            <CheckCircle2 size={18} />
            <span className="hidden md:block">تم الإكمال</span>
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8 p-8">
        <div className="lg:col-span-3 space-y-8">
          
          {/* Enhanced Video Player */}
          <div className="relative aspect-video rounded-3xl overflow-hidden glass border-white/5 shadow-[0_0_50px_-12px_rgba(168,85,247,0.2)]">
            <ReactPlayer 
                ref={(p) => setPlayerRef(p)}
                url={lesson.video_url}
                width="100%"
                height="100%"
                controls
                onProgress={({ playedSeconds }) => setCurrentTime(playedSeconds)}
            />
          </div>

          <div className="flex justify-between gap-6">
              <button className="flex-1 glass py-5 rounded-2xl text-slate-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/5 transition-all">
                  <ArrowBigRightDash size={20} />
                  <span>الدرس السابق</span>
              </button>
              <button className="flex-1 premium-gradient py-5 rounded-2xl text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-purple-900/40 hover:scale-[1.02] active:scale-95 transition-all">
                  <span>الدرس التالي</span>
                  <ArrowBigLeftDash size={20} />
              </button>
          </div>

          {/* TABS */}
          <div className="glass overflow-hidden border-white/5 rounded-3xl shadow-xl">
            <div className="flex border-b border-white/5 bg-white/[0.02]">
                {[
                    { id: "description", label: "الوصف", icon: <FileText size={18} /> },
                    { id: "resources", label: "المصادر", icon: <Download size={18} /> },
                    { id: "notes", label: "ملاحظاتي الذكية", icon: <MessageSquare size={18} /> }
                ].map((tab) => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 p-6 font-black text-xs uppercase tracking-widest transition-all relative ${
                            activeTab === tab.id ? "text-purple-400 bg-purple-500/5" : "text-slate-600 hover:text-slate-300"
                        }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {activeTab === tab.id && <motion.div layoutId="player-tab" className="absolute bottom-0 left-0 w-full h-[2px] premium-gradient" />}
                    </button>
                ))}
            </div>
            
            <div className="p-10 min-h-[400px]">
                <AnimatePresence mode="wait">
                    {activeTab === "description" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-slate-400 leading-relaxed font-bold">
                            <p className="text-lg">{lesson.description || "لا يوجد وصف متوفر لهذا الدرس."}</p>
                        </motion.div>
                    )}
                    {activeTab === "notes" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            {/* Create Note */}
                            <div className="glass p-6 border-white/5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest">ملاحظة جديدة عند {formatTime(currentTime)}</span>
                                </div>
                                <textarea 
                                    className="w-full bg-transparent border-b border-white/5 p-4 text-white outline-none focus:border-purple-500 transition-all font-bold resize-none h-24"
                                    placeholder="دون فكرتك أو سؤالك هنا..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                />
                                <button 
                                    onClick={handleSaveNote}
                                    className="px-10 py-3 premium-gradient rounded-xl text-white font-black text-xs shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95 transition-all"
                                >
                                    حفظ الملاحظة
                                </button>
                            </div>

                            {/* Notes List */}
                            <div className="space-y-4">
                                {notes.map((note) => (
                                    <div key={note.id} className="flex items-start gap-4 p-5 glass border-white/5 hover:border-purple-500/10 transition-all group">
                                        <button 
                                            onClick={() => jumpToNote(note.timestamp)}
                                            className="w-16 h-10 rounded-xl premium-gradient text-white flex items-center justify-center font-black text-xs"
                                        >
                                            {formatTime(note.timestamp)}
                                        </button>
                                        <div className="flex-1">
                                            <p className="text-white font-bold text-sm leading-relaxed">{note.content}</p>
                                        </div>
                                        <button className="p-2 text-slate-800 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
            <div className="glass border-white/5 h-full flex flex-col rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                    <h3 className="text-white font-black text-lg flex items-center gap-3">
                        <BookOpen size={22} className="text-purple-400" />
                        منهاج الدورة
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto max-h-[800px] no-scrollbar">
                    {allLessons.map((l, i) => (
                        <button 
                            key={l.id}
                            onClick={() => router.push(`/lessons/${l.id}`)}
                            className={`w-full p-6 text-right border-b border-white/5 transition-all flex items-start gap-5 group relative ${
                                l.id === id ? "bg-purple-500/5 shadow-inner" : "hover:bg-white/5"
                            }`}
                        >
                            {l.id === id && <div className="absolute right-0 top-0 w-1.5 h-full premium-gradient" />}
                            <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-xs font-black ${
                                l.id === id ? "premium-gradient text-white shadow-xl shadow-purple-900/30" : "glass text-slate-600 group-hover:text-purple-400"
                            }`}>
                                {i + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className={`text-sm font-black mb-1 truncate ${l.id === id ? "text-purple-400" : "text-slate-400"}`}>{l.title}</h4>
                                <div className="flex items-center gap-3 text-[10px] text-slate-700 font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-1"><Clock size={12} /> <span>15:00</span></div>
                                    {!l.is_free && <Lock size={12} className="text-purple-900/50" />}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

// Helper icons
const Trash2 = ({ size, className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 9 2 2 4-4"/></svg>
);
