"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { MapPin, Camera, Send, AlertTriangle, ShieldCheck } from "lucide-react";

export default function ReportPage() {
  const router = useRouter();
  const [supabase, setSupabase] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "road_damage",
    urgency: "medium" as "low" | "medium" | "high",
    latitude: 0,
    longitude: 0,
    addressNote: "",
    imageFile: null as File | null,
    isAnonymous: false,
  });

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get("category");
    if (cat) {
      setForm((prev) => ({ ...prev, category: cat }));
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
      },
      (err) => console.warn("Geolocation warning:", err.message)
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || loading) return;

    setLoading(true);
    setError(null);

    const cleanForm = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      urgency: form.urgency,
      latitude: form.latitude,
      longitude: form.longitude,
      address_note: form.addressNote,
      is_anonymous: form.isAnonymous,
    };

    if (!cleanForm.title || !cleanForm.description || cleanForm.latitude === 0) {
      setError("Judul, deskripsi, dan koordinat GPS wajib diisi dengan benar.");
      setLoading(false);
      return;
    }

    try {
      let imageUrl = null;
      if (form.imageFile) {
        const { data, error: uploadErr } = await supabase.storage
          .from("report-images")
          .upload(`reports/${Date.now()}_${form.imageFile.name}`, form.imageFile, {
            cacheControl: "3600",
            upsert: false,
          });
        if (uploadErr) throw uploadErr;
        if (data) {
          const { data: { publicUrl } } = supabase.storage
            .from("report-images")
            .getPublicUrl(data.path);
          imageUrl = publicUrl;
        }
      }

      const { error: insertErr } = await supabase.from("reports").insert({
        ...cleanForm,
        image_url: imageUrl,
        status: "submitted",
      });

      if (insertErr) throw insertErr;

      router.push("/reports");
    } catch (err: any) {
      setError("Gagal menyimpan laporan: " + (err.message || "Kesalahan sistem"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#20241f] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-[#20241f]/15 pb-6">
          <div className="text-xs text-[#20241f]/50 uppercase tracking-wider mb-1">
            Formulir Pengaduan
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#20241f]">
            Laporkan Masalah Infrastruktur
          </h1>
          <p className="text-xs text-[#20241f]/60 mt-1">
            Data akan diverifikasi oleh sistem dan langsung diteruskan ke tim lapangan terkait.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Details */}
          <div className="rounded-xl border border-[#20241f]/15 bg-white p-6 space-y-4">
            <h2 className="text-xs text-[#20241f]/50 uppercase tracking-wider">
              1. Detail Laporan
            </h2>

            <div>
              <label className="block text-xs text-[#20241f]/50 mb-1.5">
                Judul Laporan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Contoh: Lubang jalan berbahaya di Jl. Merdeka KM 4"
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#20241f]/15 text-[#20241f] placeholder:text-[#20241f]/40 focus:outline-none focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#20241f]/50 mb-1.5">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#20241f]/15 text-[#20241f] focus:outline-none focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 transition-colors"
                >
                  <option value="road_damage">Jalan Rusak</option>
                  <option value="garbage">Sampah Liar</option>
                  <option value="flooding">Banjir</option>
                  <option value="lighting">Lampu Jalan</option>
                  <option value="drainage">Saluran Tersumbat</option>
                  <option value="environment">Fasilitas Umum</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#20241f]/50 mb-1.5">
                  Tingkat Urgensi <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.urgency}
                  onChange={(e) => setForm((prev) => ({ ...prev, urgency: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-[#20241f]/15 text-[#20241f] focus:outline-none focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 transition-colors"
                >
                  <option value="low">Rendah</option>
                  <option value="medium">Sedang</option>
                  <option value="high">Tinggi (Darurat)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#20241f]/50 mb-1.5">
                Deskripsi Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                required
                rows={4}
                placeholder="Jelaskan kondisi kerusakan secara detail, estimasi ukuran, dan dampak bagi pengguna jalan..."
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#20241f]/15 text-[#20241f] placeholder:text-[#20241f]/40 focus:outline-none focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Section: Location & Media */}
          <div className="rounded-xl border border-[#20241f]/15 bg-white p-6 space-y-4">
            <h2 className="text-xs text-[#20241f]/50 uppercase tracking-wider">
              2. Geolokasi & Dokumentasi
            </h2>

            <div>
              <label className="block text-xs text-[#20241f]/50 mb-1.5">
                Koordinat GPS <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  disabled
                  value={
                    form.latitude !== 0
                      ? `${form.latitude.toFixed(6)}, ${form.longitude.toFixed(6)}`
                      : "Mendapatkan sinyal GPS..."
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#f8f7f4] border border-[#20241f]/15 font-mono text-xs text-[#20241f]/50 cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => {
                        setForm((prev) => ({
                          ...prev,
                          latitude: pos.coords.latitude,
                          longitude: pos.coords.longitude,
                        }));
                      },
                      (err) => alert("Gagal mendapatkan lokasi: " + err.message)
                    );
                  }}
                  className="px-3 py-2 rounded-lg bg-white border border-[#20241f]/15 text-xs text-[#20241f]/80 hover:bg-[#20241f]/10 transition-colors shrink-0"
                >
                  <MapPin className="w-3.5 h-3.5 inline mr-1 text-[#20241f]/50" />
                  Refresh
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#20241f]/50 mb-1.5">
                Catatan Alokasi (Opsional)
              </label>
              <input
                type="text"
                value={form.addressNote}
                onChange={(e) => setForm((prev) => ({ ...prev, addressNote: e.target.value }))}
                placeholder="Contoh: Di depan minimarket ABC / Sebelah jembatan"
                className="w-full px-3 py-2 rounded-lg bg-white border border-[#20241f]/15 text-[#20241f] placeholder:text-[#20241f]/40 focus:outline-none focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-[#20241f]/50 mb-1.5">
                Bukti Foto (Opsional)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setForm((prev) => ({ ...prev, imageFile: file }));
                  }}
                  className="block w-full text-xs text-[#20241f]/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:bg-[#f8f7f4] file:text-[#20241f]/80 hover:file:bg-white file:cursor-pointer transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section: Privacy */}
          <div className="rounded-xl border border-[#20241f]/15 bg-white p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isAnonymous}
                onChange={(e) => setForm((prev) => ({ ...prev, isAnonymous: e.target.checked }))}
                className="w-4 h-4 rounded border-[#20241f]/30 bg-white text-[#20241f]/80 focus:ring-emerald-700 cursor-pointer"
              />
              <div>
                <span className="text-xs font-medium text-[#20241f]">Kirim sebagai Anonim</span>
                <p className="text-[11px] text-[#20241f]/60">Identitas Anda disembunyikan dari publik.</p>
              </div>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || form.latitude === 0 || !form.title || !form.description}
            className="w-full py-2.5 rounded-lg text-xs font-medium text-white bg-orange-500 hover:bg-[#fd7e14] transition-colors shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 uppercase tracking-wider"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#20241f]/30 border-t-orange-500 rounded-full animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Kirim Laporan Resmi
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}