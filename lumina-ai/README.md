# 🎓 Lumina AI - Platform EdTech Berbasis AI

Platform belajar modern dengan AI Tutor, Quiz Generator, Flashcard, Bank Soal, dan Tryout Online untuk siswa SMP, SMA, mahasiswa, dan guru.

## 🌟 Fitur Utama

- **AI Tutor** - Chat real-time dengan AI yang menjelaskan materi step-by-step
- **Upload Materi** - Support PDF, DOCX, PPTX, TXT, gambar, YouTube URL
- **Ringkasan Otomatis** - AI generate ringkasan materi dalam hitungan detik
- **Quiz Generator** - Buat soal (pilihan ganda, benar/salah, isian) dari materi apapun
- **Flashcard Pintar** - Belajar dengan spaced repetition dan flip animation
- **Bank Soal** - 1 juta+ soal terverifikasi dari berbagai mapel
- **Tryout Online** - Simulasi ujian lengkap dengan timer dan analisis
- **Leaderboard** - Kompetisi mingguan dan bulanan dengan XP system
- **Dashboard Progress** - Tracking pembelajaran real-time dengan visualisasi

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/UI
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Markdown**: React Markdown + Remark GFM

### Backend
- **Runtime**: Node.js (Next.js Server Actions)
- **API**: Next.js Route Handlers
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js v5
- **File Storage**: Vercel Blob
- **AI**: OpenAI API (GPT-4o Mini)

### DevOps
- **Deployment**: Vercel
- **Database Hosting**: Vercel Postgres atau Railway
- **Environment**: Node.js 20+

## 📋 Prerequisites

- Node.js 20+ dan npm/pnpm
- PostgreSQL database (lokal atau cloud)
- OpenAI API key
- Google OAuth credentials (opsional)
- Vercel account (untuk Blob storage & deployment)

## 🚀 Instalasi & Setup Lokal

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/lumina-ai.git
cd lumina-ai
```

### 2. Install Dependencies
```bash
npm install
# atau
pnpm install
```

### 3. Setup Environment Variables
```bash
cp .env.example .env.local
```

Edit `.env.local` dan isi:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lumina_ai"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-min-32-chars"

# OAuth Google
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxx"

# OpenAI
OPENAI_API_KEY="sk-xxx"

# Vercel Blob (opsional untuk lokal development)
BLOB_READ_WRITE_TOKEN="xxx"
```

### 4. Setup Database

#### Option A: PostgreSQL Lokal
```bash
# Create database
createdb lumina_ai

# Update DATABASE_URL di .env.local
# DATABASE_URL="postgresql://postgres:password@localhost:5432/lumina_ai"
```

#### Option B: PostgreSQL Cloud (Railway/Vercel Postgres)
1. Buat project di [Railway](https://railway.app) atau [Vercel Postgres](https://vercel.com/postgres)
2. Copy connection string ke `.env.local`

### 5. Setup Prisma & Database
```bash
# Generate Prisma client
npx prisma generate

# Push schema ke database
npx prisma db push

# (Opsional) Buka Prisma Studio
npx prisma studio
```

### 6. Jalankan Development Server
```bash
npm run dev
```

Akses di `http://localhost:3000`

## 🌐 Deploy ke Vercel

### Prerequisites
- Vercel account
- GitHub repo (terhubung ke Vercel)
- PostgreSQL database (Railway, Vercel Postgres, atau cloud lainnya)

### Step-by-Step

#### 1. Push Code ke GitHub
```bash
git add .
git commit -m "Initial commit: Lumina AI EdTech Platform"
git push origin main
```

#### 2. Create Vercel Project
```bash
npm i -g vercel
vercel
# Follow the prompts - link to your GitHub repo
```

Atau langsung di [Vercel Dashboard](https://vercel.com/dashboard):
1. Click "Add New" → "Project"
2. Import GitHub repository
3. Select Lumina AI repo

#### 3. Configure Environment Variables di Vercel
Di Vercel Dashboard → Project Settings → Environment Variables, tambahkan:

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key-min-32-chars
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
OPENAI_API_KEY=sk-xxx
BLOB_READ_WRITE_TOKEN=xxx
```

#### 4. Deploy
```bash
# Push deployment
vercel --prod

# Or push to GitHub dan auto-deploy via Vercel
git push origin main
```

Vercel akan otomatis:
- Build Next.js
- Run `npm run build` (yang include `prisma generate` dan `next build`)
- Deploy ke serverless functions

#### 5. Verify Deployment
```bash
# Check build logs
vercel logs

# Test endpoints
curl https://your-domain.vercel.app/api/auth/signin
```

## 📁 Struktur Folder

```
lumina-ai/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth pages (layout group)
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/        # Dashboard pages (protected)
│   │   │   ├── dashboard/
│   │   │   ├── ai-tutor/
│   │   │   ├── quiz/
│   │   │   ├── flashcard/
│   │   │   ├── bank-soal/
│   │   │   ├── tryout/
│   │   │   ├── leaderboard/
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   ├── api/                # API Routes
│   │   │   ├── auth/
│   │   │   ├── chat/
│   │   │   ├── quiz/
│   │   │   ├── flashcard/
│   │   │   ├── upload/
│   │   │   ├── summary/
│   │   │   └── progress/
│   │   ├── globals.css         # Global styles & design system
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Landing page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   ├── ui/                 # Shadcn UI components
│   │   ├── features/           # Feature components
│   │   └── shared/             # Shared components
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── prisma.ts          # Prisma client
│   │   ├── openai.ts          # OpenAI utilities
│   │   └── utils.ts           # Helper functions
│   ├── hooks/                 # Custom React hooks
│   ├── types/                 # TypeScript types
│   └── styles/                # Additional styles
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── public/                    # Static assets
├── .env.example              # Environment template
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── postcss.config.mjs
├── vercel.json
└── README.md
```

## 📚 Database Schema

### Key Models
- **User** - Siswa, guru, admin
- **Document** - Materi upload (PDF, DOCX, dll)
- **Quiz** - Kumpulan soal
- **Question** - Soal individual
- **Flashcard** - Kartu pembelajaran
- **Chat** - Percakapan dengan AI Tutor
- **Message** - Pesan dalam chat
- **QuizAttempt** - Hasil pengerjaan quiz
- **Progress** - Tracking pembelajaran
- **Leaderboard** - Ranking pengguna
- **BankQuestion** - Bank soal publik

Full schema: `prisma/schema.prisma`

## 🔐 Authentication Flow

1. **Signup** → Hash password + create user + create leaderboard entry
2. **Login** → Credential atau Google OAuth
3. **Session** → JWT token via NextAuth
4. **Protected Routes** → Middleware checks session
5. **API Auth** → `auth()` utility di server actions/API

## 🎨 Design System

### Colors
- **Primary**: Electric Blue (#3b82f6)
- **Secondary**: Violet (#8b5cf6)
- **Accent**: Cyan (#06b6d4)
- **Background**: Dark (#050810)
- **Surface**: Darker (#070d1a)

### Components
- Glassmorphism cards
- Gradient text & buttons
- Smooth animations (Framer Motion)
- Responsive mobile-first
- Light mode ready (dark: dark preset)

## 🚀 Performance Tips

### Frontend
- Image optimization (Next.js Image)
- Code splitting (Route-based)
- Lazy loading components
- Memoization untuk heavy components

### Backend
- Database query optimization (Prisma select)
- API response caching
- Streaming untuk chat (Server-Sent Events)
- Rate limiting di API

### Deployment
- Vercel's automatic optimizations
- CDN caching
- Edge Functions support

## 🧪 Testing

```bash
# Unit tests (setup required)
npm run test

# Build check
npm run build

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

## 📖 API Documentation

### Chat Endpoints
```
GET    /api/chat              - List user's chats
POST   /api/chat              - Create new chat
GET    /api/chat/[chatId]     - Get chat with messages
PATCH  /api/chat/[chatId]     - Update chat title
DELETE /api/chat/[chatId]     - Delete chat
POST   /api/chat/stream       - Stream AI response
```

### Quiz Endpoints
```
GET    /api/quiz              - List quizzes
POST   /api/quiz              - Create quiz
POST   /api/quiz/[quizId]/attempt - Submit quiz attempt
```

### Flashcard Endpoints
```
GET    /api/flashcard         - List flashcard sets
POST   /api/flashcard         - Create flashcard set
PATCH  /api/flashcard/card/[cardId] - Update card
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file

## 🆘 Troubleshooting

### Database Connection Error
```bash
# Check DATABASE_URL format
# postgresql://user:password@host:5432/dbname

# Test connection
npx prisma db execute --stdin < /dev/null
```

### Prisma Schema Issues
```bash
# Reset database (WARNING: loses data)
npx prisma migrate reset

# Check for schema drift
npx prisma migrate dev --name init
```

### Build Errors
```bash
# Clear cache
rm -rf .next
npm run build

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading
- Make sure `.env.local` exists
- Vercel: double-check Environment Variables in Settings
- Restart dev server after changing .env.local

## 📞 Support

- Issues: GitHub Issues
- Email: support@lumina-ai.app
- Discord: [Join Community](https://discord.gg/lumina-ai)

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Video learning content
- [ ] Live classes integration
- [ ] AI homework checker
- [ ] Adaptive learning paths
- [ ] Social collaboration features
- [ ] Advanced analytics for teachers
- [ ] Offline mode

---

**Built with ❤️ for Indonesian students** 🇮🇩

Lumina AI - Belajar Lebih Cerdas, Raih Nilai Terbaik ✨
