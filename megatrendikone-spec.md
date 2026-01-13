# Megatrendikone – Project Specification

## Overview

**Concept:** A viral web tool that analyzes how Sitra's Megatrends 2026 affect a specific company/organization. Users input their company name and website URL, the app researches the company via web search, matches findings against the megatrends dataset, and generates a shareable "Spotify Wrapped"-style visual profile card (PNG) plus a PDF report.

**Goal:** Be the first in Finland to create an interactive tool using Sitra's newly released AI-friendly megatrends dataset (released January 13, 2026).

**Target:** Finnish businesses, strategists, consultants, and decision-makers.

---

## User Flow

```
1. LANDING PAGE
   - Hero: "Miten megatrendit vaikuttavat sinun yritykseesi?"
   - Input: Company name (required)
   - Input: Website URL (required)
   - Input: Optional file upload (PDF/DOCX - strategy docs etc.) [V2 - skip for MVP]
   - CTA button: "Analysoi →"

2. LOADING/PROCESSING (30-60 seconds)
   - Animated progress with status messages:
     - "Tutkitaan yritystäsi..."
     - "Analysoidaan toimialaa..."
     - "Sovitetaan megatrendeihin..."
     - "Luodaan profiiliasi..."
   - Show company logo if fetchable

3. RESULTS PAGE
   - Main: Visual "Wrapped-style" card (this becomes the PNG)
   - Below card: Key insights in text
   - Action buttons:
     - "Jaa LinkedIniin" (opens LinkedIn share with pre-filled text + image)
     - "Lataa PNG" (downloads the card)
     - "Lataa PDF" (downloads full report)
     - "Analysoi toinen yritys"
   - Footer: Attribution to Sitra + your branding
```

---

## Visual Design: The "Wrapped" Card

The shareable PNG card should be:
- **Dimensions:** 1080x1350px (Instagram/LinkedIn optimal)
- **Style:** Dark gradient background, bold typography, minimal, modern
- **Color scheme:** Use colors that complement Sitra's brand (teals, deep blues) but distinct

### Card Layout (top to bottom):

```
┌────────────────────────────────────────┐
│                                        │
│         MEGATRENDIPROFIILI 2026        │  <- Small header
│                                        │
│            [COMPANY NAME]              │  <- Large, bold
│              [Industry]                │  <- Smaller, muted
│                                        │
│  ─────────────────────────────────────  │
│                                        │
│  🤖 TEKNOLOGIA      ████████████  92%  │  <- Bar charts
│  🌍 LUONTO          ████████░░░░  67%  │     Emoji + label + bar + %
│  👥 IHMISET         █████░░░░░░░  42%  │     Sorted by relevance
│  ⚖️ VALTA           ███░░░░░░░░░  28%  │
│                                        │
│  ─────────────────────────────────────  │
│                                        │
│  🎯 #1 MAHDOLLISUUS                    │  <- Highlight box
│  "AI-pohjainen palvelukehitys          │
│   asiakaskokemuksen parantamiseen"     │
│                                        │
│  ⚠️ VILLI KORTTI                       │  <- Warning box
│  "Kyberhyökkäykset toimitusketjuun"    │
│                                        │
│  ─────────────────────────────────────  │
│                                        │
│  megatrendikone.fi     Lähde: Sitra    │  <- Footer
│                                        │
└────────────────────────────────────────┘
```

---

## Technical Architecture

### Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion (loading states, card reveal)
- **PNG Generation:** html-to-image or @vercel/og
- **PDF Generation:** @react-pdf/renderer
- **AI:** Anthropic Claude API with web search tool
- **Hosting:** Vercel
- **Language:** TypeScript

### Project Structure

```
/app
  /page.tsx                 # Landing page
  /analyze/page.tsx         # Results page (with suspense)
  /api
    /analyze/route.ts       # Main API: web search + AI analysis
    /generate-image/route.ts # PNG generation endpoint
    /generate-pdf/route.ts  # PDF generation endpoint
/components
  /ui
    /Button.tsx
    /Input.tsx
    /Card.tsx
  /landing
    /HeroSection.tsx
    /InputForm.tsx
  /results
    /MegatrendCard.tsx      # The shareable visual card
    /InsightsSection.tsx
    /ShareButtons.tsx
  /loading
    /AnalysisProgress.tsx
/lib
  /megatrends.ts            # Megatrends data + types
  /prompts.ts               # AI prompt templates
  /analysis.ts              # Analysis logic
  /share.ts                 # LinkedIn share helpers
/data
  /sitra-megatrendit-2026-dataset-fi.json
/public
  /fonts/                   # If custom fonts needed
```

---

## API Design

### POST /api/analyze

**Request:**
```typescript
{
  companyName: string;
  websiteUrl: string;
  additionalContext?: string; // V2: extracted from uploaded files
}
```

**Response:**
```typescript
{
  success: boolean;
  data: {
    company: {
      name: string;
      industry: string;
      description: string;
      employeeCount?: string;
      location?: string;
    };
    megatrendScores: {
      teknologia: { score: number; reasoning: string };
      luonto: { score: number; reasoning: string };
      ihmiset: { score: number; reasoning: string };
      valta: { score: number; reasoning: string };
    };
    topOpportunity: {
      megatrend: string;
      title: string;
      description: string;
    };
    wildCard: {
      title: string;
      description: string;
      likelihood: "low" | "medium" | "high";
    };
    insights: string[]; // 3-5 bullet points
    generatedAt: string; // ISO timestamp
  };
  error?: string;
}
```

---

## AI Integration

### Claude API Call Structure

Use Claude with web search tool to:
1. Research the company from their website
2. Identify their industry, size, focus areas
3. Match against the megatrends framework
4. Generate relevance scores (0-100) for each megatrend
5. Identify top opportunity and wild card risk

### System Prompt Template

```
You are an expert Finnish business analyst specializing in futures research and megatrend analysis. You have deep knowledge of Sitra's Megatrendit 2026 framework.

Your task is to analyze how the four megatrends affect a specific company.

THE FOUR MEGATRENDS:

1. TEKNOLOGIA (Technology) - "Tekoäly mullistaa yhteiskunnan perustaa"
Key themes: AI transformation, automation, data economy, digital infrastructure, cybersecurity, emerging tech (quantum, biotech)

2. LUONTO (Nature/Environment) - "Ympäristökriisi pakottaa sopeutumaan ja uudistumaan"  
Key themes: Climate change adaptation, circular economy, biodiversity, resource scarcity, sustainability transition, green technology

3. IHMISET (People) - "Suuntana pitkäikäisten yhteiskunta"
Key themes: Aging population, workforce changes, skills/competence needs, immigration, wellbeing, demographic shifts

4. VALTA (Power) - "Maailmanjärjestyksen murros mittaa demokratian voiman"
Key themes: Geopolitics, democracy, regulation, EU dynamics, security, global trade shifts, institutional trust

ANALYSIS REQUIREMENTS:

For each megatrend, provide:
- A relevance score (0-100) based on how much this megatrend will impact the company
- Brief reasoning (1-2 sentences)

Also identify:
- The #1 opportunity for this company based on megatrends
- One "wild card" risk scenario they should monitor

Respond in Finnish. Be specific to the company, not generic.
```

### User Prompt Template

```
Analysoi yritys: {companyName}
Verkkosivut: {websiteUrl}

Käytä web-hakua tutkiaksesi yritystä ja sen toimialaa. Sitten arvioi megatrendien vaikutukset.

Vastaa JSON-muodossa:
{
  "company": {
    "name": "string",
    "industry": "string (suomeksi)",
    "description": "string (1-2 lausetta)"
  },
  "megatrendScores": {
    "teknologia": { "score": 0-100, "reasoning": "string" },
    "luonto": { "score": 0-100, "reasoning": "string" },
    "ihmiset": { "score": 0-100, "reasoning": "string" },
    "valta": { "score": 0-100, "reasoning": "string" }
  },
  "topOpportunity": {
    "megatrend": "teknologia|luonto|ihmiset|valta",
    "title": "string (max 50 chars)",
    "description": "string (max 150 chars)"
  },
  "wildCard": {
    "title": "string (max 50 chars)",
    "description": "string (max 150 chars)"
  },
  "insights": ["string", "string", "string"]
}
```

---

## Megatrends Data Reference

The full Sitra dataset is included in `/data/sitra-megatrendit-2026-dataset-fi.json`.

Key structure for reference:
- 4 main megatrends: IHMISET, VALTA, LUONTO, TEKNOLOGIA
- Each has: Reunaehdot (constraints), Muutos (changes), Mahdollisuudet (opportunities), Villit kortit (wild cards)
- Dataset includes trendit (trends), data points, and detailed descriptions

Use this data to:
1. Ground the AI analysis in Sitra's actual framework
2. Pull specific trends/wild cards relevant to the company
3. Ensure outputs align with official Sitra terminology

---

## LinkedIn Share Integration

### Share URL Format

```typescript
const linkedInShareUrl = (imageUrl: string, text: string) => {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(imageUrl)}`;
};
```

### Pre-filled Post Text (copy to clipboard)

```
🔮 Tein juuri yrityksemme megatrendianalyysin!

Sitran Megatrendit 2026 -datan pohjalta:
🤖 Teknologia: {score}%
🌍 Luonto: {score}%
👥 Ihmiset: {score}%
⚖️ Valta: {score}%

#1 Mahdollisuutemme: {opportunity}

Tee oma analyysisi: megatrendikone.fi

#megatrendit #tulevaisuus #strategia #sitra
```

---

## PDF Report Structure

Simple single-page or two-page PDF:

**Page 1:**
- Company name + logo (if available)
- The visual card (embedded)
- Generation date

**Page 2:**
- Detailed breakdown per megatrend
- Reasoning for each score
- Top 3 opportunities
- Wild cards to monitor
- Source attribution: Sitra Megatrendit 2026

---

## Environment Variables

```env
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_BASE_URL=https://megatrendikone.fi  # or Vercel URL
```

---

## MVP Scope (Launch ASAP)

### Include:
- [x] Landing page with company name + URL input
- [x] AI analysis via Claude API with web search
- [x] Visual "Wrapped" card generation (PNG)
- [x] LinkedIn share button + copy text
- [x] PNG download
- [x] Simple PDF download
- [x] Mobile responsive
- [x] Finnish language only

### Exclude (V2):
- [ ] File upload (strategy docs)
- [ ] Email capture / lead generation
- [ ] English language version
- [ ] Saved results / history
- [ ] Comparison between companies
- [ ] Detailed trend deep-dives

---

## Success Metrics

- Shares on LinkedIn (viral coefficient)
- Time to first share after launch
- Number of analyses generated
- Media/influencer pickup

---

## Launch Checklist

1. [ ] Deploy to Vercel
2. [ ] Test with 5-10 different companies
3. [ ] Prepare LinkedIn launch post
4. [ ] Have backup if API rate limited
5. [ ] Monitor for errors first 24h

---

## Attribution & Legal

- Sitra dataset is CC BY-SA 4.0 licensed
- Must attribute: "Lähde: Sitra, Megatrendit 2026"
- Share-alike: If you distribute derivatives, use same license
- Include link to original: sitra.fi/julkaisut/megatrendit-2026

---

## Contact / Branding

**Creator:** Olli Laitinen, AI & Communications Consultant
**Website:** [your domain]
**LinkedIn:** [your LinkedIn]

---

## Notes for Claude Code

1. Start with the API route - get the AI analysis working first
2. Then build the visual card component
3. Use html-to-image for PNG generation (most reliable)
4. Test with real Finnish companies: Kone, Neste, Supercell, Wolt, etc.
5. The loading animation is important for UX - the wait is 30-60 seconds
6. Make sure the PNG looks good when shared on LinkedIn (preview it!)
