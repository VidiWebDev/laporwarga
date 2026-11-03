"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  ClipboardList,
  User,
  MapPin,
  Plus,
} from "lucide-react";

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

export default function AdminField() {
  const [supabase, setSupabase] = useState<any>(null);
  const [fieldOfficers, setFieldOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const sb = createClient();
    setSupabase(sb);

    Promise.all([
      sb.from("users").select("*").eq("role", "field"),
      sb.from("reports").select("*").order("created_at", { ascending: false }).limit(100),
    ]).then(([f, r]: any[]) => {
      setFieldOfficers(f.data || []);
      setReports(r.data || []);
      setLoading(false);
    });
  }, []);

  const getOfficerReports = (officerId: string) => {
    return reports.filter((r) => r.status === "in_progress" || r.status === "verification");
  };

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
            PETUGAS LAPANGAN
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#20241f]">
            Tim Lapangan
          </h1>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white bg-emerald-900 hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-800/30">
          <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
          Tambah Petugas
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#20241f]/15 bg-white p-5">
          <div className="text-xs text-[#20241f]/50">TOTAL PETUGAS</div>
          <div className="text-2xl font-bold text-[#20241f] mt-2">{fieldOfficers.length}</div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-white p-5">
          <div className="text-xs text-amber-600">MENUNGGAR VERIFIKASI</div>
          <div className="text-2xl font-bold text-amber-600 mt-2">
            {reports.filter((r) => r.status === "verification").length}
          </div>
        </div>
        <div className="rounded-xl border border-blue-200 bg-white p-5">
          <div className="text-xs text-blue-600">DALAM PENANGANAN</div>
          <div className="text-2xl font-bold text-blue-600 mt-2">
            {reports.filter((r) => r.status === "in_progress").length}
          </div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-white p-5">
          <div className="text-xs text-emerald-600">SELESAI</div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">
            {reports.filter((r) => r.status === "resolved").length}
          </div>
        </div>
      </div>

      {/* Field Officers Grid */}
      <div className="space-y-4">
        <div className="text-xs text-[#20241f]/50 uppercase tracking-wider">Daftar Petugas</div>

        {fieldOfficers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#20241f]/30 p-8 text-center">
            <ClipboardList className="w-8 h-8 text-[#20241f]/50 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[#20241f]">Belum Ada Petugas</h3>
            <p className="text-xs text-[#20241f]/60 mt-1">Tambah petugas lapangan untuk menangani laporan.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fieldOfficers.map((officer) => {
              const officerReports = getOfficerReports(officer.id);
              return (
                <div key={officer.id} className="rounded-xl border border-[#20241f]/15 bg-white p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f8f7f4] border border-[#20241f]/15 flex items-center justify-center">
                      <User className="w-5 h-5 text-[#20241f]/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[#20241f] text-sm truncate">{officer.full_name || "Tanpa Nama"}</div>
                      <div className="text-[10px] text-[#20241f]/60 truncate">{officer.email}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full border text-[10px] font-medium text-blue-600 bg-blue-50 border-blue-200">
                      Petugas
                    </span>
                  </div>
                  <div className="pt-3 border-t border-[#20241f]/15 flex items-center justify-between text-xs text-[#20241f]/50">
                    <span className="flex items-center gap-1">
                      <ClipboardList className="w-3 h-3" />
                      Tugas Aktif: {officerReports.length}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {new Date(officer.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Assignments */}
      <div className="space-y-4">
        <div className="text-xs text-[#20241f]/50 uppercase tracking-wider">Tugas Aktif</div>

        {reports.filter((r) => r.status === "in_progress" || r.status === "verification").length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#20241f]/30 p-8 text-center">
            <ClipboardList className="w-8 h-8 text-[#20241f]/50 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[#20241f]">Tidak Ada Tugas Aktif</h3>
            <p className="text-xs text-[#20241f]/60 mt-1">Semua laporan sedang ditangani atau belum ada yang perlu verifikasi.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-[#20241f]/15 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#20241f]/10 bg-[#f8f7f4] text-[#20241f]/50 uppercase tracking-wider">
                    <th className="px-5 py-3 font-medium">Laporan</th>
                    <th className="px-5 py-3 font-medium">Kategori</th>
                    <th className="px-5 py-3 font-medium">Urgensi</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#20241f]/10">
                  {reports.filter((r) => r.status === "in_progress" || r.status === "verification").map((report) => {
                    const status = statusMap[report.status] || statusMap.submitted;
                    return (
                      <tr key={report.id} className="hover:bg-[#f8f7f4] transition-colors">
                        <td className="px-5 py-3.5 font-medium text-[#20241f]">{report.title}</td>
                        <td className="px-5 py-3.5 text-[#20241f]/50">{categoryMap[report.category] || report.category}</td>
                        <td className="px-5 py-3.5">
                          <span className={report.urgency === "high" ? "text-red-600" : report.urgency === "medium" ? "text-amber-600" : "text-emerald-600"}>
                            {report.urgency}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${status.badgeClass}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-[#20241f]/50">
                          {new Date(report.created_at).toLocaleDateString("id-ID")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}