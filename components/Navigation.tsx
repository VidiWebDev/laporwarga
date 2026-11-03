"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Menu, X, LogOut, Activity, ShieldCheck, Settings } from "lucide-react";

const mainLinks = [
  { name: "Beranda", href: "/" },
  { name: "Buat Laporan", href: "/report" },
  { name: "Laporan Publik", href: "/reports" },
];

const adminLinks = [
  { name: "Dasbor", href: "/admin" },
  { name: "Laporan", href: "/admin/reports" },
  { name: "Petugas", href: "/admin/field" },
  { name: "User", href: "/admin/users" },
];

function getDisplayName(user: any): string {
  const meta = user?.user_metadata || {};
  return meta.full_name || user?.email?.split("@")[0] || "Warga";
}

export default function Navigation() {
  const pathname = usePathname();
  const [session, setSession] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  const isAdminRoute = pathname.startsWith("/admin");
  const isFieldRoute = pathname === "/lapangan";

  useEffect(() => {
    const sb = createClient();
    setSupabase(sb);
    sb.auth.getSession().then(({ data }: any) => setSession(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_event, session: any) => {
      setSession(session);
    });
    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      window.location.href = "/";
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#20241f] text-white border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="font-semibold text-white tracking-tight">LaporWarga</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {isAdminRoute ? (
              adminLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    pathname === link.href ? "text-white font-medium" : "text-emerald-50/70 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))
            ) : (
              mainLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    pathname === link.href ? "text-white font-medium" : "text-emerald-50/70 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))
            )}
            {isFieldRoute && (
              <Link href="/lapangan" className="text-sm text-orange-400 font-medium">
                Panel Lapangan
              </Link>
            )}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {session?.user ? (
              <>
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-emerald-50 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
                >
                  <Activity className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span className="max-w-[150px] truncate">{getDisplayName(session.user)}</span>
                  <Settings className="h-3 w-3 ml-1 text-emerald-50/60" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-emerald-50/60 hover:text-white transition-colors"
                  title="Keluar"
                >
                  <LogOut className="h-4 w-4" />
                </button>
                {isAdminRoute && (
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 rounded-lg bg-orange-500 text-xs font-medium text-white hover:bg-orange-600 transition-colors"
                  >
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-emerald-50/70 hover:text-white transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl bg-orange-500 text-sm font-medium text-white hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-emerald-50"
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#20241f] px-4 pb-6 pt-4 space-y-3">
          {isAdminRoute ? (
            adminLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-emerald-50/70 hover:text-white"
              >
                {link.name}
              </Link>
            ))
          ) : (
            mainLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm text-emerald-50/70 hover:text-white"
              >
                {link.name}
              </Link>
            ))
          )}

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            {session?.user ? (
              <>
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 text-emerald-50 hover:bg-white/10 transition-colors text-sm font-medium"
                >
                  <Settings className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{getDisplayName(session.user)}</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="h-10 rounded-xl bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-10 flex items-center justify-center rounded-xl border border-white/20 text-sm text-white"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="h-10 flex items-center justify-center rounded-xl bg-orange-500 text-white text-sm font-medium"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}