"use client";

import { Medal, Trophy, Flame, Sparkles, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getInitials } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  xp: number;
  rank?: number;
  user: { name: string; image: string | null; email: string };
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [period, setPeriod] = useState<"month" | "week">("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [period]);

  async function loadLeaderboard() {
    try {
      const res = await fetch(`/api/progress/leaderboard?period=${period}`);
      const data = await res.json();
      setLeaderboard(data);
    } finally {
      setLoading(false);
    }
  }

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-400 to-amber-500";
      case 2:
        return "from-slate-300 to-slate-400";
      case 3:
        return "from-orange-300 to-orange-500";
      default:
        return "from-blue-500 to-violet-500";
    }
  };

  return (
    <div className="max-w-3xl mx-auto pt-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
        <p className="text-white/40 text-sm mt-0.5">Kompetisi mingguan dan bulanan</p>
      </div>

      {/* Period toggle */}
      <div className="flex gap-3 mb-6">
        {["month", "week"].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              period === p
                ? "bg-blue-600 text-white"
                : "glass border border-white/10 text-white/60 hover:text-white"
            }`}
          >
            {p === "month" ? "Bulanan" : "Mingguan"}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {leaderboard.map((entry, idx) => {
          const rank = idx + 1;
          const medalColor = getMedalColor(rank);

          return (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`flex items-center gap-4 p-4 rounded-2xl glass border transition-all ${
                rank <= 3 ? "border-yellow-500/20" : "border-white/[0.06]"
              }`}
            >
              {/* Rank badge */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white bg-gradient-to-br ${medalColor} flex-shrink-0`}
              >
                {rank === 1 ? (
                  <Trophy className="w-5 h-5" />
                ) : rank === 2 ? (
                  <Medal className="w-5 h-5" />
                ) : rank === 3 ? (
                  <Medal className="w-5 h-5" />
                ) : (
                  rank
                )}
              </div>

              {/* User info */}
              <div className="flex-1 flex items-center gap-3">
                {entry.user.image ? (
                  <img
                    src={entry.user.image}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                    {getInitials(entry.user.name)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-semibold text-white">
                    {entry.user.name}
                  </div>
                  <div className="text-xs text-white/40">{entry.user.email}</div>
                </div>
              </div>

              {/* XP */}
              <div className="text-right">
                <div className="text-lg font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  {entry.xp.toLocaleString()}
                </div>
                <div className="text-xs text-white/40">XP</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty state */}
      {leaderboard.length === 0 && !loading && (
        <div className="text-center py-20">
          <TrendingUp className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Leaderboard kosong</h3>
          <p className="text-white/40 text-sm">Mulai belajar untuk naik ke leaderboard!</p>
        </div>
      )}
    </div>
  );
}
