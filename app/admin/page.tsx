"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Users,
  ClipboardList,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trash2,
  Eye,
} from "lucide-react";
import Link from "next/link";

export default function AdminOverview() {
  const [supabase, setSupabase] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [fieldOfficers, setFieldOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = createClient();
    setSupabase(sb);
    Promise.all([
      sb.from("reports").select("*").order("created_at", { ascending: false }).limit(50),
      sb.from("users").select("*"),
      sb.from("users").select("*").eq("role", "field"),
    ]).then(([r, u, f]: any[]) => {
      setReports(r.data || []);
      setUsers(u.data || []);
      setFieldOfficers(f.data || []);
      setLoading(false);
    });
  }, []);

  const totalReports = reports.length;
  const pending = reports.filter((r) => r.status === "submitted" || r.status === "verification").length;
  const inProgress = reports.filter((r) => r.status === "in_progress").length;
  const resolved = reports.filter((r) => r.status === "resolved").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-xs text-[#20241f]/50">
        <div className="w-5 h-5 border-2 border-[#20241f]/15 border-t-emerald-700 rounded-full animate-spin mr-3" />
        MEMUAT...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-[#20241f]/15 bg-white p-5">
          <div className="text-xs text-[#20241f]/50 mb-2">TOTAL LAPORAN</div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#20241f]/50" />
            <span className="text-2xl font-bold text-[#20241f]">{totalReports}</span>
          </div>
        </div>
        <div className="rounded-xl border border-amber-200 bg-white p-5">
          <div className="text-xs text-amber-600 mb-2">MENUNGGU</div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <span className="text-2xl font-bold text-amber-600">{pending}</span>
          </div>
        </div>
        <div className="rounded-xl border border-blue-200 bg-white p-5">
          <div className="text-xs text-blue-600 mb-2">DIPROSES</div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-500" />
            <span className="text-2xl font-bold text-blue-600">{inProgress}</span>
          </div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-white p-5">
          <div className="text-xs text-emerald-600 mb-2">SELESAI</div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span className="text-2xl font-bold text-emerald-600">{resolved}</span>
          </div>
        </div>
      </div>

      {/* User & Officer Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[#20241f]/15 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-[#20241f]/50 uppercase tracking-wider">Total User</div>
            <Link href="/admin/users" className="text-[10px] text-[#20241f]/80 hover:text-emerald-900 flex items-center gap-1">
              Lihat <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#20241f]/50" />
            <span className="text-2xl font-bold text-[#20241f]">{users.length}</span>
          </div>
        </div>
        <div className="rounded-xl border border-[#20241f]/15 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-[#20241f]/50 uppercase tracking-wider">Petugas Lapangan</div>
            <Link href="/admin/field" className="text-[10px] text-[#20241f]/80 hover:text-emerald-900 flex items-center gap-1">
              Kelola <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-[#20241f]/50" />
            <span className="text-2xl font-bold text-[#20241f]">{fieldOfficers.length}</span>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="rounded-xl border border-[#20241f]/15 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#20241f]/15 flex items-center justify-between">
          <span className="text-xs text-[#20241f]/50 uppercase tracking-wider">Laporan Terbaru</span>
          <Link href="/admin/reports" className="text-[10px] text-[#20241f]/80 hover:text-emerald-900 flex items-center gap-1">
            Semua <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-[#20241f]/10">
          {reports.slice(0, 5).map((r) => (
            <div key={r.id} className="px-5 py-3 flex items-center gap-4 hover:bg-[#f8f7f4] transition-colors">
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-[#20241f] truncate">{r.title}</div>
                <div className="text-[10px] text-[#20241f]/50 mt-1">
                  {new Date(r.created_at).toLocaleDateString("id-ID")} &middot; {r.urgency}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${
                  r.status === "resolved"
                    ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                    : r.status === "in_progress"
                    ? "text-blue-600 bg-blue-50 border-blue-200"
                    : r.status === "rejected"
                    ? "text-red-600 bg-red-50 border-red-200"
                    : "text-[#20241f]/60 bg-[#f8f7f4] border-[#20241f]/15"
                }`}>
                  {r.status}
                </span>
                <Link href={`/admin/reports`} className="p-1 text-[#20241f]/50 hover:text-emerald-900 transition-colors" title="Detail">
                  <Eye className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
          {reports.length === 0 && (
            <div className="px-5 py-8 text-center text-xs text-[#20241f]/50">
              TIDAK ADA LAPORAN.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}