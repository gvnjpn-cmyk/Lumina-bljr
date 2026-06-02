"use client";

import { Bell, Lock, Zap, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto pt-2">
      <h1 className="text-2xl font-bold text-white mb-6">Pengaturan</h1>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="glass rounded-2xl border border-white/[0.06] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">Notifikasi</h2>
          </div>
          <div className="space-y-3">
            {["Email untuk quiz baru", "Reminder belajar harian", "Update ranking"].map((item) => (
              <label key={item} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                <span className="text-sm text-white/70">{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="glass rounded-2xl border border-white/[0.06] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-violet-400" />
            <h2 className="text-lg font-semibold text-white">Keamanan</h2>
          </div>
          <button className="w-full py-2.5 rounded-xl glass border border-white/10 text-white text-sm hover:border-blue-500/30 transition-all">
            Ubah Password
          </button>
        </div>

        {/* Subscription */}
        <div className="glass rounded-2xl border border-white/[0.06] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">Langganan</h2>
          </div>
          <div className="mb-4">
            <div className="text-sm text-white/60 mb-2">Plan Aktif: Pro</div>
            <div className="text-xs text-white/40">Berlaku hingga 30 Januari 2025</div>
          </div>
          <button className="w-full py-2.5 rounded-xl glass border border-white/10 text-white text-sm hover:border-blue-500/30 transition-all">
            Kelola Langganan
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium hover:bg-red-500/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Keluar Akun
        </button>
      </div>
    </div>
  );
}
