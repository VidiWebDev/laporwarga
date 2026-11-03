"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  ClipboardList,
  ChevronRight,
  Shield,
} from "lucide-react";

const navItems = [
  { key: "overview", label: "Overview", href: "/admin", icon: LayoutDashboard },
  { key: "reports", label: "Kelola Laporan", href: "/admin/reports", icon: FileText },
  { key: "users", label: "Kelola User", href: "/admin/users", icon: Users },
  { key: "field", label: "Petugas Lapangan", href: "/admin/field", icon: ClipboardList },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [supabase, setSupabase] = useState<any>(null);
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const sb = createClient();
    setSupabase(sb);
    sb.auth.getUser().then(({ data }: any) => {
      if (data?.user) {
        setUser(data.user);
        sb.from("users")
          .select("role")
          .eq("id", data.user.id)
          .single()
          .then(({ data: userData }: any) => {
            setRole(userData?.role || "user");
          });
      } else {
        setUser(null);
        setRole("user");
      }
    }).catch(() => {
      setUser(null);
      setRole("user");
    });
  }, []);

  // Set active tab based on URL
  useEffect(() => {
    const path = window.location.pathname;
    const found = navItems.find((n) => n.href === path);
    if (found) setActive(found.key);
  }, []);

  if (role === null) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
        <div className="text-xs text-slate-500">MEMUAKKUN ADMIN...</div>
      </div>
    );
  }

  if (!user || role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="max-w-sm w-full border border-slate-200 bg-white rounded-xl p-6 text-center space-y-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-500">
            <Shield className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Akses Terbatas Admin</h2>
            <p className="text-xs text-slate-500 mt-1">Hanya akun administrator yang dapat mengakses panel ini.</p>
          </div>
          <Link
            href={user ? "/" : "/login"}
            className="block w-full py-2 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            {user ? "Kembali ke Beranda" : "Masuk sebagai Admin"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#20241f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-[#20241f]/60 mb-6">
          <Link href="/" className="hover:text-emerald-700 transition-colors">admin</Link>
          <ChevronRight className="w-3 h-3 text-[#20241f]/40" />
          <span className="text-[#20241f] font-medium">
            {navItems.find((n) => n.key === active)?.label || "Panel"}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <div className="flex lg:flex-col gap-1 overflow-x-auto scrollbar-none lg:overflow-visible lg:sticky lg:top-24">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.key;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-emerald-50 text-emerald-900 font-medium border border-emerald-200"
                        : "text-[#20241f]/60 hover:text-[#20241f] hover:bg-emerald-50"
                    }`}
                  >
                    <Icon className={`w-4 h-4 stroke-[1.5] ${isActive ? "text-emerald-700" : "text-[#20241f]/40"}`} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
