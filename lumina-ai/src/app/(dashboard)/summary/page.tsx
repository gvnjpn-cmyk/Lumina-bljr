"use client";

import { FileText, BookOpen, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SummaryPage() {
  const [summaries] = useState([]);

  return (
    <div className="max-w-5xl mx-auto pt-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Ringkasan Materi</h1>
          <p className="text-white/40 text-sm mt-0.5">AI-generated summaries dari materi yang diupload</p>
        </div>
        <Link
          href="/upload"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm btn-glow"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Upload Materi
        </Link>
      </div>

      {summaries.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Belum ada ringkasan</h3>
          <p className="text-white/40 text-sm mb-6">Upload materi untuk AI membuat ringkasan otomatis</p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm btn-glow"
          >
            <Sparkles className="w-4 h-4" />
            Mulai Upload
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {/* Summaries will be displayed here */}
        </div>
      )}
    </div>
  );
}
