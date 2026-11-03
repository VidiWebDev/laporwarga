"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Plus, Filter, MapPin, Calendar, AlertCircle } from "lucide-react";

const statusMap: Record<string, { label: string; badgeClass: string }> = {
  submitted: { label: "Diajukan", badgeClass: "text-[#20241f]/60 bg-[#f8f7f4] border-[#20241f]/15" },
  verification: { label: "Verifikasi", badgeClass: "text-amber-600 bg-amber-50 border-amber-200" },
  in_progress: { label: "Proses", badgeClass: "text-blue-600 bg-blue-50 border-blue-200" },
  resolved: { label: "Selesai", badgeClass: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  rejected: { label: "Ditolak", badgeClass: "text-red-600 bg-red-50 border-red-200" },
};

const categoryMap: Record<string, string> = {
  road_damage: "Jalan Rusak",
  garbage: "Sampah Liar",
  flooding: "Banjir",
  lighting: "Lampu Jalan",
  drainage: "Saluran Tersumbat",
  environment: "Fasilitas Umum",
  other: "Lainnya",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const sb = createClient();
    sb.from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!error) setReports(data || []);
        setLoading(false);
      });
  }, []);

  const filteredReports = activeFilter === "all"
    ? reports
    : reports.filter((r) => r.status === activeFilter);

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#20241f] selection:bg-indigo-600">
      {/* Header */}
      <div className="border-b border-[#20241f]/15 bg-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-xs text-[#20241f]/50 uppercase tracking-wider mb-1">
                Laporan Terbuka
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#20241f]">
                Log Laporan Masyarakat
              </h1>
              <p className="text-xs sm:text-sm text-[#20241f]/60 mt-1">
                Daftar lengkap keluhan infrastruktur publik terkini di lingkungan warga.
              </p>
            </div>
            <Link
              href="/report"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white bg-orange-500 hover:bg-[#fd7e14] transition-colors shadow-lg shadow-orange-500/30 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              Buat Laporan Baru
            </Link>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 scrollbar-none">
            <Filter className="w-3.5 h-3.5 text-[#20241f]/50 shrink-0 mr-1" />
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs transition-colors shrink-0 ${
                activeFilter === "all"
                  ? "text-white bg-emerald-900"
                  : "text-[#20241f]/70 border border-[#20241f]/15 bg-white hover:text-emerald-900 hover:bg-[#f8f7f4]"
              }`}
            >
              Semua ({reports.length})
            </button>
            {Object.entries(statusMap).map(([key, val]) => {
              const count = reports.filter((r) => r.status === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-colors shrink-0 ${
                    activeFilter === key
                      ? "text-white bg-emerald-900"
                      : "text-[#20241f]/70 border border-[#20241f]/15 bg-white hover:text-emerald-900 hover:bg-[#f8f7f4]"
                  }`}
                >
                  {val.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-xs text-[#20241f]/50">
            <div className="w-5 h-5 border-2 border-[#20241f]/15 border-t-emerald-700 rounded-full animate-spin mb-3" />
            MEMUAT DATA...
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="border border-dashed border-[#20241f]/30 rounded-xl p-12 text-center my-8">
            <AlertCircle className="w-8 h-8 text-[#20241f]/50 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[#20241f]">Tidak Ada Laporan</h3>
            <p className="text-xs text-[#20241f]/60 mt-1 max-w-sm mx-auto">
              Belum ada data laporan untuk filter ini. Silakan pilih status lain atau buat laporan baru.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => {
              const status = statusMap[report.status] || statusMap.submitted;
              const catLabel = categoryMap[report.category] || report.category;

              return (
                <div
                  key={report.id}
                  className="group rounded-xl border border-[#20241f]/15 bg-[#f8f7f4] hover:border-emerald-700/40 transition-all duration-200 p-5 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Status badge & Time */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${status.badgeClass}`}>
                        {status.label}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-[#20241f]/50">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: id })}
                      </span>
                    </div>

                    {/* Image if available */}
                    {report.image_url && (
                      <div className="mb-3.5 h-36 w-full overflow-hidden rounded-lg border border-[#20241f]/15 bg-[#20241f]/10">
                        <img
                          src={report.image_url}
                          alt={report.title}
                          className="h-full w-full object-cover transition-all duration-300"
                        />
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-semibold text-[#20241f] text-sm tracking-tight mb-2 line-clamp-2">
                      {report.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#20241f]/60 line-clamp-3 leading-relaxed mb-4">
                      {report.description}
                    </p>
                  </div>

                  {/* Footer metadata */}
                  <div className="pt-3 border-t border-[#20241f]/15 flex items-center justify-between text-[10px] text-[#20241f]/50">
                    <span className="px-2 py-0.5 rounded-full bg-[#20241f]/10 border border-[#20241f]/15 text-[#20241f]/70">
                      {catLabel}
                    </span>
                    <span className="text-[#20241f]/50">
                      Urgensi: <span className={report.urgency === "high" ? "text-red-600" : report.urgency === "medium" ? "text-amber-600" : "text-emerald-600"}>
                        {report.urgency}
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}