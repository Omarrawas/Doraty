"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Plus, Video, MapPin, Clock, Calendar, Link2, Trash2,
  Edit2, X, Save, AlertCircle, CheckCircle2, Radio,
  Youtube, Monitor, ExternalLink, PlayCircle
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type SessionStatus = "upcoming" | "live_now" | "completed" | "cancelled";
type SessionPlatform = "zoom" | "meet" | "youtube" | "teams" | "other";

interface Session {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  scheduled_at: string;
  duration_minutes: number;
  join_url?: string;
  platform: SessionPlatform;
  location?: string;
  recording_url?: string;
  status: SessionStatus;
  max_attendees?: number;
}

interface Course {
  id: string;
  title: string;
  delivery_mode: string;
}

const PLATFORM_ICONS: Record<SessionPlatform, React.ReactNode> = {
  zoom: <Video size={14} />,
  meet: <Monitor size={14} />,
  youtube: <Youtube size={14} />,
  teams: <Video size={14} />,
  other: <Link2 size={14} />,
};

const PLATFORM_LABELS: Record<SessionPlatform, string> = {
  zoom: "Zoom",
  meet: "Google Meet",
  youtube: "YouTube Live",
  teams: "Microsoft Teams",
  other: "رابط مخصص",
};

const STATUS_CONFIG: Record<SessionStatus, { label: string; color: string; bg: string }> = {
  upcoming:  { label: "🕐 قادمة",      color: "#8B5CF6", bg: "rgba(139,92,246,0.12)" },
  live_now:  { label: "🔴 مباشر الآن", color: "#EF4444", bg: "rgba(239,68,68,0.12)"  },
  completed: { label: "✅ منتهية",     color: "#22C55E", bg: "rgba(34,197,94,0.12)"  },
  cancelled: { label: "❌ ملغاة",     color: "#6B7280", bg: "rgba(107,114,128,0.12)"},
};

const emptyForm = (): Partial<Session> => ({
  title: "",
  description: "",
  scheduled_at: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  duration_minutes: 60,
  platform: "zoom",
  join_url: "",
  location: "",
  recording_url: "",
  status: "upcoming",
  max_attendees: undefined,
});

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminSessionsPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [form, setForm] = useState<Partial<Session>>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Toast helper
  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // Load live/in-person courses
  useEffect(() => {
    supabase
      .from("courses")
      .select("id, title, delivery_mode")
      .in("delivery_mode", ["live", "in_person"])
      .order("title")
      .then(({ data }) => setCourses(data ?? []));
  }, []);

  // Load sessions for selected course
  const loadSessions = useCallback(async (courseId: string) => {
    setLoading(true);
    const { data } = await supabase
      .from("sessions")
      .select("*")
      .eq("course_id", courseId)
      .order("scheduled_at", { ascending: true });
    setSessions(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedCourse) loadSessions(selectedCourse.id);
  }, [selectedCourse, loadSessions]);

  const openCreate = () => {
    setEditingSession(null);
    setForm({ ...emptyForm(), course_id: selectedCourse?.id });
    setShowForm(true);
  };

  const openEdit = (s: Session) => {
    setEditingSession(s);
    setForm({
      ...s,
      scheduled_at: new Date(s.scheduled_at).toISOString().slice(0, 16),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الجلسة؟")) return;
    await supabase.from("sessions").delete().eq("id", id);
    showToast("تم حذف الجلسة");
    if (selectedCourse) loadSessions(selectedCourse.id);
  };

  const handleSave = async () => {
    if (!form.title?.trim()) return alert("عنوان الجلسة مطلوب");
    setSaving(true);
    const payload = {
      ...form,
      course_id: selectedCourse!.id,
      scheduled_at: new Date(form.scheduled_at!).toISOString(),
    };
    if (editingSession) {
      await supabase.from("sessions").update(payload).eq("id", editingSession.id);
      showToast("تم تحديث الجلسة");
    } else {
      await supabase.from("sessions").insert(payload);
      showToast("تم إنشاء الجلسة");
    }
    setSaving(false);
    setShowForm(false);
    if (selectedCourse) loadSessions(selectedCourse.id);
  };

  const f = (k: keyof Session, v: any) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="min-h-screen" style={{ background: "#0B0C15", direction: "rtl" }}>
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold shadow-xl"
          style={{ background: toast.ok ? "#22C55E22", border: `1px solid ${toast.ok ? "#22C55E" : "#EF4444"}`, color: toast.ok ? "#22C55E" : "#EF4444" }}>
          {toast.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-bold uppercase tracking-widest">إدارة الجلسات المباشرة</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">جلسات البث المباشر والحضوري</h1>
          <p className="text-slate-500 text-sm mt-1">
            أضف وعدّل جلسات الدورات المباشرة — روابط الانضمام، المواعيد، وإضافة التسجيلات لاحقاً.
          </p>
        </div>

        {/* Course Selector */}
        <div className="glass rounded-2xl p-5 mb-8" style={{ border: "1px solid rgba(139,92,246,0.2)" }}>
          <label className="block text-slate-400 text-sm mb-2 font-medium">اختر الدورة</label>
          {courses.length === 0 ? (
            <p className="text-slate-600 text-sm">
              لا توجد دورات من نوع مباشر أو حضوري. قم بتغيير نوع التسليم لدورة من إدارة الدورات.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courses.map((c) => (
                <button key={c.id} onClick={() => setSelectedCourse(c)}
                  className="text-right px-4 py-3 rounded-xl transition-all text-sm font-semibold"
                  style={{
                    background: selectedCourse?.id === c.id ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)",
                    border: `1.5px solid ${selectedCourse?.id === c.id ? "#8B5CF6" : "rgba(255,255,255,0.07)"}`,
                    color: selectedCourse?.id === c.id ? "#c4b5fd" : "#94a3b8",
                  }}>
                  <div className="flex items-center gap-2">
                    {c.delivery_mode === "live"
                      ? <Radio size={14} className="text-red-400" />
                      : <MapPin size={14} className="text-purple-400" />}
                    <span className="truncate">{c.title}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sessions List */}
        {selectedCourse && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-lg">
                جلسات: <span className="text-purple-400">{selectedCourse.title}</span>
              </h2>
              <button onClick={openCreate}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#7B2CBF,#1978E5)", color: "white" }}>
                <Plus size={16} />
                جلسة جديدة
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-20 text-slate-600">
                <Video size={52} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">لا توجد جلسات بعد</p>
                <p className="text-sm mt-1">اضغط "جلسة جديدة" لإضافة أول جلسة</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((s) => (
                  <SessionCard key={s.id} session={s}
                    onEdit={() => openEdit(s)}
                    onDelete={() => handleDelete(s.id)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Session Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
          <div className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            style={{ background: "#1E293B", border: "1px solid rgba(139,92,246,0.25)" }}>

            {/* Modal header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">
                {editingSession ? "تعديل الجلسة" : "جلسة جديدة"}
              </h3>
              <button onClick={() => setShowForm(false)}
                className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <FormField label="عنوان الجلسة *">
                <input value={form.title ?? ""} onChange={(e) => f("title", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-white text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.25)" }}
                  placeholder="مثال: الجلسة الأولى — مقدمة في الرياضيات" />
              </FormField>

              <FormField label="وصف (اختياري)">
                <textarea value={form.description ?? ""} onChange={(e) => f("description", e.target.value)}
                  rows={2} className="w-full px-3 py-2.5 rounded-xl text-white text-sm resize-none"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.25)" }} />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="موعد الجلسة *">
                  <input type="datetime-local" value={form.scheduled_at ?? ""}
                    onChange={(e) => f("scheduled_at", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-white text-sm"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.25)",
                      colorScheme: "dark" }} />
                </FormField>
                <FormField label="المدة (دقيقة)">
                  <input type="number" value={form.duration_minutes ?? 60}
                    onChange={(e) => f("duration_minutes", +e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-white text-sm"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.25)" }} />
                </FormField>
              </div>

              <FormField label="المنصة">
                <select value={form.platform ?? "zoom"} onChange={(e) => f("platform", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-white text-sm"
                  style={{ background: "#1E293B", border: "1px solid rgba(139,92,246,0.25)" }}>
                  {(["zoom", "meet", "youtube", "teams", "other"] as SessionPlatform[]).map((p) => (
                    <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="رابط الانضمام">
                <input value={form.join_url ?? ""} onChange={(e) => f("join_url", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-white text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.25)" }}
                  placeholder="https://zoom.us/j/..." />
              </FormField>

              <FormField label="المكان (للحضوري)">
                <input value={form.location ?? ""} onChange={(e) => f("location", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-white text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.25)" }}
                  placeholder="مثال: قاعة الرياض — مركز التدريب" />
              </FormField>

              <FormField label="رابط التسجيل (يُضاف بعد الجلسة)">
                <input value={form.recording_url ?? ""} onChange={(e) => f("recording_url", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-white text-sm"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.25)" }}
                  placeholder="https://..." />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="الحالة">
                  <select value={form.status ?? "upcoming"} onChange={(e) => f("status", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-white text-sm"
                    style={{ background: "#1E293B", border: "1px solid rgba(139,92,246,0.25)" }}>
                    {(["upcoming", "live_now", "completed", "cancelled"] as SessionStatus[]).map((s) => (
                      <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                    ))}
                  </select>
                </FormField>
                <FormField label="أقصى عدد مشاركين">
                  <input type="number" value={form.max_attendees ?? ""}
                    onChange={(e) => f("max_attendees", e.target.value ? +e.target.value : undefined)}
                    className="w-full px-3 py-2.5 rounded-xl text-white text-sm"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.25)" }}
                    placeholder="غير محدود" />
                </FormField>
              </div>

              <button onClick={handleSave} disabled={saving}
                className="w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#7B2CBF,#1978E5)" }}>
                {saving
                  ? <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  : <><Save size={16} /> {editingSession ? "حفظ التعديلات" : "إنشاء الجلسة"}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Session Card ──────────────────────────────────────────────────────────────
function SessionCard({ session, onEdit, onDelete }: {
  session: Session;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const cfg = STATUS_CONFIG[session.status];
  const dateStr = new Date(session.scheduled_at).toLocaleString("ar-SA", {
    weekday: "long", day: "numeric", month: "long",
    year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="rounded-2xl p-5 transition-all hover:scale-[1.005]"
      style={{ background: cfg.bg, border: `1.5px solid ${cfg.color}40` }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: `${cfg.color}25`, color: cfg.color, border: `1px solid ${cfg.color}50` }}>
              {cfg.label}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              {PLATFORM_ICONS[session.platform]}
              {PLATFORM_LABELS[session.platform]}
            </span>
          </div>
          <h3 className="text-white font-bold text-base truncate">{session.title}</h3>
          {session.description && (
            <p className="text-slate-500 text-xs mt-1 line-clamp-2">{session.description}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            <span className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Calendar size={12} /> {dateStr}
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 text-xs">
              <Clock size={12} /> {session.duration_minutes} دقيقة
            </span>
            {session.location && (
              <span className="flex items-center gap-1.5 text-slate-500 text-xs">
                <MapPin size={12} /> {session.location}
              </span>
            )}
            {session.max_attendees && (
              <span className="text-slate-500 text-xs">👥 {session.max_attendees} مشارك</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={onEdit}
            className="p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.05)" }}>
            <Edit2 size={15} />
          </button>
          <button onClick={onDelete}
            className="p-2 rounded-xl text-red-400 hover:text-red-300 transition-colors"
            style={{ background: "rgba(239,68,68,0.08)" }}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-4 flex-wrap">
        {session.join_url && (session.status === "upcoming" || session.status === "live_now") && (
          <a href={session.join_url} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:opacity-90"
            style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.3)" }}>
            <ExternalLink size={12} /> انضم للجلسة
          </a>
        )}
        {session.recording_url && (
          <a href={session.recording_url} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{ background: "rgba(139,92,246,0.15)", color: "#8B5CF6", border: "1px solid rgba(139,92,246,0.3)" }}>
            <PlayCircle size={12} /> شاهد التسجيل
          </a>
        )}
        {session.status === "completed" && !session.recording_url && (
          <button onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
            style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)" }}>
            <Link2 size={12} /> أضف رابط التسجيل
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Form Field Helper ──────────────────────────────────────────────────────────
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}
