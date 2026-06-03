import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const SYSTEM_PROMPTS = {
  tutor: `Kamu adalah Lumina — AI tutor cerdas yang membantu siswa Indonesia belajar dengan cara yang menyenangkan dan efektif.

Prinsip mengajar:
1. Jelaskan konsep dari yang sederhana ke kompleks
2. Gunakan analogi dan contoh nyata yang relevan dengan konteks Indonesia
3. Pecah masalah langkah demi langkah
4. Berikan contoh soal yang relevan
5. Dorong pemikiran kritis, bukan sekadar menghafal
6. Gunakan bahasa yang ramah dan encouraging

Format respons:
- Gunakan markdown untuk formatting yang jelas
- Gunakan emoji secara bijak untuk membuat konten lebih engaging
- Beri tahu sumber belajar tambahan jika relevan
- Selalu tawarkan untuk menjelaskan lebih lanjut`,

  quiz: `Kamu adalah generator soal ujian profesional. Buat soal berkualitas tinggi berdasarkan materi yang diberikan.

Aturan pembuatan soal:
1. Soal harus relevan dengan materi
2. Tingkat kesulitan bervariasi (mudah, sedang, sulit)
3. Pilihan jawaban yang plausible untuk soal pilihan ganda
4. Penjelasan yang jelas untuk setiap jawaban
5. Hindari soal yang ambigu

Format output: JSON yang valid sesuai schema yang diminta.`,

  summary: `Kamu adalah ahli merangkum materi pelajaran. Buat ringkasan yang komprehensif namun ringkas.

Format ringkasan:
1. Poin-poin utama dengan bullet points
2. Definisi konsep kunci
3. Rumus atau formula penting (jika ada)
4. Contoh penerapan
5. Tips mengingat (mnemonik jika relevan)

Gunakan bahasa yang jelas dan mudah dipahami siswa Indonesia.`,

  flashcard: `Kamu adalah pembuat flashcard pembelajaran. Buat flashcard yang efektif untuk spaced repetition.

Aturan:
1. Pertanyaan (front) harus spesifik dan jelas
2. Jawaban (back) harus singkat dan padat
3. Fokus pada satu konsep per kartu
4. Variasikan jenis pertanyaan: definisi, contoh, aplikasi
5. Hindari kartu yang terlalu panjang

Format output: JSON array flashcard.`,
};

export async function generateQuizFromContent(
  content: string,
  options: {
    count?: number;
    difficulty?: string;
    types?: string[];
    subject?: string;
  } = {}
) {
  const { count = 10, difficulty = "mixed", types = ["MULTIPLE_CHOICE"], subject = "" } = options;

  const prompt = `Buat ${count} soal ${subject ? `mata pelajaran ${subject}` : ""} berdasarkan materi berikut.

Tingkat kesulitan: ${difficulty}
Jenis soal: ${types.join(", ")}

MATERI:
${content.slice(0, 4000)}

Kembalikan HANYA JSON array dengan format berikut (tanpa markdown):
[
  {
    "type": "MULTIPLE_CHOICE|TRUE_FALSE|SHORT_ANSWER",
    "text": "Teks soal",
    "options": [
      {"id": "a", "text": "Pilihan A", "isCorrect": false},
      {"id": "b", "text": "Pilihan B", "isCorrect": true},
      {"id": "c", "text": "Pilihan C", "isCorrect": false},
      {"id": "d", "text": "Pilihan D", "isCorrect": false}
    ],
    "correctAnswer": "b",
    "explanation": "Penjelasan mengapa jawaban ini benar",
    "points": 10
  }
]

Untuk TRUE_FALSE, options berisi [{"id":"true","text":"Benar"},{"id":"false","text":"Salah"}]
Untuk SHORT_ANSWER, options = null dan correctAnswer = jawaban singkat`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPTS.quiz },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const raw = response.choices[0].message.content || "[]";
  try {
    return JSON.parse(raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
  } catch {
    return [];
  }
}

export async function generateFlashcardsFromContent(
  content: string,
  count = 15
) {
  const prompt = `Buat ${count} flashcard dari materi berikut.

MATERI:
${content.slice(0, 4000)}

Kembalikan HANYA JSON array (tanpa markdown):
[
  {
    "front": "Pertanyaan atau konsep",
    "back": "Jawaban atau penjelasan",
    "hint": "Petunjuk opsional"
  }
]`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPTS.flashcard },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
    max_tokens: 3000,
  });

  const raw = response.choices[0].message.content || "[]";
  try {
    return JSON.parse(raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim());
  } catch {
    return [];
  }
}

export async function summarizeContent(content: string, title?: string) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPTS.summary },
      {
        role: "user",
        content: `Buat ringkasan komprehensif dari materi berikut${title ? ` (${title})` : ""}:\n\n${content.slice(0, 6000)}`,
      },
    ],
    temperature: 0.5,
    max_tokens: 2000,
  });

  return response.choices[0].message.content || "";
}
