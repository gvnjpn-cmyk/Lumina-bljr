"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Plus, ChevronLeft, ChevronRight, RotateCcw,
  Bookmark, Check, X, Sparkles, Loader2, Brain, Star,
  ArrowLeft, Shuffle, Filter,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  isBookmarked: boolean;
  difficulty: number;
}

interface FlashcardSet {
  id: string;
  title: string;
  description?: string;
  subject?: string;
  cards: Flashcard[];
  _count: { cards: number };
}

export default function FlashcardPage() {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [unknown, setUnknown] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"browse" | "study">("browse");
  const [shuffled, setShuffled] = useState(false);
  const [studyCards, setStudyCards] = useState<Flashcard[]>([]);
  const [filterBookmarked, setFilterBookmarked] = useState(false);

  useEffect(() => {
    loadSets();
  }, []);

  async function loadSets() {
    try {
      const res = await fetch("/api/flashcard");
      const data = await res.json();
      setSets(data);
    } catch {
      toast.error("Gagal memuat flashcard");
    } finally {
      setLoading(false);
    }
  }

  function startStudy(set: FlashcardSet) {
    let cards = [...set.cards];
    if (filterBookmarked) cards = cards.filter((c) => c.isBookmarked);
    if (shuffled) cards = cards.sort(() => Math.random() - 0.5);
    setStudyCards(cards);
    setSelectedSet(set);
    setCurrentIndex(0);
    setFlipped(false);
    setKnown(new Set());
    setUnknown(new Set());
    setMode("study");
  }

  function handleNext() {
    if (currentIndex < studyCards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setFlipped(false);
    }
  }

  function handleKnow() {
    const card = studyCards[currentIndex];
    setKnown((prev) => new Set([...prev, card.id]));
    handleNext();
    // Haptic feedback hint
    toast.success("Tahu! 🎉", { duration: 800 });
  }

  function handleDontKnow() {
    const card = studyCards[currentIndex];
    setUnknown((prev) => new Set([...prev, card.id]));
    handleNext();
    toast.error("Perlu belajar lagi 📚", { duration: 800 });
  }

  async function toggleBookmark(cardId: string) {
    await fetch(`/api/flashcard/card/${cardId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBookmarked: true }),
    });
    if (selectedSet) {
      setSelectedSet((prev) =>
        prev
          ? {
              ...prev,
              cards: prev.cards.map((c) =>
                c.id === cardId ? { ...c, isBookmarked: !c.isBookmarked } : c
              ),
            }
          : null
      );
    }
  }

  const card = studyCards[currentIndex];
  const progress = studyCards.length > 0 ? ((currentIndex + 1) / studyCards.length) * 100 : 0;
  const knownCount = known.size;
  const unknownCount = unknown.size;

  if (mode === "study" && selectedSet && card) {
    const isLast = currentIndex === studyCards.length - 1 && (known.has(card.id) || unknown.has(card.id));

    return (
      <div className="max-w-2xl mx-auto pt-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setMode("browse")}
            className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-white">{selectedSet.title}</h2>
            <p className="text-xs text-white/40">{currentIndex + 1} / {studyCards.length} kartu</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <Check className="w-3.5 h-3.5" /> {knownCount}
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <X className="w-3.5 h-3.5" /> {unknownCount}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
          <motion.div
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
          />
        </div>

        {/* Flashcard */}
        <div
          className="perspective-1000 cursor-pointer mb-8"
          onClick={() => setFlipped(!flipped)}
        >
          <motion.div
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
            className="preserve-3d relative"
            style={{ height: 300 }}
          >
            {/* Front */}
            <div className="backface-hidden absolute inset-0 glass rounded-3xl border border-white/[0.08] p-8 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-lg font-medium text-white leading-relaxed">{card.front}</p>
              {card.hint && (
                <p className="text-xs text-white/30 mt-4 italic">💡 {card.hint}</p>
              )}
              <p className="text-xs text-white/20 mt-6">Klik untuk melihat jawaban</p>
            </div>

            {/* Back */}
            <div
              className="backface-hidden absolute inset-0 glass rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-violet-500/5 p-8 flex flex-col items-center justify-center text-center rotate-y-180"
            >
              <div className="w-10 h-10 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
              <p className="text-lg font-medium text-white leading-relaxed">{card.back}</p>
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          {flipped ? (
            <>
              <button
                onClick={handleDontKnow}
                className="flex-1 py-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-sm hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Belum Tahu
              </button>
              <button
                onClick={() => toggleBookmark(card.id)}
                className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center text-white/40 hover:text-yellow-400 transition-colors"
              >
                <Bookmark className={`w-4 h-4 ${card.isBookmarked ? "fill-yellow-400 text-yellow-400" : ""}`} />
              </button>
              <button
                onClick={handleKnow}
                className="flex-1 py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium text-sm hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Sudah Tahu
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setFlipped(true)}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium text-sm btn-glow hover:opacity-90 transition-all"
              >
                Lihat Jawaban
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === studyCards.length - 1}
                className="w-12 h-12 rounded-2xl glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* End of deck */}
        {currentIndex === studyCards.length - 1 && (known.has(card.id) || unknown.has(card.id)) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 glass rounded-2xl border border-white/[0.08] p-6 text-center"
          >
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Sesi Selesai! 🎉</h3>
            <p className="text-white/50 text-sm mb-4">
              Tahu: {knownCount} | Perlu belajar: {unknownCount}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => startStudy(selectedSet)}
                className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-white text-sm hover:border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Ulangi
              </button>
              <button
                onClick={() => {
                  const cardsToReview = studyCards.filter((c) => unknown.has(c.id));
                  if (cardsToReview.length > 0) {
                    setStudyCards(cardsToReview);
                    setCurrentIndex(0);
                    setFlipped(false);
                    setKnown(new Set());
                    setUnknown(new Set());
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm btn-glow hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Brain className="w-4 h-4" />
                Review Yang Salah
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  // Browse mode
  return (
    <div className="max-w-5xl mx-auto pt-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Flashcard</h1>
          <p className="text-white/40 text-sm mt-0.5">Belajar efisien dengan spaced repetition</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShuffled(!shuffled)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-colors ${
              shuffled ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "glass border-white/10 text-white/50"
            }`}
          >
            <Shuffle className="w-3.5 h-3.5" />
            Acak
          </button>
          <Link
            href="/upload"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm btn-glow"
          >
            <Plus className="w-3.5 h-3.5" />
            Buat Flashcard
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-white/30" />
        </div>
      ) : sets.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Belum ada flashcard</h3>
          <p className="text-white/40 text-sm mb-6">Upload materi dan AI akan otomatis membuat flashcard</p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm btn-glow"
          >
            <Sparkles className="w-4 h-4" />
            Upload Materi Sekarang
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sets.map((set, i) => (
            <motion.div
              key={set.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="group glass rounded-2xl border border-white/[0.06] p-5 hover:border-blue-500/20 transition-all cursor-pointer"
              onClick={() => startStudy(set)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-xs text-white/30 bg-white/[0.04] px-2 py-1 rounded-lg">
                  {set._count.cards} kartu
                </span>
              </div>
              <h3 className="font-semibold text-white mb-1">{set.title}</h3>
              {set.description && (
                <p className="text-xs text-white/40 mb-3 line-clamp-2">{set.description}</p>
              )}
              {set.subject && (
                <span className="text-xs px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/10">
                  {set.subject}
                </span>
              )}
              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-white/30">Klik untuk belajar</span>
                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
