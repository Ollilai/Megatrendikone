// Vercel KV cache utilities for persistent analysis caching
// Uses domain as primary key for better cache hit rates

import { kv } from '@vercel/kv';
import type { AnalysisResult } from './megatrends';

// =============================================================================
// CACHE VERSION - Bump this when you change prompts or analysis logic!
// This invalidates all existing cached results.
// =============================================================================
const CACHE_VERSION = 'v1';

// Cache TTL: 30 days (analyses don't go stale quickly)
const CACHE_TTL_SECONDS = 30 * 24 * 60 * 60;

/**
 * Normalize a URL to extract just the domain
 * Examples:
 *   "https://www.sitra.fi/about/contact" → "sitra.fi"
 *   "http://acme.com" → "acme.com"
 *   "sitra.fi" → "sitra.fi"
 */
export function normalizeUrl(url: string): string {
    try {
        // Add protocol if missing
        let normalizedUrl = url.trim().toLowerCase();
        if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
            normalizedUrl = 'https://' + normalizedUrl;
        }

        const parsed = new URL(normalizedUrl);
        let hostname = parsed.hostname;

        // Remove www. prefix
        if (hostname.startsWith('www.')) {
            hostname = hostname.slice(4);
        }

        return hostname;
    } catch {
        // If URL parsing fails, use the input as-is (lowercased)
        return url.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    }
}

/**
 * Generate cache key from domain (includes version for cache busting)
 */
function getCacheKey(domain: string): string {
    return `analysis:${CACHE_VERSION}:${domain}`;
}

/**
 * Check if Vercel KV is available (has environment variables)
 */
function isKvAvailable(): boolean {
    return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

/**
 * Get cached analysis result for a domain
 * Returns null if not found or expired
 */
export async function getCachedAnalysis(domain: string): Promise<AnalysisResult | null> {
    if (!isKvAvailable()) {
        console.log('[Cache] Vercel KV not configured, skipping cache lookup');
        return null;
    }

    try {
        const key = getCacheKey(domain);
        const cached = await kv.get<AnalysisResult>(key);

        if (cached) {
            console.log(`[Cache] HIT for domain: ${domain}`);
            return cached;
        }

        console.log(`[Cache] MISS for domain: ${domain}`);
        return null;
    } catch (error) {
        console.error('[Cache] Error reading from KV:', error);
        return null;
    }
}

/**
 * Store analysis result in cache
 */
export async function setCachedAnalysis(
    domain: string,
    data: AnalysisResult,
    ttlSeconds: number = CACHE_TTL_SECONDS
): Promise<void> {
    if (!isKvAvailable()) {
        console.log('[Cache] Vercel KV not configured, skipping cache write');
        return;
    }

    try {
        const key = getCacheKey(domain);
        await kv.set(key, data, { ex: ttlSeconds });
        console.log(`[Cache] SET for domain: ${domain} (TTL: ${ttlSeconds}s)`);
    } catch (error) {
        console.error('[Cache] Error writing to KV:', error);
        // Don't throw - caching is non-critical
    }
}

/**
 * Invalidate (delete) cached analysis for a domain
 * Useful for manual cache busting
 */
export async function invalidateCache(domain: string): Promise<boolean> {
    if (!isKvAvailable()) {
        return false;
    }

    try {
        const key = getCacheKey(domain);
        await kv.del(key);
        console.log(`[Cache] INVALIDATED for domain: ${domain}`);
        return true;
    } catch (error) {
        console.error('[Cache] Error deleting from KV:', error);
        return false;
    }
}
