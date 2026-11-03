"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  MapPin,
  Calendar,
  Clock,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Camera,
  ChevronRight,
  User,
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
  submitted: { label: "Diajukan", badgeClass: "text-slate-500 bg-slate-50 border-slate-200" },
  verification: { label: "Verifikasi", badgeClass: "text-amber-600 bg-amber-50 border-amber-200" },
  in_progress: { label: "Proses", badgeClass: "text-blue-600 bg-blue-50 border-blue-200" },
  resolved: { label: "Selesai", badgeClass: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  rejected: { label: "Ditolak", badgeClass: "text-red-600 bg-red-50 border-red-200" },
};

const statusFlow = [
  { key: "submitted", label: "Diajukan" },
  { key: "verification", label: "Verifikasi" },
  { key: "in_progress", label: "Proses" },
  { key: "resolved", label: "Selesai" },
];

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;
    const sb = createClient();
    sb.from("reports")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setNotFound(true);
        } else {
          setReport(data);
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="text-xs text-slate-500 flex flex-col items-center gap-3">
          <div className="w-5 h-5 border-2 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
          MEMUAT LAPORAN...
        </div>
      </div>
    );
  }

  if (notFound || !report) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="max-w-sm w-full border border-slate-200 bg-white rounded-xl p-6 text-center space-y-4">
          <AlertTriangle className="w-8 h-8 text-slate-500 mx-auto stroke-[1.5]" />
          <h2 className="text-sm font-semibold text-slate-900">Laporan Tidak Ditemukan</h2>
          <p className="text-xs text-slate-500">ID laporan tidak valid atau telah dihapus.</p>
          <button
            onClick={() => router.push("/reports")}
            className="w-full py-2 rounded-lg text-xs font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            Kembali ke Daftar Laporan
          </button>
        </div>
      </div>
    );
  }

  const status = statusMap[report.status] || statusMap.submitted;
  const catLabel = categoryMap[report.category] || report.category;
  const currentStepIndex = statusFlow.findIndex((s) => s.key === report.status);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb / Back */}
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Daftar
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Badge + Title */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-2.5 py-1 rounded border text-xs font-medium ${status.badgeClass}`}>
                  {status.label}
                </span>
                <span className="font-mono text-xs text-slate-500">
                  #{report.id?.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mb-3">
                {report.title}
              </h1>
              <p className="text-xs text-slate-500">
                {categoryMap[report.category] || report.category} &middot; Urgensi:{" "}
                <span className={report.urgency === "high" ? "text-red-600" : report.urgency === "medium" ? "text-amber-600" : "text-emerald-600"}>
                  {report.urgency}
                </span>
                {" "} &middot; {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: localeId })}
              </p>
            </div>

            {/* Image */}
            {report.image_url && (
              <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <img
                  src={report.image_url}
                  alt={report.title}
                  className="w-full h-auto object-cover max-h-[400px]"
                />
                <div className="px-4 py-2.5 border-t border-slate-200 text-[10px] text-slate-500 flex items-center gap-2">
                  <Camera className="w-3 h-3" />
                  Bukti Foto
                </div>
              </div>
            )}

            {/* Description */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                Deskripsi
              </h2>
              <p className="text-sm text-slate-900 leading-relaxed whitespace-pre-line">
                {report.description}
              </p>
            </div>

            {/* Address Note */}
            {report.address_note && (
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <h2 className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                  Catatan Lokasi
                </h2>
                <p className="text-sm text-slate-900">{report.address_note}</p>
              </div>
            )}

            {/* GPS Coordinates */}
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                Koordinat GPS
              </h2>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                  <MapPin className="w-4 h-4 stroke-[1.5]" />
                </div>
                <span className="font-mono text-xs text-slate-900">
                  {report.latitude?.toFixed(6) || "—"}, {report.longitude?.toFixed(6) || "—"}
                </span>
                <a
                  href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-xs text-slate-900 hover:text-slate-900 transition-colors flex items-center gap-1"
                >
                  Buka di Maps
                  <ChevronRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Progress Timeline */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4">
                Status Kemajuan
              </h3>
              <div className="space-y-3">
                {statusFlow.map((step, index) => {
                  const isDone = index < currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const isRejected = report.status === "rejected";

                  return (
                    <div key={step.key} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isRejected
                          ? "border-red-200 bg-red-50 text-red-600"
                          : isDone
                          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                          : isCurrent
                          ? "border-indigo-500 bg-indigo-600 text-white"
                          : "border-slate-200 bg-white text-slate-500"
                      }`}>
                        {isRejected ? (
                          <XCircle className="w-3 h-3" />
                        ) : isDone ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <div className={`w-1.5 h-1.5 rounded-full ${isCurrent ? "bg-white" : "bg-slate-300"}`} />
                        )}
                      </div>
                      <span className={`text-xs ${
                        isRejected
                          ? "text-red-600"
                          : isDone
                          ? "text-emerald-600"
                          : isCurrent
                          ? "text-slate-900 font-medium"
                          : "text-slate-500"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reporter Info */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">
                Pelapor
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <User className="w-3 h-3 text-slate-500" />
                </div>
                <span className="text-slate-900">
                  {report.is_anonymous ? "Anonim" : (report.reporter_name || "Warga")}
                </span>
              </div>
            </div>

            {/* Metadata */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Diajukan</span>
                <span className="text-slate-900">
                  {new Date(report.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Kategori</span>
                <span className="text-slate-900">{catLabel}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Urgensi</span>
                <span className={report.urgency === "high" ? "text-red-600" : report.urgency === "medium" ? "text-amber-600" : "text-emerald-600"}>
                  {report.urgency}
                </span>
              </div>
              {report.updated_at && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Diperbarui</span>
                  <span className="text-slate-900">
                    {new Date(report.updated_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
