# Lumina AI - Project Structure

```
lumina-ai/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx              # Login form with Google OAuth & credentials
│   │   │   └── register/
│   │   │       └── page.tsx              # Signup form with password strength checker
│   │   │
│   │   ├── (dashboard)/                  # Protected routes (requires auth)
│   │   │   ├── layout.tsx                # Dashboard layout with sidebar + topbar
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx              # Main dashboard with stats & overview
│   │   │   │   └── DashboardClient.tsx   # Client component with animations
│   │   │   ├── ai-tutor/
│   │   │   │   └── page.tsx              # AI chat interface with streaming
│   │   │   ├── upload/
│   │   │   │   └── page.tsx              # File upload with progress
│   │   │   ├── summary/
│   │   │   │   └── page.tsx              # AI-generated summaries
│   │   │   ├── quiz/
│   │   │   │   └── page.tsx              # Quiz list, taking, results
│   │   │   ├── flashcard/
│   │   │   │   └── page.tsx              # Flashcard browser & study mode
│   │   │   ├── bank-soal/
│   │   │   │   └── page.tsx              # Question bank with filters
│   │   │   ├── tryout/
│   │   │   │   └── page.tsx              # Online exam simulation
│   │   │   ├── leaderboard/
│   │   │   │   └── page.tsx              # Rankings & competition
│   │   │   ├── profile/
│   │   │   │   └── page.tsx              # User profile & stats
│   │   │   └── settings/
│   │   │       └── page.tsx              # Settings & preferences
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts          # User registration
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts          # NextAuth handler
│   │   │   ├── chat/
│   │   │   │   ├── route.ts              # List & create chats
│   │   │   │   ├── stream/
│   │   │   │   │   └── route.ts          # AI streaming responses
│   │   │   │   └── [chatId]/
│   │   │   │       └── route.ts          # Chat CRUD operations
│   │   │   ├── quiz/
│   │   │   │   ├── route.ts              # List & create quizzes
│   │   │   │   └── [quizId]/
│   │   │   │       └── attempt/
│   │   │   │           └── route.ts      # Submit quiz & calculate score
│   │   │   ├── flashcard/
│   │   │   │   ├── route.ts              # List & create flashcard sets
│   │   │   │   └── card/
│   │   │   │       └── [cardId]/
│   │   │   │           └── route.ts      # Update card (bookmark, difficulty)
│   │   │   ├── upload/
│   │   │   │   └── route.ts              # File upload to Vercel Blob
│   │   │   ├── summary/
│   │   │   │   └── route.ts              # Generate AI summary
│   │   │   └── progress/
│   │   │       └── leaderboard/
│   │   │           └── route.ts          # Get leaderboard rankings
│   │   │
│   │   ├── globals.css                   # Global styles & design system
│   │   ├── layout.tsx                    # Root layout with auth & toasts
│   │   └── page.tsx                      # Landing page (public)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx               # Navigation sidebar
│   │   │   └── TopBar.tsx                # Top navigation bar
│   │   ├── ui/                           # Shadcn/UI components (button, etc)
│   │   ├── features/                     # Feature-specific components
│   │   └── shared/                       # Reusable components
│   │
│   ├── lib/
│   │   ├── auth.ts                       # NextAuth v5 configuration
│   │   ├── prisma.ts                     # Prisma client singleton
│   │   ├── openai.ts                     # OpenAI utilities & prompts
│   │   └── utils.ts                      # Helper functions (cn, xp, grades, etc)
│   │
│   ├── hooks/                            # Custom React hooks
│   │   └── (to be added)
│   │
│   ├── types/
│   │   └── index.ts                      # TypeScript type definitions
│   │
│   └── styles/                           # Additional CSS modules
│       └── (to be added)
│
├── prisma/
│   ├── schema.prisma                     # Database schema (13 models)
│   └── seed.ts                           # Database seed script (optional)
│
├── public/
│   ├── icons/                            # SVG icons
│   └── images/                           # Hero images, etc
│
├── .env.example                          # Environment variables template
├── .gitignore
├── .eslintrc.json
├── package.json                          # Dependencies & scripts
├── tsconfig.json                         # TypeScript config
├── tailwind.config.ts                    # Tailwind configuration
├── tailwind.config.ts.d.ts               # Tailwind types
├── postcss.config.mjs                    # PostCSS configuration
├── next.config.ts                        # Next.js configuration
├── vercel.json                           # Vercel deployment config
├── README.md                             # Main documentation
└── DEPLOYMENT.md                         # Detailed deployment guide

Total Lines of Code: ~4,500+
Number of Components: 15+
Number of Pages: 15
Database Tables: 13
API Endpoints: 20+
```

## Key Files & Their Purposes

### App Router Structure
- **Layout Groups**: `(auth)` and `(dashboard)` for route organization
- **Dynamic Routes**: `[chatId]`, `[quizId]`, etc for resource pages
- **Protected Routes**: Dashboard requires authentication via middleware

### API Routes Pattern
- RESTful design: GET (list/detail), POST (create), PATCH (update), DELETE (delete)
- Server-side validation with Zod
- Error handling with proper HTTP status codes
- Authentication checks with `auth()` utility

### Database Schema
- 13 Prisma models with proper relationships
- User auth with NextAuth & password hashing
- Document processing with file storage
- Quiz & question management with scoring
- Flashcard with spaced repetition fields
- Chat history with streaming support
- Progress tracking for learning analytics
- Leaderboard with weekly/monthly rankings

### Component Hierarchy
```
RootLayout
├── SessionProvider
├── Toaster
└── Children
    └── DashboardLayout (for /dashboard routes)
        ├── Sidebar (navigation)
        ├── TopBar (search, notifications, user)
        └── Main Content
            ├── Page Component
            ├── Feature Components
            └── Shared Components
```

### Styling System
- **Global Variables**: CSS custom properties for colors
- **Utility Classes**: Tailwind CSS + custom utilities
- **Components**: Shadcn/UI + custom glass/gradient styles
- **Animations**: Framer Motion for page transitions

## Development Workflow

### Adding a New Feature
1. Create page component in `src/app/(dashboard)/feature/page.tsx`
2. Create API endpoint in `src/app/api/feature/route.ts`
3. Add Prisma model to `prisma/schema.prisma` if needed
4. Create types in `src/types/index.ts`
5. Use components from `src/components/` or create new ones
6. Run `npm run build` to check for errors

### Database Changes
1. Update `prisma/schema.prisma`
2. Run `npx prisma db push` for quick prototyping OR `npx prisma migrate dev --name description` for production
3. Regenerate Prisma client: `npx prisma generate`

### Deployment
1. Push to GitHub (or link repo to Vercel)
2. Set environment variables in Vercel dashboard
3. Deploy: `git push origin main` (auto-deploy) or `vercel --prod`
4. Check build logs: `vercel logs`

## Performance Considerations

- **Code Splitting**: Each page is a separate chunk
- **Lazy Loading**: Images optimized with next/image
- **API Caching**: Response caching for leaderboard, etc
- **Database Indexing**: Foreign keys properly indexed
- **Streaming**: AI responses use Server-Sent Events
- **SEO**: Metadata in layout.tsx with OpenGraph

## Testing Strategy

```bash
npm run build          # Build check
npx tsc --noEmit       # Type checking
npm run lint           # Code quality
npm run test           # Unit tests (setup needed)
```

## Notes

- All timestamps use `DateTime` in Prisma (UTC)
- XP system: Level = sqrt(XP / 100) + 1
- Quiz scoring: Points per question × correct answers
- Flashcard difficulty: 0-5 scale for spaced repetition
- Leaderboard: Weekly (Monday) and Monthly aggregation
