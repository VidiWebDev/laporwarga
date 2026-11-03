"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ShieldCheck,
  MapPin,
  Search,
  Bell,
  Zap,
  Lock,
  BarChart3,
  Headphones,
  ArrowRight,
  Calendar,
  Filter,
  ChevronDown,
  Menu,
  X,
  Users,
  Clock,
} from "lucide-react";

const navLinks = [
  { name: "Beranda", href: "/" },
  { name: "Laporan", href: "/reports" },
  { name: "Statistik", href: "/reports" },
  { name: "Panduan", href: "#panduan" },
  { name: "Tentang Kami", href: "#tentang" },
];

const pillars = [
  { icon: Zap, title: "Respon Cepat", desc: "Laporan diteruskan ke petugas di hari yang sama." },
  { icon: Lock, title: "Aman & Rahasia", desc: "Identitas pelapor dilindungi, lokasi tetap presisi." },
  { icon: BarChart3, title: "Transparan", desc: "Setiap perubahan status bisa dipantau publik." },
  { icon: Headphones, title: "24/7 Siaga", desc: "Tim pendamping siap membantu kapan pun." },
];

const reports = [
  {
    image: "/foto/laporan-banjir.jpg",
    alt: "Banjir meluap di perairan sungai, air menenggelami jalan perumahan.",
    badge: "Darurat",
    badgeClass: "bg-red-100 text-red-700",
    title: "Banjir Luapan Sungai",
    sub: "Kelurahan Maju Jaya",
    time: "Baru saja",
  },
  {
    image: "/foto/laporan-jalan-rusak.jpg",
    alt: "Badan jalan berlubang besar dengan genangan air di dalamnya.",
    badge: "Proses",
    badgeClass: "bg-amber-100 text-amber-700",
    title: "Jalan Utama Rusak Parah",
    sub: "Kecamatan Sumber",
    time: "1 hari lalu",
  },
  {
    image: "/foto/laporan-pohon-tumbang.jpg",
    alt: "Pohon besar tumbang menutup seluruh jalur utama setelah hujan deras.",
    badge: "Darurat",
    badgeClass: "bg-red-100 text-red-700",
    title: "Pohon Tumbang Jalur Utama",
    sub: "Jl. Merdeka",
    time: "2 jam lalu",
  },
  {
    image: "/foto/laporan-sampah.jpg",
    alt: "Tumpukan sampah rumah tangga di pinggir jalan yang belum diangkut petugas.",
    badge: "Selesai",
    badgeClass: "bg-emerald-100 text-emerald-700",
    title: "Sampah Menumpuk Liar",
    sub: "Desa Suka Damai",
    time: "3 hari lalu",
  },
];

const categories = [
  "All",
  "Bencana Alam",
  "Infrastruktur",
  "Layanan Publik",
  "Kesehatan",
  "Keamanan",
  "Lingkungan",
];

const articles = [
  {
    image: "/foto/panduan-banjir.jpg",
    alt: "Banjir meluap di jalan raya, petugas siaga siap mengantarkan bantuan.",
    title: "Panduan Menghadapi Banjir",
    read: "5 min read",
    href: "/panduan/menghadapi-banjir",
  },
  {
    image: "/foto/panduan-jalan-rusak.jpg",
    alt: "Petugas pemadam jalan memperbaiki lubang aspal di jalan utama.",
    title: "Cara Melaporkan Jalan Rusak ke Pemerintah",
    read: "4 min read",
    href: "/panduan/melapor-jalan-rusak",
  },
];

const stats = [
  { value: "10K+", label: "Laporan Selesai" },
  { value: "5K+", label: "Warga Aktif" },
  { value: "4.8/5", label: "Kepuasan Warga" },
  { value: "24/7", label: "Pendampingan" },
];

export default function HomePage() {
  return (
    <div className="bg-[#f8f7f4] text-[#20241f]">
      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20 lg:px-8">
            <div className="relative z-10 grid max-w-5xl gap-12 lg:grid-cols-[1fr_480px] lg:gap-16">
              <div className="lg:col-span-1 relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  Suara Warga untuk Perubahan
                </span>

                <h1 className="mt-6 text-4xl font-bold leading-[1.12] tracking-tight text-[#20241f] sm:text-5xl lg:text-[3.4rem]">
                  Bersama Membangun Desa. Laporkan Masalah di Sekitarmu.
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#20241f]/75">
                  Sampaikan keluhan, kerusakan fasilitas umum, atau bencana alam di lingkunganmu
                  secara cepat, aman, dan transparan.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/report"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 font-medium text-white shadow-lg shadow-orange-500/30 transition-colors hover:bg-orange-600"
                  >
                    Buat Laporan
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/reports"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-[#20241f]/15 px-6 font-medium text-[#20241f] transition-colors hover:border-[#20241f]/30 hover:bg-white"
                  >
                    Lihat laporan publik
                  </Link>
                </div>
              </div>

              <div className="relative group lg:col-span-1">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-700/30 to-orange-500/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-1000" aria-hidden="true" />
                <svg
                  className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 text-emerald-700/10"
                  viewBox="0 0 200 200"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M10 120c40-50 90-70 180-70" stroke="currentColor" strokeWidth="2" />
                  <path d="M10 145c40-50 90-70 180-70" stroke="currentColor" strokeWidth="2" />
                  <path d="M10 170c40-50 90-70 180-70" stroke="currentColor" strokeWidth="2" />
                </svg>
                <Image
                  src="/foto/hero-warga.jpg"
                  width={1200}
                  height={900}
                  priority
                  alt="Warga bergotong royong menangani kerusakan fasilitas umum di lingkungannya."
                  className="relative rounded-3xl object-cover shadow-2xl shadow-[#20241f]/15"
                />
              </div>
            </div>
          </div>

          {/* Floating filter card overlapping hero */}
          <div className="relative z-20 mx-auto -mt-14 max-w-6xl px-4 sm:px-6 lg:px-8">
            <form
              action="/reports"
              method="get"
              className="relative z-10 rounded-3xl border border-[#20241f]/8 bg-white p-4 shadow-2xl shadow-[#20241f]/10 sm:p-5"
            >
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1.1fr_1.2fr_1fr_1fr_auto]">
                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-[#20241f]/60">
                    Kategori Laporan
                  </span>
                  <select
                    name="kategori"
                    defaultValue=""
                    className="h-11 w-full rounded-xl border border-[#20241f]/15 bg-white px-3 text-sm text-[#20241f] focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="">Semua kategori</option>
                    <option value="bencana">Bencana</option>
                    <option value="jalan-rusak">Jalan Rusak</option>
                    <option value="sampah">Sampah</option>
                    <option value="fasilitas">Fasilitas Umum</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-[#20241f]/60">
                    Lokasi / Wilayah
                  </span>
                  <span className="relative block">
                    <MapPin
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#20241f]/40"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      name="lokasi"
                      placeholder="Kelurahan, kecamatan, atau jalan"
                      className="h-11 w-full rounded-xl border border-[#20241f]/15 bg-white pl-9 pr-3 text-sm text-[#20241f] placeholder:text-[#20241f]/40 focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-[#20241f]/60">
                    Tanggal Kejadian
                  </span>
                  <span className="relative block">
                    <Calendar
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#20241f]/40"
                      aria-hidden="true"
                    />
                    <input
                      type="date"
                      name="tanggal"
                      className="h-11 w-full rounded-xl border border-[#20241f]/15 bg-white pl-9 pr-3 text-sm text-[#20241f] focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                    />
                  </span>
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-medium text-[#20241f]/60">
                    Status Laporan
                  </span>
                  <select
                    name="status"
                    defaultValue=""
                    className="h-11 w-full rounded-xl border border-[#20241f]/15 bg-white px-3 text-sm text-[#20241f] focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  >
                    <option value="">All</option>
                    <option value="submitted">Diajukan</option>
                    <option value="in_progress">Proses</option>
                    <option value="resolved">Selesai</option>
                  </select>
                </label>

                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-900 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 md:col-span-2 lg:col-span-1"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Cari Laporan
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ── Four pillars ─────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <li key={p.title} className="rounded-2xl border border-[#20241f]/5 bg-white p-5 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                  <p.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 font-semibold text-[#20241f]">{p.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-[#20241f]/60">{p.desc}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Recent reports ───────────────────────────────── */}
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[#20241f] sm:text-3xl">
                  Laporan Terkini
                </h2>
                <p className="mt-2 text-[#20241f]/60">
                  Laporan terbaru dari warga, lengkap dengan status penanganannya.
                </p>
              </div>
              <Link
                href="/reports"
                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 transition-colors hover:text-emerald-950"
              >
                Lihat Semua Laporan
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {reports.map((r) => (
                <article
                  key={r.title}
                  className="overflow-hidden rounded-2xl border border-[#20241f]/5 bg-[#f8f7f4] shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="relative">
                    <Image
                      src={r.image}
                      width={800}
                      height={600}
                      alt={r.alt}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <span
                      className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${r.badgeClass}`}
                    >
                      {r.badge}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold leading-snug text-[#20241f] group-hover:text-emerald-900">
                      {r.title}
                    </h3>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-[#20241f]/60">
                      <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{r.sub}</span>
                      <span aria-hidden="true">•</span>
                      <span className="shrink-0">{r.time}</span>
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {categories.map((c, i) => (
                <Link
                  key={c}
                  href={i === 0 ? "/reports" : `/reports?kategori=${encodeURIComponent(c)}`}
                  className={`rounded-full px-4 py-2 text-sm transition-colors ${
                    i === 0
                      ? "bg-emerald-900 font-medium text-white"
                      : "border border-[#20241f]/10 bg-white text-[#20241f]/70 hover:border-emerald-700/40 hover:text-emerald-900"
                  }`}
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── News & guides ────────────────────────────────── */}
        <section id="panduan" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[#20241f] sm:text-3xl">
                Kabar &amp; Panduan Warga
              </h2>
              <p className="mt-2 max-w-xl text-[#20241f]/60">
                Langkah praktis saat bencana dan cara memastikan laporanmu ditindaklanjuti.
              </p>
            </div>
            <Link
              href="/reports"
              className="inline-flex items-center gap-2 rounded-xl border border-[#20241f]/15 px-4 py-2.5 text-sm font-medium text-[#20241f] transition-colors hover:border-emerald-700/40 hover:text-emerald-900"
            >
              Baca Semua Artikel
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {articles.map((a) => (
              <Link
                key={a.title}
                href={a.href}
                className="group overflow-hidden rounded-3xl border border-[#20241f]/5 bg-white shadow-sm transition-shadow hover:shadow-lg"
              >
                <Image
                  src={a.image}
                  width={1200}
                  height={800}
                  alt={a.alt}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover"
                />
                <div className="p-6">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {a.read}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold leading-snug text-[#20241f] group-hover:text-emerald-900">
                    {a.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-800">
                    Baca panduan
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CTA banner ───────────────────────────────────── */}
        <section id="tentang" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-emerald-900 px-6 py-12 text-white sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange-500/20" aria-hidden="true" />
            <div className="pointer-events-none absolute -bottom-24 right-40 h-40 w-40 rounded-full bg-orange-400/10" aria-hidden="true" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-orange-200">
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                  Gerakan warga, bukan sekadar aplikasi
                </span>
                <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                  Laporanmu Sangat Berarti untuk Lingkungan Kita
                </h2>
                <p className="mt-4 max-w-xl leading-relaxed text-emerald-50/80">
                  Setiap laporan yang kamu kirimkan akan langsung diteruskan ke pihak berwenang
                  untuk segera ditindaklanjuti.
                </p>
                <Link
                  href="/report"
                  className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 font-medium text-white transition-colors hover:bg-orange-600 shadow-lg shadow-orange-500/30"
                >
                  Mulai Melapor Sekarang
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>

              <Image
                src="/foto/panduan-jalan-rusak.jpg"
                width={1200}
                height={800}
                alt="Petugas memperbaiki jalan rusak hasil laporan warga."
                loading="lazy"
                className="hidden aspect-[4/3] w-full rounded-2xl object-cover ring-4 ring-orange-500/30 lg:block"
              />
            </div>
          </div>
        </section>

        {/* ── Impact stats ─────────────────────────────────── */}
        <section className="border-y border-[#20241f]/5 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center sm:text-left">
                <p className="text-4xl font-bold tracking-tight text-emerald-900">{s.value}</p>
                <p className="mt-1 text-sm text-[#20241f]/60">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="bg-emerald-950 text-emerald-50/70">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 text-white">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500">
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-lg font-semibold tracking-tight">LaporWarga</span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed">
                Platform pelaporan infrastruktur dan bencana berbasis warga. Cepat, aman, dan
                transparan untuk lingkungan yang lebih baik.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <a href="https://facebook.com" aria-label="Facebook LaporWarga" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-orange-500">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.25-1.5 1.55-1.5h1.65V4.6c-.8-.1-1.6-.15-2.4-.15-2.4 0-4.05 1.45-4.05 4.1v2.35H7.5V14h2.75v8h3.25Z"/></svg>
                </a>
                <a href="https://instagram.com" aria-label="Instagram LaporWarga" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-orange-500">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path d="M12 2.2c-2.7 0-3 0-4.05.06-1.05.05-1.77.22-2.4.47a4.8 4.8 0 0 0-1.75 1.14A4.8 4.8 0 0 0 2.66 5.6c-.25.63-.42 1.35-.47 2.4C2.13 9.05 2.12 9.38 2.12 12s0 2.95.07 4c.05 1.05.22 1.77.47 2.4a4.8 4.8 0 0 0 1.14 1.75 4.8 4.8 0 0 0 1.75 1.14c.63.25 1.35.42 2.4.47 1.05.06 1.35.06 4.05.06s3 0 4.05-.06c1.05-.05 1.77-.22 2.4-.47a5 5 0 0 0 2.89-2.89c.25-.63.42-1.35.47-2.4.06-1.05.06-1.38.06-4s0-2.95-.06-4c-.05-1.05-.22-1.77-.47-2.4a4.8 4.8 0 0 0-1.14-1.75 4.8 4.8 0 0 0-1.75-1.14c-.63-.25-1.35-.42-2.4-.47C15 2.2 14.7 2.2 12 2.2Zm0 1.8c2.67 0 2.99.01 4.04.06.98.04 1.5.2 1.86.34.47.18.8.4 1.15.74.34.35.56.68.74 1.15.14.35.3.88.34 1.86.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.04.98-.2 1.5-.34 1.86-.18.47-.4.8-.74 1.15-.35.34-.68.56-1.15.74-.35.14-.88.3-1.86.34-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-.98-.04-1.5-.2-1.86-.34a3.1 3.1 0 0 1-1.15-.74 3.1 3.1 0 0 1-.74-1.15c-.14-.35-.3-.88-.34-1.86-.05-1.05-.06-1.37-.06-4.04s.01-2.99.06-4.04c.04-.98.2-1.5.34-1.86.18-.47.4-.8.74-1.15.35-.34.68-.56 1.15-.74.35-.14.88-.3 1.86-.34C9.01 4.01 9.33 4 12 4Zm0 3.1a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8Zm0 8.08a3.18 3.18 0 1 1 0-6.36 3.18 3.18 0 0 1 0 6.36Zm6.24-8.28a1.14 1.14 0 1 1-2.28 0 1.14 1.14 0 0 1 2.28 0Z"/></svg>
                </a>
                <a href="https://youtube.com" aria-label="YouTube LaporWarga" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-orange-500">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.75-1.77C18.25 5 12 5 12 5s-6.25 0-7.85.43A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.75 1.77C5.75 19 12 19 12 19s6.25 0 7.85-.43a2.5 2.5 0 0 0 1.75-1.77C22 15.2 22 12 22 12s0-3.2-.4-4.8ZM10 15.2V8.8l5.2 3.2-5.2 3.2Z"/></svg>
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Tautan Cepat</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {["Tentang Kami", "Hubungi Kami", "Karir"].map((t) => (
                  <li key={t}>
                    <Link href={`#${t.toLowerCase().replace(" ", "-")}`} className="transition-colors hover:text-white">
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Bantuan</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {["Pusat Bantuan", "FAQ", "Privasi"].map((t) => (
                  <li key={t}>
                    <Link href={`#${t.toLowerCase().replace(" ", "-")}`} className="transition-colors hover:text-white">
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Kategori</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {["Bencana", "Jalan", "Fasilitas", "Sampah"].map((t) => (
                  <li key={t}>
                    <Link href={`/reports?kategori=${t.toLowerCase()}`} className="transition-colors hover:text-white">
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-12 rounded-3xl border border-white/10 bg-[#10302a]/50 p-6 sm:p-8 lg:p-10">
            <h2 className="text-lg font-bold text-white sm:text-xl">Berlangganan Buletin Warga</h2>
            <p className="mt-2 text-emerald-50/70 max-w-md sm:max-w-lg">
              Dapatkan informasi terbaru dan panduan pengamanan langsung ke kotak masukmu.
            </p>
            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="alamat@email.com"
                className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
              <button className="rounded-xl bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600">
                Langganan
              </button>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-[11px] sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} LaporWarga. Hak Cipta Dilindungi.</p>
            <p>Foto: Wikimedia Commons, CC BY-SA. Bukan situs resmi pemerintah.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
