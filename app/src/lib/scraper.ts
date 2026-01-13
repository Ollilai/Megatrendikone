// Website scraping utilities
import * as cheerio from 'cheerio';

export async function scrapeWebsite(url: string): Promise<string> {
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; MegatrendikoneBot/1.0)',
                'Accept': 'text/html,application/xhtml+xml',
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }

        const html = await response.text();
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
        return `Verkkosivun ${url} sisällön hakeminen epäonnistui. Analysoi organisaatio nimen perusteella.`;
    }
}
