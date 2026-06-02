# Lumina AI - Deployment Guide

Panduan lengkap untuk deploy Lumina AI ke production dengan Vercel, PostgreSQL, dan OpenAI.

## Prerequisites

Pastikan kamu punya:
- Node.js 20+ dan npm
- Account Vercel (gratis: vercel.com)
- Account PostgreSQL (Railway/Vercel Postgres/Supabase)
- Account OpenAI dengan API key (platform.openai.com)
- Account Google untuk OAuth (console.cloud.google.com)
- GitHub repository dengan kode

## Step-by-Step Deployment

### Phase 1: Persiapan Awal

#### 1.1 Database Setup (Railway atau Vercel Postgres)

**Option A: Railway (Recommended untuk Indonesia)**

1. Buka https://railway.app dan login/signup
2. Create New Project → Add PostgreSQL
3. Klik PostgreSQL, copy CONNECTION_STRING dari Environment
4. Format: `postgresql://user:password@host:port/dbname`

**Option B: Vercel Postgres**

1. Buka Vercel Dashboard → Storage
2. Create → Postgres
3. Copy `POSTGRES_URL_NON_POOLING` (untuk Prisma)

**Option C: Supabase**

1. Create project di supabase.com
2. Copy connection string dari Project Settings

#### 1.2 Environment Variables Disiapkan

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth (Generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="xxxxx-random-secret-min-32-chars"
NEXTAUTH_URL="https://yourdomain.vercel.app"

# Google OAuth (dari Google Cloud Console)
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxx"

# OpenAI
OPENAI_API_KEY="sk-xxx"

# Vercel Blob (dari Vercel dashboard)
BLOB_READ_WRITE_TOKEN="xxx"
```

#### 1.3 Local Testing (Optional but Recommended)

```bash
# Setup database locally
createdb lumina_ai
export DATABASE_URL="postgresql://user:password@localhost:5432/lumina_ai"

# Install deps
npm install

# Run migrations
npx prisma db push

# Test locally
npm run dev
# Akses http://localhost:3000
```

### Phase 2: GitHub & Vercel Connection

#### 2.1 Push ke GitHub

```bash
# Initialize git jika belum
git init
git add .
git commit -m "Initial commit: Lumina AI EdTech Platform"

# Tambah remote (ganti dengan repo mu)
git remote add origin https://github.com/yourusername/lumina-ai.git
git branch -M main
git push -u origin main
```

#### 2.2 Connect ke Vercel

**Cara 1: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
# Follow prompts, link GitHub repo

# Deploy to production
vercel --prod
```

**Cara 2: Via Vercel Dashboard (UI)**

1. Buka https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select GitHub repository (Lumina AI)
4. Configure project:
   - Framework: Next.js (auto-detected)
   - Root Directory: ./ (default)
   - Build Command: `npm run build`
   - Output Directory: .next

5. Click "Deploy"

### Phase 3: Environment Variables di Vercel

1. **Vercel Dashboard** → Project Settings → Environment Variables
2. Tambahkan semua variables dari `.env.example`:

```
DATABASE_URL = postgresql://...
NEXTAUTH_URL = https://yourdomain.vercel.app  
NEXTAUTH_SECRET = (generate: openssl rand -base64 32)
GOOGLE_CLIENT_ID = xxx
GOOGLE_CLIENT_SECRET = xxx
OPENAI_API_KEY = sk-xxx
BLOB_READ_WRITE_TOKEN = xxx
```

3. Pilih environments: Production, Preview, Development (opsional)
4. Click Save

### Phase 4: Database Migration

```bash
# Di lokal, setup database
npm run db:push

# Atau dengan Vercel
vercel env pull .env.production.local
npm run db:push
```

Vercel akan otomatis:
- Jalankan `prisma generate`
- Generate Prisma client
- Siap untuk API calls

### Phase 5: Redeploy & Test

```bash
# Trigger redeploy dengan env variables
vercel --prod

# Atau push ke GitHub (auto-trigger)
git push origin main
```

**Check Status:**
```bash
# View logs
vercel logs

# Test endpoints
curl https://yourdomain.vercel.app/api/auth/signin
```

### Phase 6: Post-Deployment Verification

- [ ] Landing page accessible: https://yourdomain.vercel.app
- [ ] Login page works: https://yourdomain.vercel.app/login
- [ ] Can register new account
- [ ] Google OAuth login works
- [ ] Dashboard loads after login
- [ ] AI Tutor responds with streaming
- [ ] File upload works
- [ ] Quiz generation works
- [ ] Database connected (check Prisma Studio if enabled)

## Database Management

### Prisma Studio (Web UI untuk Database)

```bash
# Local
npx prisma studio

# Production (dengan env)
vercel env pull .env.production.local
npx prisma studio
```

Akses di http://localhost:5555

### Database Backups

**Railway:**
- Settings → Environment → Backups (otomatis daily)

**Vercel Postgres:**
- Managed by Vercel (3 backups retained)

**Manual Backup:**
```bash
# Export data
pg_dump $DATABASE_URL > backup.sql

# Restore
psql $DATABASE_URL < backup.sql
```

## Custom Domain Setup

### 1. Beli Domain

- Vercel Domains
- Nameheap
- Cloudflare
- Niaga Hoster
- dll

### 2. Connect Domain ke Vercel

**Vercel Domains:**
1. Vercel Dashboard → Project Settings → Domains
2. Click "Add" → "Buy on Vercel"
3. Checkout & done!

**Third-Party Domains:**
1. Vercel Dashboard → Domains
2. Add domain
3. Update nameservers di registrar
4. Vercel akan verify

### 3. Update Environment

```env
NEXTAUTH_URL="https://yourdomain.com"
```

## Monitoring & Analytics

### Vercel Analytics

```bash
# Already enabled - check Vercel Dashboard
# Real User Monitoring (RUM) shows:
# - Page load times
# - Core Web Vitals
# - Error rates
```

### Database Monitoring

**Railway:**
- Metrics tab: CPU, Memory, Connections
- Logs tab: Query logs & errors

**Vercel Postgres:**
- Vercel Dashboard → Storage
- View query insights & performance

## Troubleshooting

### Build Fails

```bash
# Check build locally
npm run build

# Common issues:
# 1. TypeScript errors
npx tsc --noEmit

# 2. Missing env variables
# - Check .env.example vs .env in Vercel

# 3. Prisma issues
rm -rf node_modules .next
npm install
npm run build
```

### Database Connection Errors

```bash
# Test connection
echo "SELECT 1;" | psql $DATABASE_URL

# Check format:
# postgresql://[user[:password]@][netloc][:port][/dbname][?param1=value1&...]

# Vercel Postgres: add ?sslmode=require for security
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

### API Errors

**Check logs:**
```bash
vercel logs

# Real-time logs
vercel logs --follow
```

**Common API Issues:**
- 401: Missing/invalid auth → Check NEXTAUTH_SECRET
- 500: OpenAI error → Check OPENAI_API_KEY & quota
- 413: Payload too large → File > 10MB atau wrong body size
- CORS error → Update NEXTAUTH_URL

### Streaming Not Working

```javascript
// Check response headers
curl -i https://yourdomain.vercel.app/api/chat/stream

// Should see:
// Content-Type: text/event-stream
// Cache-Control: no-cache
```

## Scaling & Performance

### Optimize for Growth

1. **Database**
   - Add indexes: `@@index([userId])`
   - Use pagination: `take: 20, skip: 0`
   - Archive old data quarterly

2. **Vercel**
   - Pro Plan for more concurrency
   - Edge Functions for global latency
   - ISR (Incremental Static Regeneration)

3. **Storage**
   - Cleanup old Blob files
   - Compress images before upload
   - Implement CDN caching

### Database Scaling Path

- **Starter**: Railway ($5/mo) ✓ Current
- **Growth**: Railway + read replicas
- **Enterprise**: Dedicated PostgreSQL cluster (AWS RDS, etc)

## Security Checklist

- [ ] HTTPS enabled (Vercel default)
- [ ] Environment variables not in code
- [ ] Password hashed (bcryptjs)
- [ ] CSRF protection (NextAuth)
- [ ] Rate limiting added to APIs
- [ ] Database backups enabled
- [ ] SSL certificate valid
- [ ] Regular updates: `npm audit && npm update`

## Cost Estimation

**Monthly Costs (rough):**
- Vercel: $20-100 (Pro plan recommended)
- Database: $10-20 (Railway starter)
- OpenAI: $10-50 (usage-based)
- Domain: $2-15
- **Total: $40-180/month**

**Free alternatives:**
- Vercel: Always free tier available
- PostgreSQL: Supabase free tier (500MB)
- OpenAI: $5 credits monthly (starter)

## Advanced: Custom Deployment (Non-Vercel)

### Deploy ke Railway (Alternative)

```bash
# Login
railway login

# Link project
railway link

# Deploy
railway up

# Set environment
railway variables
```

### Deploy ke Render

```bash
# Connect GitHub
# Create Web Service
# Point to build command: npm run build
# Set environment variables
```

### Deploy ke DigitalOcean App Platform

- Create droplet
- Setup Node app with npm start
- Configure PostgreSQL service
- Deploy from GitHub

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://prisma.io/docs
- **OpenAI API**: https://platform.openai.com/docs
- **NextAuth**: https://authjs.dev

## Deployment Checklist

```
Pre-deployment:
- [ ] npm run build succeeds locally
- [ ] .env.example complete
- [ ] No hardcoded secrets
- [ ] README updated
- [ ] DATABASE_URL valid

Deployment:
- [ ] GitHub repo created
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Domain configured
- [ ] Database migrations run
- [ ] Deployment completed

Post-deployment:
- [ ] All pages accessible
- [ ] Auth working (email & Google)
- [ ] API endpoints responding
- [ ] AI features working
- [ ] File uploads working
- [ ] Analytics visible
- [ ] Monitoring setup

Monitoring:
- [ ] Error tracking enabled
- [ ] Database backups verified
- [ ] API rate limits set
- [ ] Uptime monitoring active
- [ ] Weekly backups confirmed
```

## Troubleshooting Deployment

| Error | Cause | Solution |
|-------|-------|----------|
| 500 Internal Server Error | Database not connected | Check DATABASE_URL format |
| Build fails: Prisma error | Prisma client not generated | Run `npm i` then `npm run build` |
| 401 Unauthorized | Invalid auth secret | Regenerate NEXTAUTH_SECRET |
| Streaming timeout | API too slow | Check OpenAI quota & API limits |
| Domain not working | DNS not propagated | Wait 24-48 hours, check nameservers |
| File upload fails | Blob storage auth | Check BLOB_READ_WRITE_TOKEN |

## Next Steps After Deployment

1. **Add monitoring**: Sentry, Datadog, or LogRocket
2. **Setup CDN**: Cloudflare for faster images
3. **Add analytics**: PostHog or Amplitude
4. **Implement caching**: Redis for session storage
5. **Setup CI/CD**: GitHub Actions for tests
6. **User feedback**: Crisp chat or Intercom

---

**Deployment complete!** 🎉

Lumina AI sekarang live dan siap diakses oleh ribuan siswa Indonesia.

Untuk update & maintenance, push ke main branch dan Vercel akan auto-deploy.
