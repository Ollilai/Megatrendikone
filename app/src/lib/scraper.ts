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

// Strategic content keywords for link discovery
const STRATEGIC_KEYWORDS = {
    fi: ['strategia', 'visio', 'arvot', 'tietoa', 'meista', 'yritys', 'toiminta', 'tavoitteet', 'missio', 'yhtiö'],
    en: ['strategy', 'vision', 'values', 'about', 'company', 'mission', 'goals', 'purpose', 'who-we-are'],
};

// URLs to avoid (navigation noise)
const IGNORE_PATTERNS = [
    'contact', 'yhteystiedot', 'privacy', 'tietosuoja', 'terms', 'ehdot',
    'cookie', 'login', 'kirjaudu', 'cart', 'ostoskori', 'search', 'haku',
    'mailto:', 'tel:', '#', 'javascript:', 'linkedin.com', 'facebook.com', 'twitter.com', 'instagram.com'
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

/**
 * Scores a URL based on strategic relevance
 */
function scoreUrl(url: string, linkText: string, baseUrl: string): number {
    const urlLower = url.toLowerCase();
    const textLower = linkText.toLowerCase();
    let score = 0;

    // Ignore unwanted patterns
    for (const pattern of IGNORE_PATTERNS) {
        if (urlLower.includes(pattern) || textLower.includes(pattern)) {
            return -1;
        }
    }

    // Must be same domain or subdomain
    try {
        const urlObj = new URL(url);
        const baseObj = new URL(baseUrl);
        if (!urlObj.hostname.endsWith(baseObj.hostname) && !baseObj.hostname.endsWith(urlObj.hostname)) {
            return -1;
        }
    } catch {
        return -1;
    }

    // Score based on strategic keywords
    const allKeywords = [...STRATEGIC_KEYWORDS.fi, ...STRATEGIC_KEYWORDS.en];
    for (const keyword of allKeywords) {
        if (urlLower.includes(keyword)) score += 3;
        if (textLower.includes(keyword)) score += 2;
    }

    // Prefer shorter paths (closer to root)
    const pathDepth = url.split('/').length - 3; // Subtract protocol and domain
    score -= pathDepth * 0.5;

    return score;
}

/**
 * Extracts strategic links from homepage
 */
function extractStrategicLinks(html: string, baseUrl: string): string[] {
    const $ = cheerio.load(html);
    const links: Array<{ url: string; score: number }> = [];

    $('a[href]').each((_, elem) => {
        const href = $(elem).attr('href');
        const text = $(elem).text().trim();

        if (!href) return;

        // Convert relative URLs to absolute
        let absoluteUrl: string;
        try {
            absoluteUrl = new URL(href, baseUrl).href;
        } catch {
            return;
        }

        // Skip homepage itself
        const baseNormalized = baseUrl.replace(/\/$/, '');
        const urlNormalized = absoluteUrl.replace(/\/$/, '');
        if (urlNormalized === baseNormalized) return;

        const score = scoreUrl(absoluteUrl, text, baseUrl);
        if (score > 0) {
            links.push({ url: absoluteUrl, score });
        }
    });

    // Sort by score and take top 2 unique URLs
    const topLinks = links
        .sort((a, b) => b.score - a.score)
        .map(l => l.url)
        .filter((url, index, self) => self.indexOf(url) === index)
        .slice(0, 2);

    return topLinks;
}

/**
 * Scrapes a single page and returns cleaned content
 */
async function scrapeSinglePage(url: string): Promise<string | null> {
    try {
        validateUrl(url);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; MegatrendikoneBot/1.0)',
                'Accept': 'text/html,application/xhtml+xml',
            },
            signal: controller.signal,
            redirect: 'follow',
            next: { revalidate: 3600 },
        });

        clearTimeout(timeoutId);

        if (!response.ok) return null;

        const contentLength = response.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > MAX_RESPONSE_SIZE) {
            return null;
        }

        const html = await response.text();
        if (html.length > MAX_RESPONSE_SIZE) return null;

        const $ = cheerio.load(html);
        $('script, style, nav, header, footer, aside, iframe, noscript').remove();

        const mainContent = $('main, article, .content, #content, .main')
            .first()
            .text()
            .trim();

        const bodyContent = mainContent || $('body').text().trim();

        return bodyContent
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, '\n')
            .trim();

    } catch (error) {
        console.warn('Failed to scrape page:', url, error);
        return null;
    }
}

/**
 * Hybrid multi-page scraper: homepage + top 2 strategic pages
 */
export async function scrapeWebsite(url: string): Promise<string> {
    try {
        validateUrl(url);

        // 1. Scrape homepage
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; MegatrendikoneBot/1.0)',
                'Accept': 'text/html,application/xhtml+xml',
            },
            signal: controller.signal,
            redirect: 'follow',
            next: { revalidate: 3600 },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }

        const contentLength = response.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > MAX_RESPONSE_SIZE) {
            throw new Error('Response too large (max 5MB)');
        }

        const html = await response.text();
        if (html.length > MAX_RESPONSE_SIZE) {
            throw new Error('Response too large (max 5MB)');
        }

        const $ = cheerio.load(html);

        // Extract metadata
        const title = $('title').text().trim();
        const metaDescription = $('meta[name="description"]').attr('content') || '';

        // 2. Find strategic pages from homepage links
        const strategicLinks = extractStrategicLinks(html, url);
        console.log(`Found ${strategicLinks.length} strategic pages:`, strategicLinks);

        // 3. Scrape homepage content
        $('script, style, nav, header, footer, aside, iframe, noscript').remove();
        const mainContent = $('main, article, .content, #content, .main').first().text().trim();
        const homepageContent = (mainContent || $('body').text().trim())
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, '\n')
            .trim();

        // 4. Scrape strategic pages in parallel
        const strategicContents = await Promise.all(
            strategicLinks.map(link => scrapeSinglePage(link))
        );

        // 5. Combine content intelligently
        let combinedContent = '';

        // Homepage content (first ~8000 chars)
        combinedContent += homepageContent.substring(0, 8000);

        // Strategic page content (prioritize it)
        for (let i = 0; i < strategicContents.length; i++) {
            const content = strategicContents[i];
            if (content) {
                combinedContent += `\n\n--- Strateginen sivu ${i + 1} (${strategicLinks[i]}) ---\n`;
                combinedContent += content.substring(0, 6000); // ~6000 chars per strategic page
            }
        }

        // Limit total to ~20000 chars (enough for good context, not too much for API)
        const maxLength = 20000;
        const finalContent = combinedContent.length > maxLength
            ? combinedContent.substring(0, maxLength) + '...'
            : combinedContent;

        return `
Sivuston otsikko: ${title}
Kuvaus: ${metaDescription}

Sisältö:
${finalContent}
    `.trim();

    } catch (error) {
        console.error('Scraping error:', error);

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
