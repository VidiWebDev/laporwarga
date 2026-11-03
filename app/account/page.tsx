"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { User, Shield, Key, Mail, Trash2, ArrowLeft, Check } from "lucide-react";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const sb = createClient();
    sb.auth.getUser().then(({ data }: any) => {
      const u = data?.user;
      setUser(u);
      if (u) {
        setFullName(u.user_metadata?.full_name || "");
      }
      setLoading(false);
    });
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const sb = createClient();
    const { error } = await sb.auth.updateUser({
      data: { full_name: fullName },
    });

    setSaving(false);
    if (error) {
      setMessage("Gagal memperbarui profil: " + error.message);
    } else {
      setMessage("Profil berhasil diperbarui!");
      setUser({ ...user, user_metadata: { ...user?.user_metadata, full_name: fullName } });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-[#20241f]/50">
        <div className="w-5 h-5 border-2 border-[#20241f]/15 border-t-emerald-700 rounded-full animate-spin mr-3" />
        MEMUAT...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] text-[#20241f] flex items-center justify-center p-4">
        <div className="max-w-sm w-full border border-[#20241f]/15 bg-white rounded-2xl p-6 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#20241f]">Masuk diperlukan</h2>
            <p className="text-xs text-[#20241f]/60 mt-1">Silakan masuk untuk mengakses halaman akun Anda.</p>
          </div>
          <Link
            href="/login"
            className="block w-full py-2.5 rounded-xl text-xs font-medium bg-emerald-900 text-white hover:bg-emerald-800 transition-colors shadow-sm"
          >
            Masuk ke LaporWarga
          </Link>
        </div>
      </div>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Warga";

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#20241f] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-[#20241f]/60 hover:text-[#20241f] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>

        {/* Header */}
        <div className="border-b border-[#20241f]/15 pb-6">
          <div className="text-xs text-[#20241f]/50 uppercase tracking-wider mb-1">
            Pengaturan Akun
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#20241f]">
            Profil & Pengaturan
          </h1>
          <p className="text-sm text-[#20241f]/60 mt-1">
            Kelola informasi pribadi dan preferensi akun LaporWarga Anda.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-[#20241f]/15 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-900 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-900/20">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#20241f]">{displayName}</h2>
              <p className="text-xs text-[#20241f]/60">{user.email}</p>
              <span className="inline-flex items-center gap-1 mt-1 text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Check className="w-3 h-3" /> Akun Terverifikasi
              </span>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-xs ${message.includes("Gagal") ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-800 border border-emerald-200"}`}>
              {message}
            </div>
          )}

          {/* Edit Profile Form */}
          <form onSubmit={handleUpdateProfile} className="space-y-4 pt-4 border-t border-[#20241f]/10">
            <div>
              <label className="block text-xs font-medium text-[#20241f]/70 mb-1.5">
                Nama Lengkap / Nickname
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full h-10 rounded-xl border border-[#20241f]/15 bg-[#f8f7f4] px-3 text-sm text-[#20241f] focus:border-emerald-700 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#20241f]/70 mb-1.5">
                Alamat Email (Tidak dapat diubah)
              </label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                className="w-full h-10 rounded-xl border border-[#20241f]/10 bg-[#f8f7f4]/50 px-3 text-sm text-[#20241f]/50 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-emerald-900 text-white text-xs font-medium hover:bg-emerald-800 transition-colors shadow-md shadow-emerald-900/20 disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </form>
        </div>

        {/* Security & Info Card */}
        <div className="rounded-2xl border border-[#20241f]/15 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-[#20241f] flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-700" /> Keamanan & Privasi
          </h3>
          <div className="divide-y divide-[#20241f]/10 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-[#20241f]">Status Akun</p>
                <p className="text-[#20241f]/60">Aktif & terhubung via Supabase Auth</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-medium">Aktif</span>
            </div>
            <div className="py-3 flex items-center justify-between">
              <div>
                <p className="font-medium text-[#20241f]">Terdaftar Sejak</p>
                <p className="text-[#20241f]/60">
                  {new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}