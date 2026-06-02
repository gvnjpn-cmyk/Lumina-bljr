"use client";

import { Trophy, Plus, Clock, Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function TryoutPage() {
  const [tryouts] = useState([]);

  return (
    <div className="max-w-5xl mx-auto pt-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Tryout Online</h1>
          <p className="text-white/40 text-sm mt-0.5">Simulasi ujian lengkap dengan timer dan analisis</p>
        </div>
        <Link
          href="/upload"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm btn-glow"
        >
          <Plus className="w-3.5 h-3.5" />
          Buat Tryout
        </Link>
      </div>

      {tryouts.length === 0 ? (
        <div className="text-center py-20">
          <Trophy className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Belum ada tryout</h3>
          <p className="text-white/40 text-sm mb-6">Buat atau ikuti tryout untuk simulasi ujian</p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-white text-sm hover:border-blue-500/30 transition-all"
            >
              <Target className="w-4 h-4" />
              Lihat Quiz
            </Link>
            <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm btn-glow">
              <Plus className="w-4 h-4" />
              Buat Tryout Baru
            </button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Tryouts will be displayed here */}
        </div>
      )}
    </div>
  );
}
