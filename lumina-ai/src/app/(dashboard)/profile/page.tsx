"use client";

import { User, Mail, Award, BookOpen, Trophy } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto pt-2">
      <h1 className="text-2xl font-bold text-white mb-6">Profil Saya</h1>

      <div className="space-y-6">
        {/* User info */}
        <div className="glass rounded-2xl border border-white/[0.06] p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Informasi Profil</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-white/50 uppercase">Nama Lengkap</label>
              <input
                type="text"
                defaultValue="Muhammad Farhan"
                className="w-full mt-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/40"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 uppercase">Email</label>
              <input
                type="email"
                defaultValue="farhan@example.com"
                className="w-full mt-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/40"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-white/50 uppercase">Jenjang Pendidikan</label>
              <select className="w-full mt-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500/40">
                <option>SMA Kelas 12</option>
              </select>
            </div>
          </div>
          <button className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm font-medium btn-glow">
            Simpan Perubahan
          </button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: BookOpen, label: "Dokumen", value: "12" },
            { icon: Award, label: "Level", value: "15" },
            { icon: Trophy, label: "Ranking", value: "#42" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-2xl border border-white/[0.06] p-4 text-center">
              <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
