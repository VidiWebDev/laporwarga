"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, ShieldCheck, Home, AlertTriangle, Package, MapPin, Phone, Users, Wrench, Camera, Send, FileText, CheckCircle2, Clock as ClockIcon } from "lucide-react";

export default function PanduanJalanRusakPage() {
  const steps = [
    {
      title: "Persiapan Sebelum Melapor",
      icon: ShieldCheck,
      items: [
        "Foto kerusakan dari beberapa sudut: dekat (detail lubang/retak), menengah (konteks jalan), jauh (lingkungan). Pastikan pencahayaan cukup.",
        "Catat koordinat GPS: buka Google Maps, tap-tahan lokasi, salin koordinat (contoh: -6.2088, 106.8456). Atau gunakan fitur GPS otomatis di form LaporWarga.",
        "Catat detail: nama jalan, RT/RW, kelurahan, kecamatan, patokan terdekat (sekolah, masjid, toko, tikungan). Ukur estimasi ukuran lubang/retak (diameter, kedalaman).",
        "Catat waktu kejadian/penemuan & kondisi cuaca saat itu. Apakah sudah lama atau baru terjadi?",
        "Siapkan KTP/identitas (jika tidak anonir) & nomor HP aktif untuk kontak petugas verifikasi.",
      ],
    },
    {
      title: "Cara Melapor via LaporWarga",
      icon: Wrench,
      items: [
        "Buka laporwarga.app → klik \"Buat Laporan\" atau akses langsung /report.",
        "Isi Judul: singkat & spesifik. Contoh: \"Lubang Jalan Berbahaya Jl. Merdeka KM 4 Depan SDN 1\".",
        "Pilih Kategori: \"Jalan Rusak\". Urgensi: \"Tinggi\" jika lubang besar/berbahaya di jalur utama, \"Sedang\" jika gang kecil, \"Rendah\" jika retak halus.",
        "Tulis Deskripsi lengkap: posisi tepat, ukuran estimasi, dampak (lalu lintas macet, kecelakaan potensial, genangan air), kronologi.",
        "Upload foto bukti (maks. 5 MB). Aktifkan GPS/koordinat. Isi catatan lokasi (patokan). Centang \"Anonim\" jika perlu.",
        "Klik \"Kirim Laporan Resmi\". Simpan ID laporan (format: LPR-XXXXXX) untuk tracking.",
      ],
    },
    {
      title: "Proses Setelah Laporan Masuk",
      icon: CheckCircle2,
      items: [
        "Status \"Diajukan\": Laporan masuk sistem, divalidasi otomatis (koordinat, foto, kelengkapan).",
        "Status \"Verifikasi\": Tim verifikasi cek kelayakan 1-2 hari kerja. Bisa hubungi pelapor untuk klarifikasi.",
        "Status \"Proses\": Diteruskan ke Dinas PU/Pekerjaan Umum atau kelurahan untuk perbaikan. Estimasi SLA: 3-14 hari tergantung skala.",
        "Status \"Selesai\": Perbaikan selesai. Pelapor dapat notifikasi & diminta konfirmasi/foto hasil.",
        "Jika \"Ditolak\": Alasan ditampilkan (duplikat, bukan kewenangan, data tidak lengkap). Bisa lapor ulang dengan data lebih lengkap.",
      ],
    },
  ];

  const tips = [
    { icon: Camera, title: "Foto Berkualitas", desc: "Ambil siang hari, jangan blur. Sertakan konteks (patokan, skala seperti sepatu/botol di samping lubung)." },
    { icon: MapPin, title: "Lokasi Akurat", desc: "GPS otomatis + catatan manual (\"depan SDN 1, sisi kanan arah utara\") mempercepat tim lapangan menemukan titik." },
    { icon: FileText, title: "Deskripsi Spesifik", desc: "Hindari \"jalan rusak\" saja. Tuliskan: \"Lubang diameter 60cm, kedalaman 15cm, di jalur kiri arah utara, menyebabkan motor terjun\"." },
    { icon: Users, title: "Ajak Warga Lain", desc: "Semakin banyak warga melapor lokasi sama, prioritas penanganan naik. Bagikan link laporan ke grup RT/RW." },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#20241f]">
      {/* Hero */}
      <section className="relative bg-emerald-900 text-white py-16 sm:py-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[url('/foto/panduan-jalan-rusak.jpg')] bg-cover bg-center opacity-10" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-100 hover:text-white text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Beranda
          </Link>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium mb-4">
            <Clock className="w-3.5 h-3.5" />
            4 menit baca
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4">
            Cara Melaporkan Jalan Rusak ke Pemerintah
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Panduan langkah demi langkah agar laporan jalan rusak Anda cepat diverifikasi & ditindaklanjuti Dinas PU.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">
          {steps.map((step, idx) => (
            <section key={step.title} className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <span className="text-xs text-[#20241f]/50 uppercase tracking-wider">Langkah {idx + 1}</span>
                  <h2 className="text-xl font-bold text-[#20241f] mt-1">{step.title}</h2>
                </div>
              </div>
              <ol className="space-y-4">
                {step.items.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full border border-emerald-200 bg-white flex items-center justify-center text-xs font-medium text-emerald-700 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-[#20241f]/80 leading-relaxed">{item}</p>
                  </li>
                ))}
              </ol>
            </section>
          ))}

          {/* Tips */}
          <section className="space-y-6">
            <h2 className="text-lg font-semibold text-[#20241f] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              Tips Agar Laporan Cepat Diproses
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {tips.map((tip) => (
                <div key={tip.title} className="rounded-xl border border-[#20241f]/15 bg-white p-5">
                  <tip.icon className="w-5 h-5 text-emerald-700 mb-2" />
                  <h3 className="font-medium text-[#20241f] mb-1">{tip.title}</h3>
                  <p className="text-xs text-[#20241f]/60">{tip.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-2xl bg-emerald-900 text-white p-6 sm:p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Siap Melapor Jalan Rusak?</h3>
            <p className="text-emerald-100 mb-4 max-w-md mx-auto">
              Foto, lokasi, deskripsi siap? Langsung kirim via LaporWarga — otomatis terkirim ke Dinas terkait.
            </p>
            <Link
              href="/report?category=road_damage"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
            >
              Buat Laporan Jalan Rusak
              <Send className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#20241f]/10 bg-white py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center text-xs text-[#20241f]/50">
          <p>© {new Date().getFullYear()} LaporWarga. Proses berbasis Peraturan Menteri PUPR & SOP Dinas PU.</p>
          <p className="mt-1">Sumber: Permen PUPR No. 14/2023, SOP Penanganan Keluhan Infrastruktur.</p>
        </div>
      </footer>
    </div>
  );
}