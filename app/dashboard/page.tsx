"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Plus, Activity, CheckCircle2, AlertCircle, Clock, ArrowUpRight } from "lucide-react";

const categoryMap: Record<string, string> = {
  road_damage: "Jalan Rusak",
  garbage: "Sampah Liar",
  flooding: "Banjir",
  lighting: "Lampu Jalan",
  drainage: "Saluran Tersumbat",
  environment: "Fasilitas Umum",
  other: "Lainnya",
};

const statusMap: Record<string, { label: string; badgeClass: string }> = {
  submitted: { label: "Diajukan", badgeClass: "text-[#20241f]/60 bg-[#f8f7f4] border-[#20241f]/15" },
  verification: { label: "Verifikasi", badgeClass: "text-amber-600 bg-amber-50 border-amber-200" },
  in_progress: { label: "Proses", badgeClass: "text-blue-600 bg-blue-50 border-blue-200" },
  resolved: { label: "Selesai", badgeClass: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  rejected: { label: "Ditolak", badgeClass: "text-red-600 bg-red-50 border-red-200" },
};

export default function UserDashboard() {
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const sb = createClient();
    setSupabase(sb);
    sb.auth.getUser().then(({ data }: any) => setUser(data?.user)).catch(() => setUser(null));
    sb.from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data, error }) => {
        if (!error) setReports(data || []);
        setLoading(false);
      });
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] text-[#20241f] flex items-center justify-center p-4">
        <div className="max-w-sm w-full border border-[#20241f]/15 bg-white rounded-xl p-6 text-center space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#f8f7f4] border border-[#20241f]/15 flex items-center justify-center mx-auto text-[#20241f]/50">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#20241f]">Masuk diperlukan</h2>
            <p className="text-xs text-[#20241f]/60 mt-1">Silakan masuk untuk melihat dasbor laporan Anda.</p>
          </div>
          <Link href="/login" className="block w-full py-2 rounded-lg text-xs font-medium text-white bg-orange-500 hover:bg-[#fd7e14] transition-colors">
            Masuk ke LaporWarga
          </Link>
        </div>
      </div>
    );
  }

  const myReports = reports.filter((r) => r.user_id === user.id);
  const total = myReports.length;
  const pending = myReports.filter((r) => r.status === "submitted" || r.status === "verification").length;
  const inProgress = myReports.filter((r) => r.status === "in_progress").length;
  const resolved = myReports.filter((r) => r.status === "resolved").length;

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#20241f] selection:bg-indigo-600 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20241f]/15 pb-6">
          <div>
            <div className="text-xs text-[#20241f]/50 uppercase tracking-wider mb-1">
              USER DASHBOARD
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#20241f]">
              Dasbor Laporan Saya
            </h1>
          </div>
          <Link
            href="/report"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white bg-orange-500 hover:bg-[#fd7e14] transition-colors shadow-lg shadow-orange-500/30 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Buat Laporan Baru
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#20241f]/15 bg-white p-5">
            <div className="text-xs text-[#20241f]/50">TOTAL LAPORAN</div>
            <div className="text-2xl font-bold text-[#20241f] mt-2">{total}</div>
          </div>
          <div className="rounded-xl border border-amber-200 bg-white p-5">
            <div className="text-xs text-amber-600">MENUNGGU</div>
            <div className="text-2xl font-bold text-amber-600 mt-2">{pending}</div>
          </div>
          <div className="rounded-xl border border-blue-200 bg-white p-5">
            <div className="text-xs text-blue-600">DIPROSES</div>
            <div className="text-2xl font-bold text-blue-600 mt-2">{inProgress}</div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-5">
            <div className="text-xs text-emerald-600">SELESAI</div>
            <div className="text-2xl font-bold text-emerald-600 mt-2">{resolved}</div>
          </div>
        </div>

        {/* My Reports Grid */}
        <div className="rounded-xl border border-[#20241f]/15 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-[#20241f]/15 flex items-center justify-between">
            <span className="text-xs text-[#20241f]/50 uppercase tracking-wider">
              Laporan Saya
            </span>
            <span className="text-xs text-[#20241f]/50">
              {myReports.length} Entri
            </span>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-xs text-[#20241f]/50">
                <div className="w-5 h-5 border-2 border-[#20241f]/15 border-t-emerald-700 rounded-full animate-spin mb-3" />
                MEMUAT DATA...
              </div>
            ) : myReports.length === 0 ? (
              <div className="border border-dashed border-[#20241f]/30 rounded-xl p-12 text-center">
                <AlertCircle className="w-8 h-8 text-[#20241f]/50 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-[#20241f]">Belum Ada Laporan</h3>
                <p className="text-xs text-[#20241f]/60 mt-1 max-w-sm mx-auto">
                  Anda belum membuat laporan apapun. Mulai lapor infrastruktur publik di lingkungan Anda.
                </p>
                <Link
                  href="/report"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-xs font-medium text-white bg-orange-500 hover:bg-[#fd7e14] transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Buat Laporan Pertama
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {myReports.map((report) => {
                  const status = statusMap[report.status] || statusMap.submitted;
                  const catLabel = categoryMap[report.category] || report.category;

                  return (
                    <Link
                      key={report.id}
                      href={`/reports/${report.id}`}
                      className="group rounded-xl border border-[#20241f]/15 bg-white hover:border-emerald-700/40 transition-all duration-200 p-5 flex flex-col justify-between"
                    >
                      <div>
                        {/* Header: Status badge & Time */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${status.badgeClass}`}>
                            {status.label}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-[#20241f]/50">
                            <Clock className="w-3 h-3" />
                            {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: id })}
                          </span>
                        </div>

                        {/* Image if available */}
                        {report.image_url && (
                          <div className="mb-3.5 h-36 w-full overflow-hidden rounded-lg border border-[#20241f]/15 bg-[#f8f7f4]">
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
                        <span className="px-2 py-0.5 rounded-full bg-[#f8f7f4] border border-[#20241f]/15 text-[#20241f]/70">
                          {catLabel}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className={report.urgency === "high" ? "text-red-600" : report.urgency === "medium" ? "text-amber-600" : "text-emerald-600"}>
                            {report.urgency}
                          </span>
                          <ArrowUpRight className="w-3 h-3 text-[#20241f]/50 group-hover:text-[#20241f]/70 transition-colors" />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}