/**
 * Tests for web scraper security and functionality
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateUrl, scrapeWebsite } from '../scraper';

describe('validateUrl', () => {
    it('should accept valid HTTP URLs', () => {
        expect(() => validateUrl('http://example.com')).not.toThrow();
    });

    it('should accept valid HTTPS URLs', () => {
        expect(() => validateUrl('https://example.com')).not.toThrow();
    });

    it('should reject non-HTTP protocols', () => {
        expect(() => validateUrl('ftp://example.com')).toThrow('Only HTTP and HTTPS');
        expect(() => validateUrl('file:///etc/passwd')).toThrow('Only HTTP and HTTPS');
        expect(() => validateUrl('javascript:alert(1)')).toThrow('Only HTTP and HTTPS');
    });

    it('should reject localhost URLs (SSRF protection)', () => {
        expect(() => validateUrl('http://localhost:3000')).toThrow('internal/private');
        expect(() => validateUrl('http://127.0.0.1')).toThrow('internal/private');
        expect(() => validateUrl('http://0.0.0.0')).toThrow('internal/private');
    });

    it('should reject private IP ranges (SSRF protection)', () => {
        expect(() => validateUrl('http://192.168.1.1')).toThrow('internal/private');
        expect(() => validateUrl('http://10.0.0.1')).toThrow('internal/private');
        expect(() => validateUrl('http://172.16.0.1')).toThrow('internal/private');
    });

    it('should reject AWS metadata endpoint', () => {
        expect(() => validateUrl('http://169.254.169.254/latest/meta-data/')).toThrow('internal/private');
    });

    it('should reject malformed URLs', () => {
        expect(() => validateUrl('not-a-url')).toThrow('Invalid URL');
        expect(() => validateUrl('')).toThrow('Invalid URL');
    });
});

describe('scrapeWebsite', () => {
    beforeEach(() => {
        // Reset fetch mock before each test
        vi.resetAllMocks();
    });

    it('should scrape valid HTML and extract content', async () => {
        const mockHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Test Company</title>
                    <meta name="description" content="Test company description">
                </head>
                <body>
                    <main>
                        <h1>Welcome to Test Company</h1>
                        <p>We are a leading Finnish technology company.</p>
                    </main>
                </body>
            </html>
        `;

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            headers: {
                get: () => null,
            },
            text: async () => mockHtml,
        });

        const result = await scrapeWebsite('https://example.com');

        expect(result).toContain('Test Company');
        expect(result).toContain('Test company description');
        expect(result).toContain('leading Finnish technology company');
        expect(fetch).toHaveBeenCalledWith(
            'https://example.com',
            expect.objectContaining({
                headers: expect.objectContaining({
                    'User-Agent': expect.stringContaining('MegatrendikoneBot'),
                }),
            })
        );
    });

    it('should handle fetch failures gracefully', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 404,
        });

        const result = await scrapeWebsite('https://example.com');

        expect(result).toContain('sisällön hakeminen epäonnistui');
        expect(result).toContain('Analysoi organisaatio nimen perusteella');
    });

    it('should handle timeout errors', async () => {
        global.fetch = vi.fn().mockImplementation(() => {
            return new Promise((_, reject) => {
                const error = new Error('Timeout');
                error.name = 'AbortError';
                reject(error);
            });
        });

        const result = await scrapeWebsite('https://example.com');

        expect(result).toContain('kesti liian kauan');
        expect(result).toContain('yli 10s');
    });

    it('should reject responses that are too large', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            headers: {
                get: (header: string) => header === 'content-length' ? '10000000' : null, // 10MB
            },
            text: async () => 'content',
        });

        const result = await scrapeWebsite('https://example.com');

        expect(result).toContain('liian suuri');
    });

    it('should remove scripts and styles from HTML', async () => {
        const mockHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Test</title>
                    <script>alert('XSS')</script>
                    <style>body { display: none; }</style>
                </head>
                <body>
                    <main>Clean content</main>
                    <script>console.log('bad')</script>
                </body>
            </html>
        `;

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            headers: { get: () => null },
            text: async () => mockHtml,
        });

        const result = await scrapeWebsite('https://example.com');

        expect(result).toContain('Clean content');
        expect(result).not.toContain('alert');
        expect(result).not.toContain('XSS');
        expect(result).not.toContain('script');
    });

    it('should limit content length', async () => {
        const largeContent = 'A'.repeat(20000);
        const mockHtml = `<html><body><main>${largeContent}</main></body></html>`;

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            headers: { get: () => null },
            text: async () => mockHtml,
        });

        const result = await scrapeWebsite('https://example.com');

        // Should be truncated to around 15000 characters
        expect(result.length).toBeLessThan(16000);
        expect(result).toContain('...');
    });

    it('should block internal network URLs', async () => {
        const result = await scrapeWebsite('http://192.168.1.1');

        expect(result).toContain('ei ole sallittu');
    });
});
