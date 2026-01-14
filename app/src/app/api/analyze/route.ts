// Main analysis API endpoint
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { kv } from '@vercel/kv';
import { scrapeWebsite } from '@/lib/scraper';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompts';
import { AnalysisResult, AnalysisResponse, getCompanyLogoUrl } from '@/lib/megatrends';
import { searchRelevantChunks, formatChunksAsContext } from '@/lib/megatrends-embeddings';

// Lazy initialize clients to avoid build-time errors
// During build, Next.js analyzes routes but doesn't need actual API keys
const getOpenAIClient = () => new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'sk-build-time-placeholder',
});

const getGeminiClient = () => new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || 'build-time-placeholder'
});

// Rate limiting: 3 requests per hour per IP
// Create the ratelimiter only if Redis is configured
const ratelimit = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(3, '1 h'),
        analytics: true,
        prefix: 'megatrendikone:ratelimit',
    })
    : null;

const CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

/**
 * Generate a future vision image using Gemini's image generation
 */
async function generateFutureImage(
    companyName: string,
    industry: string,
    topOpportunity: string
): Promise<string | undefined> {
    try {
        const prompt = `Create a realistic, professional photograph representing ${companyName} thriving in Finland in the near future.
Context: ${industry} sector, succeeding in: ${topOpportunity}.
Location: FINLAND - show Finnish environment: Nordic architecture, Finnish forests (pine, birch), lakes, or modern Finnish cities like Helsinki or Tampere.
People: If showing people, they should look Finnish/Nordic - diverse but realistic for Finland.
Style: High-quality editorial photography, natural Nordic lighting, hopeful and optimistic mood.
The image should feel grounded and believable, like a photo from a Finnish business magazine 5 years from now.
Include subtle hints of progress and innovation - modern but not sci-fi.
Color palette: Natural Nordic tones, clean Scandinavian aesthetic with subtle teal and warm accents.
No text, logos, watermarks, or words in the image.
Photorealistic, documentary style, shallow depth of field.`;

        // Using the correct model name per Google docs
        const response = await getGeminiClient().models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: prompt,
        });

        // Extract image from response
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const mimeType = part.inlineData.mimeType || 'image/png';
                    return `data:${mimeType};base64,${part.inlineData.data}`;
                }
            }
        }

        console.log('No image found in response:', JSON.stringify(response, null, 2));
        return undefined;
    } catch (error) {
        console.error('Image generation error:', error);
        return undefined;
    }
}

export async function POST(request: NextRequest) {
    try {
        const { companyName, websiteUrl } = await request.json();

        // Validate inputs
        if (!companyName || !websiteUrl) {
            return NextResponse.json<AnalysisResponse>(
                { success: false, error: 'Organisaation nimi ja verkkosivun osoite ovat pakollisia.' },
                { status: 400 }
            );
        }

        // Rate limiting check (if configured)
        if (ratelimit) {
            const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
            const { success, limit, remaining, reset } = await ratelimit.limit(ip);

            if (!success) {
                return NextResponse.json<AnalysisResponse>(
                    {
                        success: false,
                        error: `Liikaa pyyntöjä. Voit analysoida ${limit} organisaatiota tunnissa. Yritä uudelleen ${Math.ceil((reset - Date.now()) / 60000)} minuutin kuluttua.`
                    },
                    {
                        status: 429,
                        headers: {
                            'X-RateLimit-Limit': limit.toString(),
                            'X-RateLimit-Remaining': remaining.toString(),
                            'X-RateLimit-Reset': new Date(reset).toISOString(),
                        }
                    }
                );
            }
        }

        // Check distributed cache (Vercel KV)
        const cacheKey = `analysis:${companyName}-${websiteUrl}`.toLowerCase();
        try {
            const cached = await kv.get<AnalysisResult>(cacheKey);
            if (cached) {
                console.log('Cache hit for:', cacheKey);
                return NextResponse.json<AnalysisResponse>({
                    success: true,
                    data: cached,
                });
            }
        } catch (cacheError) {
            console.warn('Cache read error:', cacheError);
            // Continue without cache if KV is not available
        }

        // Scrape website content
        const websiteContent = await scrapeWebsite(websiteUrl);

        // RAG: Search for relevant megatrend context based on company info
        console.log('Searching for relevant megatrend context...');
        const queryText = `${companyName} ${websiteContent.substring(0, 3000)}`;
        const relevantChunks = await searchRelevantChunks(queryText, { topK: 10, minScore: 0.25 });
        const megatrendContext = formatChunksAsContext(relevantChunks);
        console.log(`Found ${relevantChunks.length} relevant chunks for RAG context`);

        // Call OpenAI API for text analysis using GPT-5.1 with deep reasoning
        const openai = getOpenAIClient();
        const completion = await openai.chat.completions.create({
            model: 'gpt-5.1',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: buildUserPrompt(companyName, websiteUrl, websiteContent, megatrendContext) },
            ],
            response_format: { type: 'json_object' },
            max_completion_tokens: 16000, // Higher limit for reasoning + output tokens
            reasoning_effort: 'medium', // Medium for balance of quality and reliability
        });

        // Handle response from reasoning model
        const responseText = completion.choices[0]?.message?.content;
        const finishReason = completion.choices[0]?.finish_reason;

        if (!responseText) {
            console.error('Empty response from GPT-5.1. Finish reason:', finishReason);
            throw new Error('Tyhjä vastaus tekoälyltä. Yritä uudelleen.');
        }

        // Parse JSON response
        const analysisData = JSON.parse(responseText) as Omit<AnalysisResult, 'generatedAt' | 'futureImageUrl'>;

        // Generate future vision image in parallel with response processing
        const futureImageUrl = await generateFutureImage(
            companyName,
            analysisData.company.industry,
            analysisData.topOpportunity.title
        );

        // Add metadata
        const result: AnalysisResult = {
            ...analysisData,
            company: {
                ...analysisData.company,
                logoUrl: getCompanyLogoUrl(websiteUrl),
            },
            generatedAt: new Date().toISOString(),
            futureImageUrl,
        };

        // Cache result in Vercel KV with 24hr TTL
        try {
            await kv.set(cacheKey, result, { ex: CACHE_TTL });
            console.log('Cached result for:', cacheKey);
        } catch (cacheError) {
            console.warn('Cache write error:', cacheError);
            // Continue without caching if KV is not available
        }

        return NextResponse.json<AnalysisResponse>({
            success: true,
            data: result,
        });

    } catch (error) {
        console.error('Analysis error:', error);

        // Send to Sentry in production
        if (process.env.NODE_ENV === 'production') {
            const Sentry = await import('@sentry/nextjs');
            Sentry.captureException(error, {
                tags: {
                    endpoint: 'analyze',
                },
                extra: {
                    companyName: (error as any).companyName,
                },
            });
        }

        const errorMessage = error instanceof Error
            ? error.message
            : 'Analyysi epäonnistui. Yritä uudelleen.';

        return NextResponse.json<AnalysisResponse>(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
