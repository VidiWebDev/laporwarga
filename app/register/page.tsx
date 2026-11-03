"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }: any) => {
      if (data?.session) window.location.href = "/";
    });
  }, [supabase]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || loading) return;

    setError(null);

    if (password !== confirmPassword) {
      setError("Kata sandi dan konfirmasi tidak cocok");
      return;
    }

    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name.trim(),
          },
        },
      });

      if (authError) {
        setError(authError.message || "Gagal mendaftar");
      } else {
        window.location.href = "/login?registered=true";
      }
    } catch (e: any) {
      setError(e.message || "Terjadi kesalahan, coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#20241f] selection:bg-indigo-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-semibold text-sm transition-transform group-hover:scale-105">
              <span className="hidden sm:inline">L</span>
            </div>
            <span className="text-[#20241f] font-semibold text-lg tracking-tight">LaporWarga</span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-[#20241f]/15 bg-white p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#20241f] mb-2">
              Buat Akun Baru
            </h1>
            <p className="text-xs text-[#20241f]/60">Gabung komunitas warga peduli infrastruktur kota</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs text-[#20241f]/50 mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#20241f]/40 stroke-[1.5]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Muhammad Rizky"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white border border-[#20241f]/15 text-[#20241f] placeholder:text-[#20241f]/40 focus:outline-none focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#20241f]/50 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#20241f]/40 stroke-[1.5]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white border border-[#20241f]/15 text-[#20241f] placeholder:text-[#20241f]/40 focus:outline-none focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#20241f]/50 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#20241f]/40 stroke-[1.5]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-white border border-[#20241f]/15 text-[#20241f] placeholder:text-[#20241f]/40 focus:outline-none focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#20241f]/50 hover:text-[#20241f]/90 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 stroke-[1.5]" /> : <Eye className="w-4 h-4 stroke-[1.5]" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#20241f]/50 mb-1.5">
                Konfirmasi Kata Sandi
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#20241f]/40 stroke-[1.5]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-white border border-[#20241f]/15 text-[#20241f] placeholder:text-[#20241f]/40 focus:outline-none focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !name || !email || !password || !confirmPassword}
              className="w-full py-2.5 rounded-lg text-xs font-medium text-white bg-orange-500 hover:bg-[#fd7e14] transition-colors shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-[#20241f]/30 border-t-orange-500 rounded-full animate-spin" />
                  Membuat akun...
                </>
              ) : (
                "Daftar"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[#20241f]/50">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-medium text-[#20241f] hover:text-orange-600 underline underline-offset-2">
              Masuk sekarang
            </Link>
          </p>
        </div>

        <p className="text-center text-[10px] text-[#20241f]/50 mt-6">
          © {new Date().getFullYear()} LaporWarga
        </p>
      </div>
    </div>
  );
}