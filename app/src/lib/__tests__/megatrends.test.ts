/**
 * Tests for megatrends utilities
 */

import { describe, it, expect } from 'vitest';
import { MEGATRENDS, getCompanyLogoUrl } from '../megatrends';

describe('MEGATRENDS', () => {
    it('should have all four megatrends defined', () => {
        expect(MEGATRENDS).toHaveProperty('teknologia');
        expect(MEGATRENDS).toHaveProperty('luonto');
        expect(MEGATRENDS).toHaveProperty('ihmiset');
        expect(MEGATRENDS).toHaveProperty('valta');
    });

    it('should have proper structure for each megatrend', () => {
        const keys = Object.keys(MEGATRENDS) as Array<keyof typeof MEGATRENDS>;

        keys.forEach(key => {
            const trend = MEGATRENDS[key];
            expect(trend).toHaveProperty('label');
            expect(trend).toHaveProperty('color');
            expect(trend).toHaveProperty('description');
            expect(typeof trend.label).toBe('string');
            expect(typeof trend.color).toBe('string');
            expect(typeof trend.description).toBe('string');
        });
    });

    it('should have unique colors for each megatrend', () => {
        const colors = Object.values(MEGATRENDS).map(t => t.color);
        const uniqueColors = new Set(colors);
        expect(uniqueColors.size).toBe(colors.length);
    });
});

describe('getCompanyLogoUrl', () => {
    it('should generate favicon URL for valid domain', () => {
        const url = getCompanyLogoUrl('https://example.com');
        expect(url).toContain('google.com/s2/favicons');
        expect(url).toContain('example.com');
    });

    it('should handle URLs with www prefix', () => {
        const url = getCompanyLogoUrl('https://www.example.com');
        expect(url).toContain('www.example.com');
    });

    it('should handle URLs with paths', () => {
        const url = getCompanyLogoUrl('https://example.com/about');
        expect(url).toContain('example.com');
    });

    it('should handle URLs without protocol gracefully', () => {
        const url = getCompanyLogoUrl('example.com');
        // Without protocol, URL constructor will fail, returns empty string
        expect(typeof url).toBe('string');
        expect(url).toBe('');
    });

    it('should handle malformed URLs gracefully', () => {
        const url = getCompanyLogoUrl('not-a-url');
        expect(typeof url).toBe('string');
        expect(url).toBe(''); // Returns empty string for invalid URLs
    });
});
