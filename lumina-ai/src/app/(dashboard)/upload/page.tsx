"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, File, Image as ImageIcon, Globe,
  Loader2, Check, X, Sparkles, Zap, BookOpen,
  Brain, Lightbulb, Plus, Trash2, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

const UPLOAD_TYPES = [
  { type: "PDF", icon: FileText, color: "from-red-500 to-red-600" },
  { type: "DOCX", icon: File, color: "from-blue-500 to-blue-600" },
  { type: "PPTX", icon: File, color: "from-orange-500 to-orange-600" },
  { type: "Image", icon: ImageIcon, color: "from-purple-500 to-purple-600" },
  { type: "YouTube", icon: Globe, color: "from-red-500 to-red-600" },
];

const PROCESSING_STEPS = [
  { step: 1, title: "Upload", desc: "File disimpan ke cloud" },
  { step: 2, title: "Extract", desc: "Ekstrak teks & gambar" },
  { step: 3, title: "Summarize", desc: "AI buat ringkasan" },
  { step: 4, title: "Quiz", desc: "Generate soal otomatis" },
  { step: 5, title: "Flashcard", desc: "Buat kartu pembelajaran" },
];

export default function UploadPage() {
  const [files, setFiles] = useState<
    { id: string; name: string; progress: number; status: "uploading" | "processing" | "done"; error?: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList) {
    const newFiles = Array.from(fileList);
    setUploading(true);

    for (const file of newFiles) {
      const id = Date.now() + Math.random().toString();
      const newFile = {
        id,
        name: file.name,
        progress: 0,
        status: "uploading" as const,
      };

      setFiles((prev) => [...prev, newFile]);

      try {
        // Simulate upload
        for (let i = 0; i <= 100; i += 10) {
          await new Promise((r) => setTimeout(r, 100));
          setFiles((prev) =>
            prev.map((f) => (f.id === id ? { ...f, progress: i } : f))
          );
        }

        // Processing
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: "processing" } : f))
        );
        await new Promise((r) => setTimeout(r, 2000));

        // Done
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, status: "done", progress: 100 } : f))
        );

        toast.success(`${file.name} berhasil diupload & diproses!`);
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id
              ? { ...f, status: "uploading", error: "Upload gagal" }
              : f
          )
        );
        toast.error(`Gagal mengupload ${file.name}`);
      }
    }

    setUploading(false);
  }

  function handleDrag(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }

  return (
    <div className="max-w-4xl mx-auto pt-2">
      <h1 className="text-3xl font-bold text-white mb-2">Upload Materi</h1>
      <p className="text-white/40 mb-8">
        Upload PDF, DOCX, PPTX, atau gambar — AI akan otomatis membuat ringkasan, quiz, dan flashcard
      </p>

      {/* Upload area */}
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        animate={{ scale: dragActive ? 1.02 : 1 }}
        className={`relative rounded-3xl border-2 border-dashed p-12 text-center cursor-pointer transition-all mb-8 ${
          dragActive
            ? "border-blue-400 bg-blue-500/5"
            : "border-white/20 bg-white/[0.02] hover:border-blue-400/50 hover:bg-blue-500/[0.02]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
          accept=".pdf,.docx,.pptx,.txt,.jpg,.jpeg,.png"
        />

        <Upload
          className={`w-16 h-16 mx-auto mb-4 transition-all ${
            dragActive ? "text-blue-400 scale-110" : "text-white/40"
          }`}
        />

        <h3 className="text-xl font-bold text-white mb-1">Drop file di sini</h3>
        <p className="text-white/40 text-sm mb-6">atau klik untuk memilih file</p>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium btn-glow hover:opacity-90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Pilih File
        </button>

        <p className="text-xs text-white/30 mt-6">
          Ukuran maksimal 50MB · Format: PDF, DOCX, PPTX, TXT, JPG, PNG
        </p>
      </motion.div>

      {/* Upload types */}
      <div className="mb-12">
        <h2 className="text-sm font-semibold text-white/50 mb-4 uppercase tracking-wider">
          Format yang didukung
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {UPLOAD_TYPES.map((t) => (
            <div
              key={t.type}
              className="rounded-2xl glass border border-white/[0.06] p-4 text-center hover:border-white/[0.12] transition-all"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} p-0.5 mb-2 mx-auto`}
              >
                <div className="w-full h-full rounded-xl bg-[#070d1a] flex items-center justify-center">
                  <t.icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="text-xs font-medium text-white">{t.type}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Processing steps */}
      <div className="mb-12">
        <h2 className="text-sm font-semibold text-white/50 mb-4 uppercase tracking-wider">
          Proses otomatis
        </h2>
        <div className="space-y-2">
          {PROCESSING_STEPS.map((item, i) => (
            <div key={item.step} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400">
                {item.step}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">{item.title}</div>
                <div className="text-xs text-white/40">{item.desc}</div>
              </div>
              {i < PROCESSING_STEPS.length - 1 && (
                <ChevronRight className="w-4 h-4 text-white/20" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upload queue */}
      {files.length > 0 && (
        <div className="mb-12">
          <h2 className="text-sm font-semibold text-white/50 mb-4 uppercase tracking-wider">
            Riwayat upload
          </h2>
          <div className="space-y-3">
            <AnimatePresence>
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="glass rounded-2xl border border-white/[0.06] p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        {file.status === "uploading" && "Mengupload..."}
                        {file.status === "processing" && "Memproses..."}
                        {file.status === "done" && "Selesai"}
                      </div>
                    </div>
                    {file.status === "done" ? (
                      <Check className="w-5 h-5 text-emerald-400" />
                    ) : file.error ? (
                      <X className="w-5 h-5 text-red-400" />
                    ) : (
                      <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: `${file.progress}%` }}
                      className={`h-full ${
                        file.status === "done"
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                          : file.status === "processing"
                          ? "bg-gradient-to-r from-violet-500 to-purple-500"
                          : "bg-gradient-to-r from-blue-500 to-cyan-500"
                      } rounded-full`}
                    />
                  </div>

                  {file.status === "done" && (
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg glass border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 transition-all">
                        <BookOpen className="w-3.5 h-3.5" />
                        Lihat Ringkasan
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg glass border border-violet-500/20 text-violet-400 hover:bg-violet-500/10 transition-all">
                        <Brain className="w-3.5 h-3.5" />
                        Quiz
                      </button>
                      <button className="w-9 h-9 rounded-lg glass border border-white/10 text-white/40 hover:text-red-400 hover:border-red-500/30 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Features grid */}
      {files.length === 0 && (
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Sparkles, title: "AI Ringkasan", desc: "Komprehensif namun ringkas" },
            { icon: Brain, title: "Quiz Otomatis", desc: "Soal berkualitas dari AI" },
            { icon: Lightbulb, title: "Flashcard", desc: "Belajar efisien & cepat" },
          ].map((feature) => (
            <div
              key={feature.title}
              className="glass rounded-2xl border border-white/[0.06] p-5 hover:border-blue-500/20 transition-all"
            >
              <feature.icon className="w-8 h-8 text-blue-400 mb-3" />
              <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-sm text-white/40">{feature.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
