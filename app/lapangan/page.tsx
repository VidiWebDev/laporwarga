"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { MapPin, Camera, AlertTriangle, CheckCircle2, Clock, ArrowRight, MessageSquare, ExternalLink } from "lucide-react";

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

export default function FieldOfficerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    const sb = createClient();
    setSupabase(sb);
    sb.auth.getUser().then(({ data }: any) => {
      if (data?.user) {
        setUser(data.user);
        sb.from("reports")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100)
          .then(({ data: rows, error }) => {
            if (!error) setReports(rows || []);
            setLoading(false);
          });
      } else {
        setUser(null);
        setReports([]);
        setLoading(false);
      }
    }).catch(() => {
      setUser(null);
      setReports([]);
      setLoading(false);
    });
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f7f4] text-[#20241f] flex items-center justify-center p-4">
        <div className="max-w-sm w-full border border-[#20241f]/15 bg-white rounded-xl p-6 text-center space-y-4">
          <div className="w-10 h-10 rounded-xl bg-[#f8f7f4] border border-[#20241f]/15 flex items-center justify-center mx-auto text-[#20241f]/50">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#20241f]">Area Petugas Lapangan</h2>
            <p className="text-xs text-[#20241f]/60 mt-1">Hanya petugas terdaftar yang dapat mengakses.</p>
          </div>
          <Link href="/login" className="block w-full py-2 rounded-xl text-xs font-medium text-white bg-emerald-900 hover:bg-emerald-800 transition-colors">
            Masuk sebagai Petugas
          </Link>
        </div>
      </div>
    );
  }

  const pendingVerify = reports.filter((r) => r.status === "verification").length;
  const inProgress = reports.filter((r) => r.status === "in_progress").length;
  const resolved = reports.filter((r) => r.status === "resolved").length;
  const myAssigned = reports.filter((r) => r.status === "in_progress" || r.status === "verification").length;

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#20241f] selection:bg-indigo-600 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20241f]/15 pb-6">
          <div>
            <div className="text-xs text-[#20241f]/50 uppercase tracking-wider mb-1">
              FIELD OFFICER PANEL
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#20241f]">
              Dasbor Tim Lapangan
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#20241f]/50">
            <span className="px-2.5 py-1 rounded-full border border-[#20241f]/15 bg-white">{user.email}</span>
            <button
              onClick={() => supabase?.auth.signOut()}
              className="text-[#20241f]/50 hover:text-red-600 transition-colors"
            >
              [Keluar]
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-amber-200 bg-white p-5">
            <div className="text-xs text-amber-600">VERIFIKASI PENDING</div>
            <div className="text-2xl font-bold text-amber-600 mt-2">{pendingVerify}</div>
          </div>
          <div className="rounded-xl border border-blue-200 bg-white p-5">
            <div className="text-xs text-blue-600">DALAM PENANGANAN</div>
            <div className="text-2xl font-bold text-blue-600 mt-2">{inProgress}</div>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-white p-5">
            <div className="text-xs text-emerald-600">SELESAI</div>
            <div className="text-2xl font-bold text-emerald-600 mt-2">{resolved}</div>
          </div>
          <div className="rounded-xl border border-[#20241f]/15 bg-white p-5">
            <div className="text-xs text-[#20241f]/50">TUGASKU</div>
            <div className="text-2xl font-bold text-[#20241f] mt-2">{myAssigned}</div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="rounded-xl border border-[#20241f]/15 bg-white overflow-hidden">
          <div className="px-6 py-4 border-b border-[#20241f]/15 flex items-center justify-between">
            <span className="text-xs text-[#20241f]/50 uppercase tracking-wider">
              Antrean Tugas
            </span>
            <span className="text-xs text-[#20241f]/50">
              {reports.filter((r) => r.status === "verification" || r.status === "in_progress").length} Tugas Aktif
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#20241f]/10 bg-[#f8f7f4] text-[#20241f]/50 uppercase tracking-wider">
                  <th className="px-6 py-3 font-medium">Laporan</th>
                  <th className="px-6 py-3 font-medium">Kategori</th>
                  <th className="px-6 py-3 font-medium">Urgensi</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Lokasi</th>
                  <th className="px-6 py-3 font-medium">Waktu</th>
                  <th className="px-6 py-3 text-right font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#20241f]/10">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[#20241f]/50">
                      MEMUAT ANTREAN...
                    </td>
                  </tr>
                ) : reports.filter((r) => r.status === "verification" || r.status === "in_progress").length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-[#20241f]/50">
                      TIDAK ADA TUGAS AKTIF.
                    </td>
                  </tr>
                ) : (
                  reports
                    .filter((r) => r.status === "verification" || r.status === "in_progress")
                    .map((report) => {
                      const status = statusMap[report.status] || statusMap.submitted;
                      const catLabel = categoryMap[report.category] || report.category;

                      return (
                        <tr key={report.id} className="hover:bg-[#f8f7f4] transition-colors group">
                          <td className="px-6 py-3.5 font-medium text-[#20241f]">
                            <div className="truncate max-w-xs">{report.title}</div>
                          </td>
                          <td className="px-6 py-3.5 text-[#20241f]/50">
                            {catLabel}
                          </td>
                          <td className="px-6 py-3.5">
                            <span className={report.urgency === "high" ? "text-red-600" : report.urgency === "medium" ? "text-amber-600" : "text-emerald-600"}>
                              {report.urgency}
                            </span>
                          </td>
                          <td className="px-6 py-3.5">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${status.badgeClass}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-6 py-3.5 text-[#20241f]/50">
                            {report.latitude && report.longitude ? (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="font-mono">{report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}</span>
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-6 py-3.5 text-[#20241f]/50">
                            {new Date(report.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <Link
                              href={`/reports/${report.id}`}
                              className="inline-flex items-center gap-1 text-[#20241f]/80 hover:text-emerald-900 transition-colors"
                            >
                              <span>Detail</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}