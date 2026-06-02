"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Bot, Brain, BookOpen, Upload, Trophy, Medal,
  TrendingUp, Flame, Zap, Star, ArrowRight, Library,
  Clock, CheckCircle, MessageSquare, FileText,
} from "lucide-react";
import { formatRelativeTime, scoreToGrade, getInitials } from "@/lib/utils";

interface Props {
  user: { name: string; email: string; image: string | null };
  stats: {
    totalDocuments: number;
    totalQuizAttempts: number;
    averageScore: number;
    currentStreak: number;
    totalXP: number;
    level: number;
    xpProgress: number;
    xpForNext: number;
  };
  recentActivity: { id: string; type: string; title: string; score?: number; createdAt: Date | null }[];
  recentChats: { id: string; title: string; updatedAt: Date }[];
}

const QUICK_ACTIONS = [
  { href: "/ai-tutor", icon: Bot, label: "AI Tutor", desc: "Tanya apa saja", color: "from-blue-500 to-cyan-500", glow: "shadow-blue-500/20" },
  { href: "/upload", icon: Upload, label: "Upload Materi", desc: "PDF, DOCX, dll", color: "from-violet-500 to-purple-500", glow: "shadow-violet-500/20" },
  { href: "/quiz", icon: Brain, label: "Quiz Baru", desc: "Generate soal", color: "from-cyan-500 to-teal-500", glow: "shadow-cyan-500/20" },
  { href: "/flashcard", icon: BookOpen, label: "Flashcard", desc: "Belajar cepat", color: "from-emerald-500 to-green-500", glow: "shadow-emerald-500/20" },
  { href: "/tryout", icon: Trophy, label: "Tryout", desc: "Simulasi ujian", color: "from-orange-500 to-amber-500", glow: "shadow-orange-500/20" },
  { href: "/bank-soal", icon: Library, label: "Bank Soal", desc: "1M+ soal", color: "from-pink-500 to-rose-500", glow: "shadow-pink-500/20" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06 } }),
};

export default function DashboardClient({ user, stats, recentActivity, recentChats }: Props) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat pagi" : hour < 17 ? "Selamat siang" : "Selamat malam";

  return (
    <div className="max-w-7xl mx-auto space-y-6 pt-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-white/40 text-sm mb-1">{greeting},</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {user.name.split(" ")[0]} 👋
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-2 glass rounded-xl px-4 py-2.5 border border-white/[0.06]">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-semibold text-white">{stats.currentStreak}</span>
          <span className="text-xs text-white/40">hari streak</span>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Level", value: stats.level, icon: Star, color: "text-yellow-400", sub: `${Math.round(stats.xpProgress)}% ke level ${stats.level + 1}` },
          { label: "Total XP", value: stats.totalXP.toLocaleString(), icon: Zap, color: "text-blue-400", sub: `${stats.xpForNext.toLocaleString()} XP next` },
          { label: "Rata Skor", value: `${stats.averageScore}%`, icon: TrendingUp, color: "text-emerald-400", sub: `${stats.totalQuizAttempts} quiz selesai` },
          { label: "Materi", value: stats.totalDocuments, icon: FileText, color: "text-violet-400", sub: "Dokumen diupload" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="glass rounded-2xl p-4 border border-white/[0.06] relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
            <div className="text-xs text-white/40">{stat.label}</div>
            <div className="text-[10px] text-white/25 mt-0.5">{stat.sub}</div>
            {/* XP progress bar for level card */}
            {stat.label === "Level" && (
              <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.xpProgress}%` }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="md:col-span-2">
          <h2 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wider">Mulai Belajar</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {QUICK_ACTIONS.map((action, i) => (
              <motion.div key={action.href} custom={i} variants={fadeUp} initial="hidden" animate="visible">
                <Link
                  href={action.href}
                  className={`group flex flex-col gap-3 p-4 rounded-2xl glass border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:${action.glow}`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} p-0.5`}>
                    <div className="w-full h-full rounded-xl bg-[#070d1a] flex items-center justify-center group-hover:bg-transparent transition-colors">
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{action.label}</div>
                    <div className="text-xs text-white/40">{action.desc}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wider">Aktivitas Terkini</h2>
          <div className="glass rounded-2xl border border-white/[0.06] divide-y divide-white/[0.04] overflow-hidden">
            {recentActivity.length === 0 ? (
              <div className="p-6 text-center">
                <Trophy className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-sm text-white/30">Belum ada aktivitas</p>
                <Link href="/quiz" className="text-xs text-blue-400 hover:text-blue-300 mt-1 block">
                  Mulai quiz pertama →
                </Link>
              </div>
            ) : (
              recentActivity.map((item, i) => {
                const grade = item.score !== undefined ? scoreToGrade(item.score) : null;
                return (
                  <motion.div
                    key={item.id}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white truncate">{item.title}</div>
                      <div className="text-[10px] text-white/30">
                        {item.createdAt ? formatRelativeTime(item.createdAt) : ""}
                      </div>
                    </div>
                    {grade && (
                      <span className={`text-xs font-bold ${grade.color}`}>{grade.grade}</span>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Recent chats */}
          {recentChats.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wider">Chat Terakhir</h2>
              <div className="glass rounded-2xl border border-white/[0.06] divide-y divide-white/[0.04] overflow-hidden">
                {recentChats.map((chat, i) => (
                  <Link
                    key={chat.id}
                    href={`/ai-tutor?chat=${chat.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white truncate">{chat.title}</div>
                      <div className="text-[10px] text-white/30">{formatRelativeTime(chat.updatedAt)}</div>
                    </div>
                    <ArrowRight className="w-3 h-3 text-white/20" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard teaser */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative glass rounded-2xl border border-white/[0.06] p-5 overflow-hidden"
      >
        <div className="absolute inset-0 aurora-bg opacity-20" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Medal className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Leaderboard Mingguan</div>
              <div className="text-xs text-white/40">Kamu berada di posisi teratas bulan ini!</div>
            </div>
          </div>
          <Link
            href="/leaderboard"
            className="flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            Lihat semua
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
