"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  FileText,
  Search,
  Trash2,
  Eye,
  AlertCircle,
} from "lucide-react";

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

export default function AdminReports() {
  const [supabase, setSupabase] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const sb = createClient();
    setSupabase(sb);
    sb.from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data, error }) => {
        if (!error) setReports(data || []);
        setLoading(false);
      });
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    if (!supabase) return;
    await supabase.from("reports").update({ status }).eq("id", id);
    setReports(reports.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm("Yakin hapus laporan ini?")) return;
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (error) {
      alert("Gagal hapus: " + error.message);
    } else {
      setReports(reports.filter(r => r.id !== id));
    }
  };

  const filtered = reports
    .filter((r) => filter === "all" || r.status === filter)
    .filter((r) => !search || r.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-[#20241f]/50">
        <div className="w-5 h-5 border-2 border-[#20241f]/15 border-t-emerald-700 rounded-full animate-spin mr-3" />
        MEMUAT...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-[#20241f]/50 uppercase tracking-wider mb-1">
            KELOLA LAPORAN
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#20241f]">
            Kelola Semua Laporan
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#20241f]/40 stroke-[1.5]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari laporan..."
              className="pl-8 pr-3 py-2 rounded-lg bg-white border border-[#20241f]/15 text-[#20241f] placeholder:text-[#20241f]/40 focus:outline-none focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 transition-colors w-full sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs transition-colors shrink-0 ${
            filter === "all"
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
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-xs transition-colors shrink-0 ${
                filter === key
                  ? "text-white bg-emerald-900"
                  : "text-[#20241f]/70 border border-[#20241f]/15 bg-white hover:text-emerald-900 hover:bg-[#f8f7f4]"
              }`}
            >
              {val.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Reports table */}
      <div className="rounded-xl border border-[#20241f]/15 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#20241f]/10 bg-[#f8f7f4] text-[#20241f]/50 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Laporan</th>
                <th className="px-5 py-3 font-medium">Kategori</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Urgensi</th>
                <th className="px-5 py-3 font-medium">Waktu</th>
                <th className="px-5 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20241f]/10">
              {filtered.map((report) => {
                const status = statusMap[report.status] || statusMap.submitted;
                const catLabel = categoryMap[report.category] || report.category;
                return (
                  <tr key={report.id} className="hover:bg-[#f8f7f4] transition-colors">
                    <td className="px-5 py-3.5 font-medium text-[#20241f] truncate">{report.title}</td>
                    <td className="px-5 py-3.5 text-[#20241f]/60">{catLabel}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${status.badgeClass}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[#20241f]/50">
                      {report.urgency}
                    </td>
                    <td className="px-5 py-3.5 text-[#20241f]/50">
                      {new Date(report.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/reports/${report.id}`}
                          className="p-1.5 text-[#20241f]/50 hover:text-emerald-900 transition-colors" title="Detail">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="p-1.5 text-[#20241f]/50 hover:text-red-600 hover:bg-red-50 transition-colors" title="Hapus">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-[#20241f]/50">
                    TIDAK ADA LAPORAN.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}