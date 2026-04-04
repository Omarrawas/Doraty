"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [role, setRole] = useState<"admin" | "teacher" | "super_admin" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkRole() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Check role in DB
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (profile?.role === "admin" || profile?.role === "super_admin" || profile?.role === "teacher") {
        setRole(profile.role as any);
      } else {
        router.push("/"); // Redirect student
      }
      setLoading(false);
    }
    checkRole();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white"><div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!role) return null;

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden">
      <AdminSidebar role={role} />
      <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        <div className="p-10 pb-40">
            {children}
        </div>
      </main>
    </div>
  );
}
