"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Plus, Play, Clock, Target, ChevronRight,
  CheckCircle, XCircle, AlertCircle, RotateCcw,
  Sparkles, Trophy, ArrowRight, BookOpen, Loader2,
  Check, X,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { formatRelativeTime, scoreToGrade } from "@/lib/utils";

interface Question {
  id: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER";
  text: string;
  options?: { id: string; text: string; isCorrect: boolean }[];
  correctAnswer?: string;
  explanation?: string;
  points: number;
}

interface Quiz {
  id: string;
  title: string;
  subject?: string;
  timeLimit?: number;
  questions: Question[];
  _count: { attempts: number };
  createdAt: Date;
}

type PageState = "list" | "taking" | "result";

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageState, setPageState] = useState<PageState>("list");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizMode, setQuizMode] = useState<"PRACTICE" | "EXAM">("PRACTICE");
  const [result, setResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    if (pageState === "taking" && activeQuiz?.timeLimit && quizMode === "EXAM") {
      setTimeLeft(activeQuiz.timeLimit * 60);
      const interval = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { clearInterval(interval); submitQuiz(); }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [pageState, activeQuiz]);

  async function loadQuizzes() {
    try {
      const res = await fetch("/api/quiz");
      const data = await res.json();
      setQuizzes(data);
    } finally {
      setLoading(false);
    }
  }

  function startQuiz(quiz: Quiz, mode: "PRACTICE" | "EXAM") {
    setActiveQuiz(quiz);
    setCurrentQ(0);
    setAnswers({});
    setQuizMode(mode);
    setShowExplanation(false);
    setPageState("taking");
  }

  function selectAnswer(questionId: string, answerId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
    setShowExplanation(false);
  }

  async function submitQuiz() {
    if (!activeQuiz) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/quiz/${activeQuiz.id}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, mode: quizMode }),
      });
      const data = await res.json();
      setResult(data);
      setPageState("result");
    } catch {
      toast.error("Gagal menyimpan hasil quiz");
    } finally {
      setSubmitting(false);
    }
  }

  const question = activeQuiz?.questions[currentQ];
  const answered = question ? !!answers[question.id] : false;
  const allAnswered = activeQuiz?.questions.every((q) => !!answers[q.id]);

  // Result page
  if (pageState === "result" && result) {
    const grade = scoreToGrade(result.score);
    return (
      <div className="max-w-2xl mx-auto pt-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl border border-white/[0.08] p-8 text-center"
        >
          <div className={`text-7xl font-bold mb-2 ${grade.color}`}>{grade.grade}</div>
          <div className="text-4xl font-bold text-white mb-1">{result.score}%</div>
          <p className="text-white/50 mb-6">
            {result.correctCount} dari {result.totalCount} soal benar
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Benar", value: result.correctCount, color: "text-emerald-400", bg: "bg-emerald-500/10" },
              { label: "Salah", value: result.totalCount - result.correctCount, color: "text-red-400", bg: "bg-red-500/10" },
              { label: "Poin", value: result.totalPoints, color: "text-blue-400", bg: "bg-blue-500/10" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
                <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-xs text-white/40">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Answer review */}
          <div className="text-left space-y-3 mb-8 max-h-80 overflow-y-auto pr-1">
            {activeQuiz?.questions.map((q, i) => {
              const userAns = answers[q.id];
              const isCorrect = userAns === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  className={`rounded-xl p-4 border ${
                    isCorrect
                      ? "bg-emerald-500/5 border-emerald-500/20"
                      : "bg-red-500/5 border-red-500/20"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-xs font-medium text-white/80 mb-1">{i + 1}. {q.text}</p>
                      {!isCorrect && (
                        <p className="text-xs text-emerald-400">
                          Jawaban benar: {q.options?.find((o) => o.id === q.correctAnswer)?.text || q.correctAnswer}
                        </p>
                      )}
                      {q.explanation && (
                        <p className="text-[11px] text-white/40 mt-1">{q.explanation}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setPageState("list"); loadQuizzes(); }}
              className="flex-1 py-3 rounded-xl glass border border-white/10 text-white text-sm hover:border-white/20 transition-all flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              Quiz Lain
            </button>
            {activeQuiz && (
              <button
                onClick={() => startQuiz(activeQuiz, quizMode)}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm btn-glow flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Ulangi
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Taking quiz
  if (pageState === "taking" && activeQuiz && question) {
    const progress = ((currentQ + 1) / activeQuiz.questions.length) * 100;
    const userAnswer = answers[question.id];
    const isAnswered = !!userAnswer;

    return (
      <div className="max-w-2xl mx-auto pt-4">
        {/* Quiz header */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setPageState("list")}
            className="text-white/40 hover:text-white text-sm transition-colors"
          >
            ← Keluar
          </button>
          <div className="flex-1">
            <div className="text-xs text-white/40 mb-1">{activeQuiz.title}</div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
              />
            </div>
          </div>
          {quizMode === "EXAM" && activeQuiz.timeLimit && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass border ${
              timeLeft < 60 ? "border-red-500/30 text-red-400" : "border-white/10 text-white/60"
            } text-sm font-mono`}>
              <Clock className="w-3.5 h-3.5" />
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
            </div>
          )}
        </div>

        {/* Question counter */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <span className="text-white/40">Soal {currentQ + 1} dari {activeQuiz.questions.length}</span>
          <span className="text-white/40">{question.points} poin</span>
        </div>

        {/* Question */}
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass rounded-2xl border border-white/[0.08] p-6 mb-5"
        >
          <p className="text-white font-medium leading-relaxed">{question.text}</p>
        </motion.div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.type === "MULTIPLE_CHOICE" && question.options?.map((opt) => {
            const isSelected = userAnswer === opt.id;
            const showResult = isAnswered && quizMode === "PRACTICE" && showExplanation;
            const isCorrect = opt.isCorrect;

            return (
              <motion.button
                key={opt.id}
                onClick={() => selectAnswer(question.id, opt.id)}
                whileHover={{ x: 2 }}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                  showResult
                    ? isCorrect
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : isSelected
                      ? "bg-red-500/10 border-red-500/30 text-red-300"
                      : "glass border-white/[0.06] text-white/50"
                    : isSelected
                    ? "bg-blue-500/10 border-blue-500/30 text-white"
                    : "glass border-white/[0.06] text-white/70 hover:border-white/20"
                }`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isSelected ? "bg-blue-500 text-white" : "bg-white/10 text-white/50"
                }`}>
                  {opt.id.toUpperCase()}
                </span>
                <span className="text-sm">{opt.text}</span>
                {showResult && isCorrect && <Check className="w-4 h-4 ml-auto text-emerald-400" />}
                {showResult && isSelected && !isCorrect && <X className="w-4 h-4 ml-auto text-red-400" />}
              </motion.button>
            );
          })}

          {question.type === "TRUE_FALSE" && (
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "true", label: "Benar ✓" },
                { id: "false", label: "Salah ✗" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => selectAnswer(question.id, opt.id)}
                  className={`py-4 rounded-xl border text-sm font-medium transition-all ${
                    userAnswer === opt.id
                      ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                      : "glass border-white/[0.06] text-white/60 hover:border-white/20"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {question.type === "SHORT_ANSWER" && (
            <textarea
              value={userAnswer || ""}
              onChange={(e) => selectAnswer(question.id, e.target.value)}
              placeholder="Tulis jawaban kamu di sini..."
              rows={3}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/40 resize-none transition-all"
            />
          )}
        </div>

        {/* Practice mode explanation */}
        {quizMode === "PRACTICE" && isAnswered && question.explanation && (
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-5 glass rounded-xl border border-violet-500/20 p-4"
              >
                <div className="flex items-center gap-2 text-violet-400 text-xs font-medium mb-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Penjelasan
                </div>
                <p className="text-white/70 text-sm">{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setCurrentQ((i) => i - 1); setShowExplanation(false); }}
            disabled={currentQ === 0}
            className="px-4 py-2.5 rounded-xl glass border border-white/10 text-sm text-white/50 disabled:opacity-30 hover:text-white transition-colors"
          >
            ← Kembali
          </button>

          {quizMode === "PRACTICE" && isAnswered && !showExplanation && (
            <button
              onClick={() => setShowExplanation(true)}
              className="px-4 py-2.5 rounded-xl glass border border-violet-500/20 text-violet-400 text-sm hover:bg-violet-500/10 transition-all"
            >
              Lihat Penjelasan
            </button>
          )}

          <div className="flex-1" />

          {currentQ < activeQuiz.questions.length - 1 ? (
            <button
              onClick={() => { setCurrentQ((i) => i + 1); setShowExplanation(false); }}
              disabled={!isAnswered}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm disabled:opacity-40 hover:opacity-90 transition-all btn-glow flex items-center gap-2"
            >
              Lanjut <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={submitQuiz}
              disabled={!allAnswered || submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm disabled:opacity-40 hover:opacity-90 transition-all flex items-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trophy className="w-4 h-4" />}
              Selesai
            </button>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
          {activeQuiz.questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => { setCurrentQ(i); setShowExplanation(false); }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentQ ? "bg-blue-400 w-4" : answers[q.id] ? "bg-emerald-400" : "bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  // Quiz list
  return (
    <div className="max-w-5xl mx-auto pt-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Quiz</h1>
          <p className="text-white/40 text-sm mt-0.5">Uji pemahaman dengan soal AI-generated</p>
        </div>
        <Link
          href="/upload"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm btn-glow"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Generate Quiz
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-white/30" />
        </div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-20">
          <Brain className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Belum ada quiz</h3>
          <p className="text-white/40 text-sm mb-6">Upload materi untuk generate quiz otomatis dengan AI</p>
          <Link href="/upload" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-sm btn-glow">
            <Sparkles className="w-4 h-4" />
            Upload & Generate
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz, i) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="glass rounded-2xl border border-white/[0.06] p-5 hover:border-white/[0.12] transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-blue-400" />
                </div>
                {quiz.subject && (
                  <span className="text-xs px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/10">
                    {quiz.subject}
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-white mb-1 line-clamp-2">{quiz.title}</h3>
              <div className="flex items-center gap-3 text-xs text-white/40 mb-4">
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {quiz.questions.length} soal
                </span>
                {quiz.timeLimit && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {quiz.timeLimit} mnt
                  </span>
                )}
                <span>{quiz._count.attempts}x dikerjakan</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startQuiz(quiz, "PRACTICE")}
                  className="flex-1 py-2 rounded-xl glass border border-white/10 text-white/70 text-xs hover:border-blue-500/30 hover:text-white transition-all flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-3 h-3" />
                  Latihan
                </button>
                <button
                  onClick={() => startQuiz(quiz, "EXAM")}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white text-xs btn-glow flex items-center justify-center gap-1.5"
                >
                  <Trophy className="w-3 h-3" />
                  Ujian
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
