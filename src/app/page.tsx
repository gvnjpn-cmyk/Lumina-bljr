"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  Sparkles, Brain, BookOpen, Trophy, Zap, ChevronRight,
  Star, ArrowRight, Play, CheckCircle2, Users, TrendingUp,
  MessageSquare, FileText, Layers, Target, Shield, Globe,
} from "lucide-react";

const FEATURES = [
  {
    icon: Brain,
    title: "AI Tutor Cerdas",
    desc: "Chat real-time dengan AI yang menjelaskan materi step-by-step, buat contoh soal, dan berikan latihan personal.",
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: FileText,
    title: "Ringkasan Otomatis",
    desc: "Upload PDF, DOCX, gambar, atau YouTube URL — AI meringkas materi secara otomatis dalam hitungan detik.",
    color: "violet",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    icon: Layers,
    title: "Quiz Generator",
    desc: "Generate soal pilihan ganda, benar/salah, dan isian dari materi apapun. Mode latihan dan ujian tersedia.",
    color: "cyan",
    gradient: "from-cyan-500 to-teal-500",
  },
  {
    icon: BookOpen,
    title: "Flashcard Pintar",
    desc: "Belajar efisien dengan sistem spaced repetition berbasis AI. Flip animation yang smooth dan bookmark favorit.",
    color: "emerald",
    gradient: "from-emerald-500 to-green-500",
  },
  {
    icon: Target,
    title: "Bank Soal Lengkap",
    desc: "Ribuan soal terverifikasi dari berbagai mata pelajaran. Filter berdasarkan subjek, kelas, dan tingkat kesulitan.",
    color: "orange",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: Trophy,
    title: "Tryout Online",
    desc: "Simulasi ujian lengkap dengan timer, analisis kesalahan, dan rekomendasi materi untuk perbaikan.",
    color: "pink",
    gradient: "from-pink-500 to-rose-500",
  },
];

const STATS = [
  { value: "50K+", label: "Pengguna Aktif", icon: Users },
  { value: "1M+", label: "Soal Tersedia", icon: FileText },
  { value: "98%", label: "Kepuasan Pengguna", icon: Star },
  { value: "24/7", label: "AI Siap Membantu", icon: Zap },
];

const TESTIMONIALS = [
  {
    name: "Farhan Pratama",
    role: "Siswa SMA, Bandung",
    avatar: "FP",
    text: "Nilai Matematika gue naik dari 65 ke 90 dalam sebulan! AI Tutor-nya jelasin step-by-step, bukan cuma kasih jawaban.",
    rating: 5,
  },
  {
    name: "Rizki Amelia",
    role: "Mahasiswi S1, Jakarta",
    avatar: "RA",
    text: "Fitur ringkasan materi beneran game changer. Upload PDF kuliah, langsung dapat poin-poin penting yang komprehensif.",
    rating: 5,
  },
  {
    name: "Pak Dedi Susanto",
    role: "Guru Fisika, Surabaya",
    avatar: "DS",
    text: "Lumina AI bantu saya buat soal latihan untuk 3 kelas dalam hitungan menit. Kualitas soalnya pun sangat baik.",
    rating: 5,
  },
];

const PLANS = [
  {
    name: "Gratis",
    price: "Rp 0",
    period: "",
    features: ["5 sesi AI Tutor/bulan", "10 quiz/bulan", "20 flashcard", "Akses bank soal terbatas"],
    cta: "Mulai Gratis",
    highlight: false,
  },
  {
    name: "Pro",
    price: "Rp 49.000",
    period: "/bulan",
    features: ["Unlimited AI Tutor", "Unlimited quiz & flashcard", "Bank soal lengkap", "Tryout premium", "Analisis progress detail", "Prioritas support"],
    cta: "Mulai Pro",
    highlight: true,
    badge: "Terpopuler",
  },
  {
    name: "Guru",
    price: "Rp 99.000",
    period: "/bulan",
    features: ["Semua fitur Pro", "Kelola kelas & siswa", "Buat quiz untuk siswa", "Laporan kelas", "Admin panel", "Onboarding khusus"],
    cta: "Untuk Guru",
    highlight: false,
  },
];

function FloatingOrb({ className }: { className?: string }) {
  return (
    <div className={`absolute rounded-full blur-3xl opacity-20 animate-pulse ${className}`} />
  );
}

function GlowCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      className={`relative rounded-2xl p-px overflow-hidden ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          background: hovered
            ? "linear-gradient(135deg, rgba(59,130,246,0.5), rgba(139,92,246,0.5))"
            : "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
        }}
        transition={{ duration: 0.3 }}
      />
      <div className="relative rounded-2xl bg-[#070d1a] h-full">{children}</div>
    </motion.div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0.3]);
  const [typedText, setTypedText] = useState("");
  const [textIndex, setTextIndex] = useState(0);

  const texts = ["Belajar Lebih Cerdas", "Raih Nilai Terbaik", "Kuasai Setiap Materi"];

  useEffect(() => {
    const fullText = texts[textIndex];
    let i = 0;
    const interval = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setTextIndex((prev) => (prev + 1) % texts.length);
          setTypedText("");
        }, 2000);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [textIndex]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050810]">
      {/* Background effects */}
      <FloatingOrb className="w-[600px] h-[600px] bg-blue-600 top-[-200px] left-[-100px]" />
      <FloatingOrb className="w-[400px] h-[400px] bg-violet-600 top-[200px] right-[-50px]" />
      <FloatingOrb className="w-[500px] h-[500px] bg-cyan-600 top-[800px] left-[30%]" />

      {/* Dot grid */}
      <div className="fixed inset-0 dot-grid opacity-40 pointer-events-none" />

      {/* Nav */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/[0.06]"
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 blur-sm opacity-80" />
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="text-lg font-bold text-gradient">Lumina AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <Link href="#features" className="hover:text-white transition-colors">Fitur</Link>
          <Link href="#stats" className="hover:text-white transition-colors">Statistik</Link>
          <Link href="#pricing" className="hover:text-white transition-colors">Harga</Link>
          <Link href="#testimonials" className="hover:text-white transition-colors">Testimoni</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2">
            Masuk
          </Link>
          <Link
            href="/register"
            className="relative text-sm font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white btn-glow transition-all duration-300 hover:opacity-90"
          >
            Coba Gratis
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <motion.section
        ref={heroRef}
        style={{ y: yHero, opacity: opacityHero }}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-blue-500/20 text-sm text-blue-400 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Platform EdTech #1 berbasis AI di Indonesia</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] tracking-tight"
        >
          <span className="text-white">{typedText}</span>
          <span className="text-blue-500 animate-pulse">_</span>
          <br />
          <span className="text-gradient">dengan AI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed"
        >
          Platform belajar AI untuk siswa SMP, SMA, mahasiswa, dan guru. AI Tutor, Quiz Generator,
          Flashcard, Bank Soal, dan Tryout dalam satu platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/register"
            className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-lg btn-glow transition-all duration-300 hover:scale-105"
          >
            Mulai Belajar Gratis
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass border border-white/10 text-white font-medium text-lg hover:border-white/20 transition-all duration-300">
            <Play className="w-5 h-5 text-blue-400" />
            Lihat Demo
          </button>
        </motion.div>

        {/* Hero visual */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="relative mt-20 w-full max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-[#050810] rounded-3xl z-10" />
          <div className="glass rounded-3xl border border-white/[0.08] p-1 shadow-2xl">
            <div className="rounded-2xl overflow-hidden bg-[#070d1a]">
              {/* Mock dashboard preview */}
              <div className="flex">
                {/* Sidebar mock */}
                <div className="w-56 border-r border-white/[0.06] p-4 hidden md:block">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-bold text-gradient">Lumina AI</span>
                  </div>
                  {[
                    { icon: "🏠", label: "Dashboard", active: false },
                    { icon: "🤖", label: "AI Tutor", active: true },
                    { icon: "📚", label: "Materi", active: false },
                    { icon: "📝", label: "Quiz", active: false },
                    { icon: "🃏", label: "Flashcard", active: false },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-sm ${
                        item.active
                          ? "bg-blue-500/10 text-blue-400 font-medium"
                          : "text-white/40"
                      }`}
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </div>
                  ))}
                </div>

                {/* Chat mock */}
                <div className="flex-1 p-5">
                  <div className="text-sm text-white/30 mb-4">AI Tutor — Matematika</div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-xs">
                        👤
                      </div>
                      <div className="glass rounded-xl px-4 py-2 text-sm text-white/70 max-w-xs">
                        Tolong jelaskan rumus turunan fungsi trigonometri
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex-shrink-0 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="glass rounded-xl px-4 py-3 text-sm text-white/80 max-w-lg">
                          <p className="text-blue-400 font-medium mb-2">📐 Turunan Fungsi Trigonometri</p>
                          <p className="text-white/60 text-xs leading-relaxed">
                            Rumus dasar yang harus kamu hafal:<br />
                            • <span className="text-blue-300">d/dx(sin x) = cos x</span><br />
                            • <span className="text-violet-300">d/dx(cos x) = −sin x</span><br />
                            • <span className="text-cyan-300">d/dx(tan x) = sec² x</span>
                          </p>
                        </div>
                        <div className="flex gap-1 mt-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" />
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.1s]" />
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Stats */}
      <section id="stats" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center glass rounded-2xl p-6 border border-white/[0.06]"
            >
              <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-violet-500/20 text-sm text-violet-400 mb-6">
              <Zap className="w-3.5 h-3.5" />
              Fitur Unggulan
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Semua yang kamu butuhkan
              <br />
              <span className="text-gradient">dalam satu platform</span>
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Dari AI Tutor hingga Tryout online — Lumina AI hadir sebagai teman belajar terlengkap.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <GlowCard key={feature.title}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  viewport={{ once: true }}
                  className="p-6"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} p-0.5 mb-5`}>
                    <div className="w-full h-full rounded-2xl bg-[#070d1a] flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Dipercaya ribuan <span className="text-gradient">pelajar Indonesia</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 border border-white/[0.06]"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-white/40">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Harga yang <span className="text-gradient">terjangkau</span>
            </h2>
            <p className="text-white/50">Mulai gratis, upgrade kapanpun kamu butuh lebih.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`relative rounded-2xl p-6 ${
                  plan.highlight
                    ? "bg-gradient-to-b from-blue-600/20 to-violet-600/10 border border-blue-500/30"
                    : "glass border border-white/[0.06]"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-xs font-medium text-white">
                    {plan.badge}
                  </span>
                )}
                <div className="text-white font-semibold text-lg mb-1">{plan.name}</div>
                <div className="mb-5">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/40 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-3 rounded-xl font-medium text-sm transition-all ${
                    plan.highlight
                      ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:opacity-90 btn-glow"
                      : "glass border border-white/10 text-white hover:border-white/20"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center glass rounded-3xl p-16 border border-white/[0.08] relative overflow-hidden"
        >
          <div className="absolute inset-0 aurora-bg opacity-30" />
          <div className="relative">
            <Sparkles className="w-10 h-10 text-blue-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Siap belajar lebih cerdas?
            </h2>
            <p className="text-white/50 text-lg mb-8">
              Bergabung dengan 50.000+ pelajar yang sudah merasakan manfaat Lumina AI.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-lg btn-glow hover:scale-105 transition-all duration-300"
            >
              Mulai Sekarang — Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gradient">Lumina AI</span>
          </div>
          <p className="text-white/30 text-sm">
            © 2024 Lumina AI. Platform EdTech berbasis AI untuk Indonesia.
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
