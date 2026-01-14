# Megatrendikone Setup Guide

Complete setup guide for production deployment with all security and monitoring features.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Local Development](#local-development)
4. [Production Deployment](#production-deployment)
5. [Testing](#testing)
6. [Monitoring & Alerts](#monitoring--alerts)

---

## Prerequisites

- Node.js 20+ and npm
- OpenAI API account with credits
- Google Cloud account (for Gemini API)
- Vercel account (for deployment)
- Upstash account (for rate limiting)
- Sentry account (optional, for error monitoring)

---

## Environment Variables

### Required for Development

```bash
# Copy the example file
cp .env.example .env.local

# Fill in these required values:
OPENAI_API_KEY=sk-...  # From https://platform.openai.com/api-keys
GEMINI_API_KEY=...     # From https://makersuite.google.com/app/apikey
```

### Required for Production

In addition to the above, production needs:

```bash
# Vercel KV (automatic when you add KV storage in Vercel)
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...

# Upstash Redis (for rate limiting)
UPSTASH_REDIS_REST_URL=...     # From https://console.upstash.com/
UPSTASH_REDIS_REST_TOKEN=...

# Sentry (optional but recommended)
SENTRY_DSN=...
NEXT_PUBLIC_SENTRY_DSN=...
```

---

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### 3. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### 4. Run Tests

```bash
# Unit tests
npm run test

# E2E tests (requires dev server running)
npm run test:e2e

# With UI
npm run test:e2e:ui
```

---

## Production Deployment

### 1. Vercel Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Add environment variables
vercel env add OPENAI_API_KEY
vercel env add GEMINI_API_KEY
```

### 2. Add Vercel KV Storage

1. Go to your project in Vercel dashboard
2. Navigate to Storage tab
3. Click "Create Database" → "KV"
4. Name it `megatrendikone-cache`
5. Environment variables are automatically added

### 3. Set Up Upstash Redis (Rate Limiting)

1. Go to https://console.upstash.com/
2. Create new Redis database
3. Copy REST URL and Token
4. Add to Vercel:
   ```bash
   vercel env add UPSTASH_REDIS_REST_URL
   vercel env add UPSTASH_REDIS_REST_TOKEN
   ```

### 4. Set Up Sentry (Error Monitoring)

1. Go to https://sentry.io/
2. Create new project (Next.js)
3. Copy DSN
4. Add to Vercel:
   ```bash
   vercel env add SENTRY_DSN
   vercel env add NEXT_PUBLIC_SENTRY_DSN
   ```

### 5. Deploy

```bash
vercel --prod
```

---

## Testing

### Unit Tests (Vitest)

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

Tests cover:
- Web scraper security (SSRF protection, timeouts, size limits)
- Prompt generation
- Utility functions
- Megatrends data structure

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run in UI mode (interactive)
npm run test:e2e:ui

# Run specific browser
npx playwright test --project=chromium

# Debug mode
npx playwright test --debug
```

Tests cover:
- Homepage form validation
- Complete analysis flow (with mocked API)
- Error handling
- Rate limiting response
- Keyboard navigation
- Mobile responsiveness
- Accessibility (ARIA attributes)

### Pre-deployment Checklist

```bash
# 1. Run all tests
npm run test
npm run test:e2e

# 2. Build check
npm run build

# 3. Type check
npm run lint

# 4. Check environment variables
cat .env.local  # Should have all required keys
```

---

## Monitoring & Alerts

### Cost Monitoring

**CRITICAL:** Set up cost alerts to prevent unexpected bills.

#### OpenAI

1. Go to https://platform.openai.com/settings/organization/billing/limits
2. Set monthly budget limit (e.g., $100/month)
3. Enable email notifications at 75% and 90%

#### Google Cloud (Gemini)

1. Go to https://console.cloud.google.com/billing/budgets
2. Create budget alert
3. Set threshold alerts at $50, $75, $100

### Error Monitoring (Sentry)

Once Sentry is configured:

1. Go to Sentry project dashboard
2. Set up alerts for:
   - Error rate spike (>10 errors/minute)
   - New error types
   - Critical errors (500 status)

### Analytics (Vercel)

Built-in Vercel Analytics tracks:
- Page views
- User sessions
- Performance metrics

Access via Vercel dashboard → Analytics tab

### Rate Limiting Monitor

Check Upstash Redis console for:
- Rate limit hit count
- Top IPs being rate limited
- Adjust limits if needed in `src/app/api/analyze/route.ts`

---

## Security Features

✅ **Rate Limiting:** 3 requests/hour per IP
✅ **SSRF Protection:** Blocks internal networks, localhost
✅ **Request Timeouts:** 10s for scraping
✅ **Size Limits:** Max 5MB responses
✅ **Input Validation:** URL and field validation
✅ **Security Headers:** CSP, X-Frame-Options, etc.
✅ **Error Monitoring:** Sentry integration
✅ **Distributed Cache:** Vercel KV with 24hr TTL

---

## Performance Optimizations

✅ **Image Optimization:** WebP/AVIF with Next.js Image
✅ **Bundle Splitting:** Automatic code splitting
✅ **Compression:** Gzip/Brotli enabled
✅ **Font Optimization:** next/font/google
✅ **Package Optimization:** framer-motion optimized imports
✅ **Caching:** 24hr cache for analysis results

---

## Troubleshooting

### Build Fails on Vercel

Check `vercel.json` is present in root directory. The app is in `/app` subdirectory.

### Rate Limiting Not Working

Ensure `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set in Vercel environment variables.

### Sentry Not Capturing Errors

1. Check `SENTRY_DSN` is set
2. Verify `NODE_ENV=production`
3. Check Sentry project settings

### Cache Not Working

Ensure Vercel KV is provisioned and environment variables are set:
```bash
vercel env ls
```

### High API Costs

1. Check rate limiting is active
2. Review cache hit rate in logs
3. Consider increasing cache TTL
4. Monitor OpenAI usage dashboard

---

## Support

- **GitHub Issues:** https://github.com/Ollilai/Megatrendikone/issues
- **Vercel Docs:** https://vercel.com/docs
- **Sentry Docs:** https://docs.sentry.io/platforms/javascript/guides/nextjs/

---

## License & Attribution

This project uses Sitra's Megatrendit 2026 data licensed under CC BY-SA 4.0.

Attribution: Sitra - https://www.sitra.fi/
