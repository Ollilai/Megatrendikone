/**
 * Tests for AI prompt generation
 */

import { describe, it, expect } from 'vitest';
import { buildUserPrompt, SYSTEM_PROMPT } from '../prompts';

describe('buildUserPrompt', () => {
    it('should build valid prompt with all parameters', () => {
        const prompt = buildUserPrompt(
            'Kone Oyj',
            'https://kone.com',
            'Kone is a global leader in elevator industry.',
            'RAG context about technology trends.'
        );

        expect(prompt).toContain('Kone Oyj');
        expect(prompt).toContain('https://kone.com');
        expect(prompt).toContain('global leader in elevator industry');
        expect(prompt).toContain('RAG context about technology trends');
        expect(prompt).toContain('JSON-muodossa');
    });

    it('should handle missing megatrend context', () => {
        const prompt = buildUserPrompt(
            'Test Company',
            'https://test.com',
            'Test content'
        );

        expect(prompt).toContain('Test Company');
        expect(prompt).toContain('Ei lisäkontekstia saatavilla');
    });

    it('should include required JSON schema', () => {
        const prompt = buildUserPrompt('Company', 'https://example.com', 'content');

        expect(prompt).toContain('"company"');
        expect(prompt).toContain('"megatrendAnalysis"');
        expect(prompt).toContain('"teknologia"');
        expect(prompt).toContain('"luonto"');
        expect(prompt).toContain('"ihmiset"');
        expect(prompt).toContain('"valta"');
        expect(prompt).toContain('"topOpportunity"');
        expect(prompt).toContain('"wildCard"');
        expect(prompt).toContain('"socialContract"');
    });

    it('should handle special characters in company name', () => {
        const prompt = buildUserPrompt(
            'Company & Co. "Special"',
            'https://example.com',
            'content'
        );

        expect(prompt).toContain('Company & Co. "Special"');
    });
});

describe('SYSTEM_PROMPT', () => {
    it('should contain all four megatrends', () => {
        expect(SYSTEM_PROMPT).toContain('TEKNOLOGIA');
        expect(SYSTEM_PROMPT).toContain('LUONTO');
        expect(SYSTEM_PROMPT).toContain('IHMISET');
        expect(SYSTEM_PROMPT).toContain('VALTA');
    });

    it('should provide guidance for different organization types', () => {
        expect(SYSTEM_PROMPT).toContain('yliopisto');
        expect(SYSTEM_PROMPT).toContain('Pk-yritys'); // Capital P
        expect(SYSTEM_PROMPT).toContain('Kunta'); // Capital K
        expect(SYSTEM_PROMPT).toContain('Järjestö'); // Capital J
    });

    it('should mention yhteiskuntasopimus', () => {
        expect(SYSTEM_PROMPT).toContain('yhteiskuntasopimus');
    });

    it('should mention Sitra megatrendit', () => {
        expect(SYSTEM_PROMPT).toContain('Sitran Megatrendit 2026');
    });
});
