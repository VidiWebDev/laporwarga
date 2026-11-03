"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  Shield,
  User,
  Trash2,
  Clock,
} from "lucide-react";

const roleMap: Record<string, { label: string; badgeClass: string }> = {
  user: { label: "User", badgeClass: "text-[#20241f]/60 bg-[#f8f7f4] border-[#20241f]/15" },
  admin: { label: "Admin", badgeClass: "text-red-600 bg-red-50 border-red-200" },
  field: { label: "Petugas", badgeClass: "text-blue-600 bg-blue-50 border-blue-200" },
};

export default function AdminUsers() {
  const [supabase, setSupabase] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sb = createClient();
    setSupabase(sb);
    sb.from("users")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error) setUsers(data || []);
        setLoading(false);
      });
  }, []);

  const handleRoleUpdate = async (id: string, role: string) => {
    if (!supabase || !confirm(`Ubah role user ke "${role}"?`)) return;
    const { error } = await supabase.from("users").update({ role }).eq("id", id);
    if (error) {
      alert("Gagal update: " + error.message);
    } else {
      setUsers(users.map(u => u.id === id ? { ...u, role } : u));
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm("Yakin hapus user ini? Semua laporan milik user akan dihapus juga.")) return;
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) {
      alert("Gagal hapus: " + error.message);
    } else {
      setUsers(users.filter(u => u.id !== id));
    }
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
      <div>
        <div className="text-xs text-[#20241f]/50 uppercase tracking-wider mb-1">
          KELOLA USER
        </div>
        <h1 className="text-xl font-bold tracking-tight text-[#20241f]">
          Kelola Semua Pengguna
        </h1>
      </div>

      {/* Users table */}
      <div className="rounded-xl border border-[#20241f]/15 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-[#20241f]/15 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#20241f]/50">
            <Users className="w-4 h-4" />
            {users.length} User Terdaftar
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#20241f]/10 bg-[#f8f7f4] text-[#20241f]/50 uppercase tracking-wider">
                <th className="px-5 py-3 font-medium">Nama</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Dibuat</th>
                <th className="px-5 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20241f]/10">
              {users.map((user) => {
                const role = roleMap[user.role] || roleMap.user;
                return (
                  <tr key={user.id} className="hover:bg-[#f8f7f4] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#f8f7f4] border border-[#20241f]/15 flex items-center justify-center">
                          <User className="w-3 h-3 text-[#20241f]/50" />
                        </div>
                        <span className="font-medium text-[#20241f]">{user.full_name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#20241f]/60">{user.email}</td>
                    <td className="px-5 py-3.5">
                      <select
                        className="bg-white border border-[#20241f]/15 text-[10px] rounded px-2 py-1 text-[#20241f]/80 focus:outline-none focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                        value={user.role}
                        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="field">Petugas Lapangan</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5 text-[#20241f]/60">
                      {new Date(user.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 rounded text-[#20241f]/50 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-[#20241f]/50">
                    TIDAK ADA USER.
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