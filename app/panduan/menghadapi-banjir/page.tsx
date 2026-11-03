"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, ShieldCheck, Home, AlertTriangle, Package, MapPin, Phone, Users } from "lucide-react";

export default function PanduanBanjirPage() {
  const steps = [
    {
      title: "Sebelum Banjir: Persiapan Dini",
      icon: ShieldCheck,
      items: [
        "Pantau info cuaca & peringatan dini via BMKG, BPBD, atau aplikasi cuaca resmi.",
        "Siapkan tas siaga (go-bag): dokumen penting (KTP, KK, BPJS) dalam plastik kedap air, obat-obatan, pakaian ganti, makanan ringan, air minum, senter, power bank, uang tunai kecil.",
        "Identifikasi jalur evakuasi & titik pengungsian terdekat (balai desa, masjid, sekolah). Catat nomor darurat: BPBD, SAR, Polisi, PMI, PLN, PDAM.",
        "Bersihkan saluran air & parit di depan rumah. Pastikan pompa air/genset berfungsi jika ada.",
        "Tinggikan barang elektronik & bernilai ke tempat lebih tinggi. Matikan listrik & gas jika air mulai naik.",
      ],
    },
    {
      title: "Saat Banjir Terjadi: Langkah Selamat",
      icon: AlertTriangle,
      items: [
        "Jangan panik. Prioritaskan keselamatan jiwa, bukan barang.",
        "Evakuasi segera ke tempat tinggi jika air naik cepat. Bawa tas siaga & keluarga.",
        "Jauhi arus air deras, saluran terbuka, & tiang listrik. Air setinggi lutut bisa menjatuhkan orang dewasa.",
        "Jika terjebak di rumah, pindah ke lantai atas/atap. Beri isyarat dengan kain berwarna terang/senter.",
        "Jangan mencoba menyebrang banjir berjalan kaki atau berkendara. Arus 15 cm bisa menghempaskan motor, 30 cm mobil.",
      ],
    },
    {
      title: "Pasca Banjir: Pulih & Bersih",
      icon: Home,
      items: [
        "Pastikan situasi aman sebelum pulang. Periksa struktur bangunan, instalasi listrik, & gas.",
        "Bersihkan lumpur & kotoran sambil memakai boot, sarung tangan, & masker. Disinfektan permukaan yang terendam.",
        "Buang makanan/minuman yang terkena air banjir. Periksa air PDAM/sumur sebelum diminum.",
        "Foto/video kerusakan untuk bukti laporan asuransi & bantuan pemerintah.",
        "Laporkan kerusakan infrastruktur (jalan, jembatan, saluran, listrik) via LaporWarga agar segera ditindaklanjuti.",
      ],
    },
  ];

  const contacts = [
    { label: "BPBD Kabupaten/Kota", number: "117 / (021) 8082-8888", icon: Users },
    { label: "BNPB Nasional", number: "117 / 129", icon: ShieldCheck },
    { label: "BASARNAS (SAR)", number: "115 / 151", icon: MapPin },
    { label: "PMI (Palang Merah Indonesia)", number: "118 / 119", icon: Package },
    { label: "PLN Darurat", number: "123", icon: Phone },
    { label: "Polisi / Ambulans", number: "110 / 118", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#20241f]">
      {/* Hero */}
      <section className="relative bg-emerald-900 text-white py-16 sm:py-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[url('/foto/panduan-banjir.jpg')] bg-cover bg-center opacity-10" />
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
            5 menit baca
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4">
            Panduan Lengkap Menghadapi Banjir
          </h1>
          <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
            Langkah praktis sebelum, selama, dan setelah banjir untuk melindungi keluarga & properti Anda.
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

          {/* Emergency Contacts */}
          <section className="rounded-2xl border border-[#20241f]/15 bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold text-[#20241f] flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-700" />
              Nomor Darurat Penting
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {contacts.map((c) => (
                <div key={c.label} className="flex items-center gap-3 p-3 rounded-xl bg-[#f8f7f4] border border-[#20241f]/10">
                  <c.icon className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <p className="font-medium text-[#20241f] text-sm">{c.label}</p>
                    <p className="text-xs text-[#20241f]/50 font-mono">{c.number}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-2xl bg-emerald-900 text-white p-6 sm:p-8 text-center">
            <h3 className="text-xl font-bold mb-2">Lapor Kerusakan Pasca Banjir</h3>
            <p className="text-emerald-100 mb-4 max-w-md mx-auto">
              Jalan rusak, saluran tersumbat, fasilitas umum roboh? Laporkan lewat LaporWarga agar ditindaklanjuti cepat.
            </p>
            <Link
              href="/report?category=flooding"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
            >
              Buat Laporan Sekarang
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#20241f]/10 bg-white py-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center text-xs text-[#20241f]/50">
          <p>© {new Date().getFullYear()} LaporWarga. Panduan berbasis regulasi BNPB & BPBD.</p>
          <p className="mt-1">Sumber: Modul Kesiapsiagaan Banjir BNPB, Pedoman Evakuasi BPBD.</p>
        </div>
      </footer>
    </div>
  );
}