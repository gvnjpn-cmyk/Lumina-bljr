"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Email atau password salah. Coba lagi.");
      } else {
        toast.success("Selamat datang kembali! 👋");
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050810] relative overflow-hidden px-4">
      {/* Background orbs */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-600 blur-3xl opacity-10 -top-40 -left-40 animate-pulse" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-violet-600 blur-3xl opacity-10 -bottom-20 -right-20 animate-pulse" />
      <div className="fixed inset-0 dot-grid opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="glass rounded-3xl p-8 border border-white/[0.08] shadow-2xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 blur-sm opacity-80" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold text-gradient">Lumina AI</span>
          </Link>

          <h1 className="text-2xl font-bold text-white mb-1">Selamat Datang</h1>
          <p className="text-white/50 text-sm mb-8">Masuk untuk melanjutkan belajar</p>

          {/* Google Sign In */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl glass border border-white/10 text-white text-sm font-medium hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200 mb-6 disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Masuk dengan Google
          </button>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/[0.08]" />
            <span className="text-white/30 text-xs">atau</span>
            <div className="flex-1 h-px bg-white/[0.08]" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                Lupa password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium text-sm btn-glow hover:opacity-90 transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Belum punya akun?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Daftar Gratis
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
