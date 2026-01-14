// Website scraping utilities
import * as cheerio from 'cheerio';

const MAX_RESPONSE_SIZE = 5_000_000; // 5MB limit
const FETCH_TIMEOUT = 10_000; // 10 seconds
const BLOCKED_HOSTS = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '10.',
    '172.16.',
    '192.168.',
    '169.254.169.254', // AWS metadata endpoint
];

/**
 * Validates URL to prevent SSRF attacks
 */
function validateUrl(url: string): void {
    try {
        const urlObj = new URL(url);

        // Block non-http(s) protocols
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            throw new Error('Only HTTP and HTTPS protocols are allowed');
        }

        // Block internal/private IPs
        const hostname = urlObj.hostname.toLowerCase();
        for (const blocked of BLOCKED_HOSTS) {
            if (hostname.includes(blocked) || hostname.startsWith(blocked)) {
                throw new Error('Access to internal/private networks is not allowed');
            }
        }
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('Invalid URL format');
        }
        throw error;
    }
}

export async function scrapeWebsite(url: string): Promise<string> {
    try {
        // Validate URL first to prevent SSRF
        validateUrl(url);

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; MegatrendikoneBot/1.0)',
                'Accept': 'text/html,application/xhtml+xml',
            },
            signal: controller.signal,
            redirect: 'follow',
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }

        // Check response size before reading
        const contentLength = response.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > MAX_RESPONSE_SIZE) {
            throw new Error('Response too large (max 5MB)');
        }

        const html = await response.text();

        // Double-check actual size after reading
        if (html.length > MAX_RESPONSE_SIZE) {
            throw new Error('Response too large (max 5MB)');
        }
        const $ = cheerio.load(html);

        // Remove scripts, styles, and navigation
        $('script, style, nav, header, footer, aside, iframe, noscript').remove();

        // Extract text from key content areas
        const title = $('title').text().trim();
        const metaDescription = $('meta[name="description"]').attr('content') || '';

        // Get main content
        const mainContent = $('main, article, .content, #content, .main')
            .first()
            .text()
            .trim();

        // Fallback to body if no main content area found
        const bodyContent = mainContent || $('body').text().trim();

        // Clean up whitespace
        const cleanContent = bodyContent
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, '\n')
            .trim();

        // Limit content length for API (roughly 3000 words)
        const maxLength = 15000;
        const truncatedContent = cleanContent.length > maxLength
            ? cleanContent.substring(0, maxLength) + '...'
            : cleanContent;

        return `
Sivuston otsikko: ${title}
Kuvaus: ${metaDescription}

Sisältö:
${truncatedContent}
    `.trim();

    } catch (error) {
        console.error('Scraping error:', error);

        // Handle specific error types
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return `Verkkosivun ${url} lataaminen kesti liian kauan (yli 10s). Analysoi organisaatio nimen perusteella.`;
            }
            if (error.message.includes('too large')) {
                return `Verkkosivun ${url} sisältö on liian suuri. Analysoi organisaatio nimen perusteella.`;
            }
            if (error.message.includes('not allowed')) {
                return `URL-osoite ${url} ei ole sallittu. Tarkista osoite.`;
            }
        }

        return `Verkkosivun ${url} sisällön hakeminen epäonnistui. Analysoi organisaatio nimen perusteella.`;
    }
}

// Export for testing
export { validateUrl };
