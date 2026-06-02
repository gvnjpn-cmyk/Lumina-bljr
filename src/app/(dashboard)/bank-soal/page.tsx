"use client";

import { Library, Search, Filter, Star, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { SUBJECT_OPTIONS, GRADE_OPTIONS } from "@/types";

export default function BankSoalPage() {
  const [questions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="max-w-6xl mx-auto pt-2">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Bank Soal</h1>
        <p className="text-white/40 text-sm mt-0.5">1 juta+ soal dari berbagai mata pelajaran</p>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            placeholder="Cari soal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/40"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/40"
          >
            <option value="">Semua Mata Pelajaran</option>
            {SUBJECT_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/40"
          >
            <option value="">Semua Jenjang</option>
            {GRADE_OPTIONS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/10 text-white/60 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
            Filter Lanjut
          </button>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-20">
          <Library className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Bank Soal Lengkap</h3>
          <p className="text-white/40 text-sm mb-6">Sedang memuat soal dari berbagai sumber...</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {/* Questions will be displayed here */}
        </div>
      )}
    </div>
  );
}
