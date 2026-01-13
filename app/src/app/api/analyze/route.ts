// Main analysis API endpoint
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { scrapeWebsite } from '@/lib/scraper';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompts';
import { AnalysisResult, AnalysisResponse, getCompanyLogoUrl } from '@/lib/megatrends';
import { searchRelevantChunks, formatChunksAsContext } from '@/lib/megatrends-embeddings';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Gemini client for image generation
const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Simple in-memory cache (use Redis/KV in production)
const cache = new Map<string, { data: AnalysisResult; timestamp: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate a future vision image using Gemini's image generation
 */
async function generateFutureImage(
    companyName: string,
    industry: string,
    topOpportunity: string
): Promise<string | undefined> {
    try {
        const prompt = `Create a futuristic, optimistic visualization for ${companyName}, a company in the ${industry} sector. 
The image should represent their future success in: ${topOpportunity}.
Style: Modern, professional, hopeful, with subtle tech elements. 
Use a cool color palette with teal and blue accents. 
Show abstract or symbolic representation of innovation and growth.
No text, logos, or words in the image.
Photorealistic style with cinematic lighting.`;

        // Using the correct model name per Google docs
        const response = await genai.models.generateContent({
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
                { success: false, error: 'Yrityksen nimi ja verkkosivun osoite ovat pakollisia.' },
                { status: 400 }
            );
        }

        // Check cache
        const cacheKey = `${companyName}-${websiteUrl}`.toLowerCase();
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            return NextResponse.json<AnalysisResponse>({
                success: true,
                data: cached.data,
            });
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

        // Cache result
        cache.set(cacheKey, { data: result, timestamp: Date.now() });

        return NextResponse.json<AnalysisResponse>({
            success: true,
            data: result,
        });

    } catch (error) {
        console.error('Analysis error:', error);

        const errorMessage = error instanceof Error
            ? error.message
            : 'Analyysi epäonnistui. Yritä uudelleen.';

        return NextResponse.json<AnalysisResponse>(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
