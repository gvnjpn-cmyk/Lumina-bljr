"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Send, Paperclip, Plus, Trash2, Sparkles,
  FileText, Image as ImageIcon, X, ChevronDown,
  BookOpen, Calculator, Globe, Microscope, Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatRelativeTime } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface Chat {
  id: string;
  title: string;
  updatedAt: Date;
}

const SUBJECT_STARTERS = [
  { icon: Calculator, label: "Matematika", prompt: "Jelaskan konsep turunan fungsi dan cara menggunakannya" },
  { icon: Microscope, label: "Sains", prompt: "Apa perbedaan mitosis dan meiosis?" },
  { icon: Globe, label: "Sejarah", prompt: "Ceritakan tentang peristiwa G30S/PKI secara detail" },
  { icon: BookOpen, label: "Bahasa", prompt: "Apa perbedaan kalimat aktif dan pasif? Berikan contoh" },
];

export default function AITutorPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  async function loadChats() {
    try {
      const res = await fetch("/api/chat");
      const data = await res.json();
      setChats(data);
    } catch {
      console.error("Failed to load chats");
    } finally {
      setLoadingChats(false);
    }
  }

  async function loadMessages(chatId: string) {
    const res = await fetch(`/api/chat/${chatId}`);
    const data = await res.json();
    setMessages(data.messages || []);
    setCurrentChatId(chatId);
  }

  async function createNewChat() {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Chat" }),
    });
    const chat = await res.json();
    setChats((prev) => [chat, ...prev]);
    setCurrentChatId(chat.id);
    setMessages([]);
  }

  async function deleteChat(chatId: string, e: React.MouseEvent) {
    e.stopPropagation();
    await fetch(`/api/chat/${chatId}`, { method: "DELETE" });
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  }

  async function sendMessage(content?: string) {
    const text = content || input.trim();
    if (!text || streaming) return;

    let chatId = currentChatId;
    if (!chatId) {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: text.slice(0, 50) }),
      });
      const chat = await res.json();
      chatId = chat.id;
      setCurrentChatId(chatId);
      setChats((prev) => [chat, ...prev]);
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStreaming(true);

    // Add placeholder AI message
    const aiMsgId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: aiMsgId, role: "assistant", content: "", createdAt: new Date() },
    ]);

    try {
      const res = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, message: text }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                fullContent += parsed.content;
                setMessages((prev) =>
                  prev.map((m) => (m.id === aiMsgId ? { ...m, content: fullContent } : m))
                );
              }
            } catch {}
          }
        }
      }

      // Update chat title if it's the first message
      if (chats.find((c) => c.id === chatId)?.title === "New Chat") {
        await fetch(`/api/chat/${chatId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: text.slice(0, 60) }),
        });
        setChats((prev) =>
          prev.map((c) => (c.id === chatId ? { ...c, title: text.slice(0, 60) } : c))
        );
      }
    } catch {
      toast.error("Gagal mengirim pesan. Coba lagi.");
      setMessages((prev) => prev.filter((m) => m.id !== aiMsgId));
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function autoResize() {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 200) + "px";
    }
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] -mt-4 md:mt-0 -mx-4 md:-mx-6 overflow-hidden">
      {/* Chat history sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-white/[0.06] flex flex-col overflow-hidden hidden md:flex"
          >
            <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
              <span className="text-sm font-semibold text-white/70">Riwayat Chat</span>
              <button
                onClick={createNewChat}
                className="w-7 h-7 rounded-lg glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {loadingChats ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-5 h-5 animate-spin text-white/30" />
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center py-8 text-white/30 text-sm">
                  Belum ada chat
                </div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => loadMessages(chat.id)}
                    className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all mb-1 ${
                      currentChatId === chat.id
                        ? "bg-blue-500/10 border border-blue-500/20"
                        : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <Bot className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-white/80 truncate">{chat.title}</div>
                      <div className="text-[10px] text-white/30">{formatRelativeTime(chat.updatedAt)}</div>
                    </div>
                    <button
                      onClick={(e) => deleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#050810]">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.06] glass">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Lumina AI Tutor</div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-white/40">Online · GPT-4o powered</span>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={createNewChat}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl glass border border-white/10 text-white/50 hover:text-white transition-colors"
            >
              <Plus className="w-3 h-3" />
              Chat Baru
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {messages.length === 0 && !currentChatId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center px-4"
            >
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-violet-600/20 border border-blue-500/10 flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Halo! Saya Lumina 👋</h2>
              <p className="text-white/50 text-sm mb-8 max-w-md">
                AI tutor yang siap membantu kamu belajar apa saja. Tanya pelajaran sekolah, kuliah, atau konsep yang kamu bingung.
              </p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                {SUBJECT_STARTERS.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => sendMessage(s.prompt)}
                    className="flex items-center gap-2.5 px-4 py-3 rounded-xl glass border border-white/[0.08] text-left hover:border-blue-500/30 transition-all group"
                  >
                    <s.icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-white">{s.label}</div>
                      <div className="text-[10px] text-white/40 line-clamp-1">{s.prompt.slice(0, 30)}...</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl rounded-tr-sm px-4 py-3"
                    : "glass border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-3"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="text-sm text-white/80 prose prose-invert prose-sm max-w-none">
                    {msg.content === "" && streaming ? (
                      <div className="flex items-center gap-1.5 py-1">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                          />
                        ))}
                      </div>
                    ) : (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ children, className }) {
                            const isInline = !className;
                            return isInline ? (
                              <code className="bg-white/10 px-1.5 py-0.5 rounded text-blue-300 text-xs font-mono">
                                {children}
                              </code>
                            ) : (
                              <pre className="bg-black/40 rounded-xl p-4 overflow-x-auto border border-white/10">
                                <code className="text-xs font-mono text-white/80">{children}</code>
                              </pre>
                            );
                          },
                          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
                          h3: ({ children }) => <h3 className="font-semibold text-white mt-3 mb-1">{children}</h3>,
                          strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white">
                  U
                </div>
              )}
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-white/[0.06] glass">
          {attachedFile && (
            <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-white/70 flex-1 truncate">{attachedFile.name}</span>
              <button onClick={() => setAttachedFile(null)} className="text-white/40 hover:text-white/70">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-end gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-9 h-9 rounded-xl glass border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors flex-shrink-0"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.txt,image/*"
              className="hidden"
              onChange={(e) => setAttachedFile(e.target.files?.[0] || null)}
            />

            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); autoResize(); }}
                onKeyDown={handleKeyDown}
                placeholder="Tanya apa saja... (Enter untuk kirim, Shift+Enter baris baru)"
                rows={1}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/40 resize-none transition-all"
                style={{ minHeight: 44, maxHeight: 200 }}
              />
            </div>

            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || streaming}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white flex-shrink-0 disabled:opacity-40 hover:opacity-90 transition-all btn-glow"
            >
              {streaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-white/20 text-center mt-2">
            Lumina AI dapat membuat kesalahan. Verifikasi informasi penting.
          </p>
        </div>
      </div>
    </div>
  );
}
