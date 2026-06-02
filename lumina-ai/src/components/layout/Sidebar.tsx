"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Sparkles, LayoutDashboard, Bot, Upload, FileText,
  Brain, BookOpen, Library, Trophy, Medal, User,
  Settings, LogOut, ChevronLeft, Menu, Zap,
} from "lucide-react";
import { cn, getInitials } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/ai-tutor", icon: Bot, label: "AI Tutor", badge: "AI" },
  { href: "/upload", icon: Upload, label: "Upload Materi" },
  { href: "/summary", icon: FileText, label: "Ringkasan" },
  { href: "/quiz", icon: Brain, label: "Quiz Generator", badge: "AI" },
  { href: "/flashcard", icon: BookOpen, label: "Flashcard" },
  { href: "/bank-soal", icon: Library, label: "Bank Soal" },
  { href: "/tryout", icon: Trophy, label: "Tryout" },
  { href: "/leaderboard", icon: Medal, label: "Leaderboard" },
];

const BOTTOM_ITEMS = [
  { href: "/profile", icon: User, label: "Profil" },
  { href: "/settings", icon: Settings, label: "Pengaturan" },
];

interface SidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center gap-3 p-5 border-b border-white/[0.06]", collapsed && "justify-center p-4")}>
        <div className="relative flex-shrink-0">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 blur-sm opacity-60" />
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
        {!collapsed && (
          <div>
            <span className="text-lg font-bold text-gradient">Lumina AI</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Zap className="w-2.5 h-2.5 text-yellow-400" />
              <span className="text-[10px] text-yellow-400">Pro Active</span>
            </div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                active
                  ? "sidebar-active text-blue-400"
                  : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("w-4 h-4 flex-shrink-0", active && "text-blue-400")} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 font-medium">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-blue-500/[0.08] -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="border-t border-white/[0.06] p-3 space-y-1">
        {BOTTOM_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                active ? "text-blue-400 bg-blue-500/[0.08]" : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]",
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className="w-4 h-4" />
              {!collapsed && item.label}
            </Link>
          );
        })}

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-200",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && "Keluar"}
        </button>

        {/* User info */}
        {!collapsed && (
          <div className="mt-3 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {user.image ? (
              <img src={user.image} alt="" className="w-7 h-7 rounded-full object-cover" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                {getInitials(user.name || "U")}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{user.name}</div>
              <div className="text-[10px] text-white/30 truncate">{user.email}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 bottom-0 z-40 glass border-r border-white/[0.06] hidden md:block overflow-hidden"
      >
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-5 -right-3 w-6 h-6 rounded-full bg-[#0a0f1e] border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
        >
          <ChevronLeft className={cn("w-3 h-3 transition-transform", collapsed && "rotate-180")} />
        </button>
      </motion.aside>

      {/* Mobile top bar toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 w-10 h-10 rounded-xl glass border border-white/10 flex items-center justify-center text-white md:hidden"
      >
        <Menu className="w-4 h-4" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-64 z-50 glass border-r border-white/[0.06] md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
