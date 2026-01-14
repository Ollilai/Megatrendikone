// Megatrend embeddings and vector search utilities
// Uses OpenAI text-embedding-3-small for cost-efficient embeddings
// Simple in-memory cosine similarity search

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Lazy-load OpenAI client to allow env vars to be loaded first
let _openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
    if (!_openai) {
        _openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY || 'sk-build-time-placeholder',
        });
    }
    return _openai;
}

// Megatrend themes
export type MegatrendTheme = 'ihmiset' | 'valta' | 'luonto' | 'teknologia' | 'general';

export interface MegatrendChunk {
    id: string;
    theme: MegatrendTheme;
    category: 'intro' | 'reunaehdot' | 'muutos' | 'mahdollisuudet' | 'trendit' | 'villit_kortit' | 'data' | 'general';
    title: string;
    content: string;
    embedding?: number[];
}

export interface EmbeddingsData {
    chunks: MegatrendChunk[];
    model: string;
    dimensions: number;
    createdAt: string;
}

// Mapping from page ranges to themes
const PAGE_TO_THEME: Record<string, MegatrendTheme> = {
    // Ihmiset: pages 19-30
    '19-30': 'ihmiset',
    // Valta: pages 31-42
    '31-42': 'valta',
    // Luonto: pages 43-54
    '43-54': 'luonto',
    // Teknologia: pages 55-70
    '55-70': 'teknologia',
};

/**
 * Determine theme based on page number
 */
function getThemeForPage(page: number): MegatrendTheme {
    if (page >= 19 && page <= 30) return 'ihmiset';
    if (page >= 31 && page <= 42) return 'valta';
    if (page >= 43 && page <= 54) return 'luonto';
    if (page >= 55 && page <= 70) return 'teknologia';
    return 'general';
}

/**
 * Determine category based on content and headers
 */
function getCategoryFromContent(content: string): MegatrendChunk['category'] {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('### reunaehdot') || lowerContent.includes('## reunaehdot')) return 'reunaehdot';
    if (lowerContent.includes('### muutos') || lowerContent.includes('## muutos')) return 'muutos';
    if (lowerContent.includes('### mahdollisuudet') || lowerContent.includes('## mahdollisuudet')) return 'mahdollisuudet';
    if (lowerContent.includes('### trendit') || lowerContent.includes('trendit')) return 'trendit';
    if (lowerContent.includes('villit kortit') || lowerContent.includes('villi kortti')) return 'villit_kortit';
    if (lowerContent.includes('### data') || lowerContent.includes('## data')) return 'data';
    return 'general';
}

/**
 * Extract title from content
 */
function extractTitle(content: string): string {
    // Look for markdown headers
    const headerMatch = content.match(/^#+\s+(.+)$/m);
    if (headerMatch) {
        return headerMatch[1].substring(0, 100);
    }
    // Otherwise use first 50 chars
    return content.substring(0, 50).replace(/\n/g, ' ') + '...';
}

/**
 * Parse the Sitra JSON and create semantic chunks
 */
export function parseAndChunkMegatrends(jsonPath: string): MegatrendChunk[] {
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(rawData);

    const chunks: MegatrendChunk[] = [];
    let chunkId = 0;

    // Group text items by page and theme
    const textItems = data.items.filter((item: { type: string }) => item.type === 'text');

    for (const item of textItems) {
        const content = item.content;

        // Skip very short content
        if (!content || content.length < 100) continue;

        const theme = getThemeForPage(item.page);
        const category = getCategoryFromContent(content);
        const title = extractTitle(content);

        // Split very long content into smaller chunks (max ~1500 chars)
        if (content.length > 1500) {
            const paragraphs = content.split(/\n\n+/);
            let currentChunk = '';

            for (const paragraph of paragraphs) {
                if (currentChunk.length + paragraph.length > 1500 && currentChunk.length > 300) {
                    chunks.push({
                        id: `chunk-${chunkId++}`,
                        theme,
                        category,
                        title: extractTitle(currentChunk),
                        content: currentChunk.trim(),
                    });
                    currentChunk = paragraph;
                } else {
                    currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
                }
            }

            if (currentChunk.length > 100) {
                chunks.push({
                    id: `chunk-${chunkId++}`,
                    theme,
                    category,
                    title: extractTitle(currentChunk),
                    content: currentChunk.trim(),
                });
            }
        } else {
            chunks.push({
                id: `chunk-${chunkId++}`,
                theme,
                category,
                title,
                content: content.trim(),
            });
        }
    }

    console.log(`Parsed ${chunks.length} chunks from megatrends JSON`);
    return chunks;
}

/**
 * Generate embeddings for chunks using OpenAI
 */
export async function generateEmbeddings(chunks: MegatrendChunk[]): Promise<MegatrendChunk[]> {
    const BATCH_SIZE = 20;
    const results: MegatrendChunk[] = [];

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE);
        const texts = batch.map(c => `${c.title}\n\n${c.content}`);

        console.log(`Generating embeddings for batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(chunks.length / BATCH_SIZE)}`);

        const response = await getOpenAI().embeddings.create({
            model: 'text-embedding-3-small',
            input: texts,
        });

        for (let j = 0; j < batch.length; j++) {
            results.push({
                ...batch[j],
                embedding: response.data[j].embedding,
            });
        }

        // Small delay to avoid rate limits
        if (i + BATCH_SIZE < chunks.length) {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    }

    return results;
}

/**
 * Cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Cache for loaded embeddings
let cachedEmbeddings: EmbeddingsData | null = null;

/**
 * Load pre-computed embeddings from JSON file
 */
export function loadPrecomputedEmbeddings(): EmbeddingsData {
    if (cachedEmbeddings) {
        return cachedEmbeddings;
    }

    const embeddingsPath = path.join(process.cwd(), 'src/data/megatrends-with-embeddings.json');

    if (!fs.existsSync(embeddingsPath)) {
        throw new Error(`Embeddings file not found at ${embeddingsPath}. Run: npx tsx scripts/generate-embeddings.ts`);
    }

    const data = JSON.parse(fs.readFileSync(embeddingsPath, 'utf-8')) as EmbeddingsData;
    cachedEmbeddings = data;

    console.log(`Loaded ${data.chunks.length} megatrend chunks with embeddings`);
    return data;
}

export interface SearchOptions {
    topK?: number;
    minScore?: number;
    themes?: MegatrendTheme[];
}

/**
 * Search for relevant megatrend chunks based on query text
 */
export async function searchRelevantChunks(
    query: string,
    options: SearchOptions = {}
): Promise<MegatrendChunk[]> {
    const { topK = 8, minScore = 0.3, themes } = options;

    // Load embeddings
    const embeddingsData = loadPrecomputedEmbeddings();

    // Generate query embedding
    const queryResponse = await getOpenAI().embeddings.create({
        model: 'text-embedding-3-small',
        input: query.substring(0, 8000), // Limit query length
    });
    const queryEmbedding = queryResponse.data[0].embedding;

    // Calculate similarities
    const scored = embeddingsData.chunks
        .filter(chunk => !themes || themes.includes(chunk.theme))
        .map(chunk => ({
            chunk,
            score: cosineSimilarity(queryEmbedding, chunk.embedding!),
        }))
        .filter(item => item.score >= minScore)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);

    console.log(`Found ${scored.length} relevant chunks (scores: ${scored.map(s => s.score.toFixed(3)).join(', ')})`);

    return scored.map(s => s.chunk);
}

/**
 * Format chunks as context string for the LLM prompt
 */
export function formatChunksAsContext(chunks: MegatrendChunk[]): string {
    if (chunks.length === 0) {
        return '';
    }

    const themeNames: Record<MegatrendTheme, string> = {
        ihmiset: 'IHMISET (Pitkäikäisten yhteiskunta)',
        valta: 'VALTA (Maailmanjärjestyksen murros)',
        luonto: 'LUONTO (Ympäristökriisi)',
        teknologia: 'TEKNOLOGIA (Tekoälyn murros)',
        general: 'YLEINEN',
    };

    return chunks.map(chunk => {
        const theme = themeNames[chunk.theme];
        return `### ${theme}\n**${chunk.title}**\n${chunk.content}`;
    }).join('\n\n---\n\n');
}
