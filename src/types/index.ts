import type { User, Document, Quiz, Question, Flashcard, FlashcardSet, Chat, Message, Progress, Leaderboard, BankQuestion } from "@prisma/client";

export type { User, Document, Quiz, Question, Flashcard, FlashcardSet, Chat, Message, Progress, Leaderboard, BankQuestion };

export type UserWithStats = User & {
  _count: {
    documents: number;
    quizAttempts: number;
    chats: number;
  };
  leaderboard: Leaderboard | null;
};

export type QuizWithQuestions = Quiz & {
  questions: Question[];
  _count: { attempts: number };
};

export type FlashcardSetWithCards = FlashcardSet & {
  cards: Flashcard[];
  _count: { cards: number };
};

export type ChatWithMessages = Chat & {
  messages: Message[];
};

export type DocumentWithRelations = Document & {
  _count: {
    quizzes: number;
  };
  flashcardSet: { _count: { cards: number } } | null;
};

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizResult {
  score: number;
  totalPoints: number;
  correctCount: number;
  totalCount: number;
  timeTaken: number;
  answers: {
    questionId: string;
    answer: string;
    isCorrect: boolean;
    pointsEarned: number;
  }[];
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: { name: string; url: string; type: string }[];
  createdAt: Date;
}

export interface UploadedFile {
  name: string;
  url: string;
  size: number;
  type: string;
}

export interface DashboardStats {
  totalDocuments: number;
  totalQuizAttempts: number;
  averageScore: number;
  currentStreak: number;
  totalXP: number;
  level: number;
  recentActivity: ActivityItem[];
  weeklyProgress: WeeklyProgress[];
}

export interface ActivityItem {
  id: string;
  type: string;
  title: string;
  score?: number;
  createdAt: Date;
}

export interface WeeklyProgress {
  day: string;
  quizzes: number;
  flashcards: number;
  minutes: number;
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  description?: string;
}

export type SubjectColor = {
  bg: string;
  text: string;
  border: string;
  glow: string;
};

export const SUBJECT_COLORS: Record<string, SubjectColor> = {
  Matematika: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    glow: "shadow-blue-500/20",
  },
  Fisika: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/20",
    glow: "shadow-violet-500/20",
  },
  Kimia: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    glow: "shadow-cyan-500/20",
  },
  Biologi: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/20",
  },
  "Bahasa Indonesia": {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    glow: "shadow-red-500/20",
  },
  "Bahasa Inggris": {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
    glow: "shadow-orange-500/20",
  },
  Sejarah: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/20",
    glow: "shadow-yellow-500/20",
  },
  Geografi: {
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    border: "border-teal-500/20",
    glow: "shadow-teal-500/20",
  },
};

export const GRADE_OPTIONS = [
  "SMP Kelas 7",
  "SMP Kelas 8",
  "SMP Kelas 9",
  "SMA Kelas 10",
  "SMA Kelas 11",
  "SMA Kelas 12",
  "Mahasiswa S1",
  "Mahasiswa S2",
  "Guru / Pengajar",
  "Umum",
];

export const SUBJECT_OPTIONS = [
  "Matematika",
  "Fisika",
  "Kimia",
  "Biologi",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "Sejarah",
  "Geografi",
  "Ekonomi",
  "Sosiologi",
  "PKn",
  "Informatika",
  "Seni Budaya",
  "Pendidikan Agama",
  "Lainnya",
];
