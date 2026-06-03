"use client";

import { Bell, Search, Sparkles } from "lucide-react";
import { getInitials } from "@/lib/utils";
import Link from "next/link";

interface TopBarProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function TopBar({ user }: TopBarProps) {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-30 flex items-center gap-4 px-4 md:px-6 py-3 glass border-b border-white/[0.06] h-14">
      {/* Spacer for mobile menu button */}
      <div className="w-10 md:hidden" />

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <input
            placeholder="Cari materi, quiz, flashcard..."
            className="w-full bg-white/[0.04] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.06] transition-all"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/20 bg-white/[0.04] px-1.5 py-0.5 rounded hidden md:block">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* AI Credits badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Sparkles className="w-3 h-3 text-blue-400" />
          <span className="text-xs text-blue-400 font-medium">Unlimited</span>
        </div>

        {/* Notifications */}
        <button className="relative w-8 h-8 rounded-xl glass border border-white/[0.06] flex items-center justify-center text-white/50 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-500" />
        </button>

        {/* Avatar */}
        <Link href="/profile" className="flex-shrink-0">
          {user.image ? (
            <img src={user.image} alt="" className="w-8 h-8 rounded-xl object-cover border border-white/10" />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
              {getInitials(user.name || "U")}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
