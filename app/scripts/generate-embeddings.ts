#!/usr/bin/env npx tsx
/**
 * Generate embeddings for Sitra Megatrendit 2026 content
 * 
 * Run: npx tsx scripts/generate-embeddings.ts
 */

// Load environment variables from .env.local
import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { parseAndChunkMegatrends, generateEmbeddings, EmbeddingsData } from '../src/lib/megatrends-embeddings';

async function main() {
    console.log('=== Megatrend Embeddings Generator ===\n');

    // Path to Sitra JSON file
    const sitraJsonPath = path.join(__dirname, '../../sitra-megatrendit-2026-dataset-fi.json');

    if (!fs.existsSync(sitraJsonPath)) {
        console.error(`Error: Sitra JSON not found at ${sitraJsonPath}`);
        process.exit(1);
    }

    console.log('1. Parsing and chunking Sitra megatrends JSON...');
    const chunks = parseAndChunkMegatrends(sitraJsonPath);

    console.log(`\n   Created ${chunks.length} chunks`);
    console.log('   Theme distribution:');
    const themeCounts = chunks.reduce((acc, c) => {
        acc[c.theme] = (acc[c.theme] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    Object.entries(themeCounts).forEach(([theme, count]) => {
        console.log(`     - ${theme}: ${count} chunks`);
    });

    console.log('\n2. Generating embeddings with OpenAI text-embedding-3-small...');
    const chunksWithEmbeddings = await generateEmbeddings(chunks);

    console.log('\n3. Saving embeddings to JSON file...');
    const outputPath = path.join(__dirname, '../src/data/megatrends-with-embeddings.json');

    const embeddingsData: EmbeddingsData = {
        chunks: chunksWithEmbeddings,
        model: 'text-embedding-3-small',
        dimensions: 1536,
        createdAt: new Date().toISOString(),
    };

    fs.writeFileSync(outputPath, JSON.stringify(embeddingsData));

    const fileSizeKB = Math.round(fs.statSync(outputPath).size / 1024);
    console.log(`   Saved to: ${outputPath}`);
    console.log(`   File size: ${fileSizeKB} KB`);

    console.log('\n✅ Done! Embeddings generated successfully.');
    console.log('   You can now use RAG-based megatrend retrieval in your API.');
}

main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
});
