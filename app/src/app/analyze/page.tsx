'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AnalysisProgress } from '@/components/loading/AnalysisProgress';
import { FlipCard } from '@/components/results/FlipCard';
import { ShareButtons } from '@/components/results/ShareButtons';
import { type AnalysisResult, MEGATRENDS, type MegatrendKey, getCompanyLogoUrl } from '@/lib/megatrends';

/**
 * Validates that the analysis result has all required fields
 * This ensures we only show complete results to users
 */
function isCompleteResult(data: unknown): data is AnalysisResult {
    if (!data || typeof data !== 'object') return false;

    const result = data as Partial<AnalysisResult>;

    // Check company info
    if (!result.company?.name || !result.company?.industry) return false;

    // Check megatrend scores - all 4 must be present
    if (!result.megatrendScores) return false;
    const requiredTrends = ['teknologia', 'luonto', 'ihmiset', 'valta'] as const;
    for (const trend of requiredTrends) {
        if (!result.megatrendScores[trend]?.reasoning) return false;
        if (typeof result.megatrendScores[trend]?.score !== 'number') return false;
    }

    // Check top opportunity
    if (!result.topOpportunity?.title || !result.topOpportunity?.description) return false;

    // Check wild card
    if (!result.wildCard?.title || !result.wildCard?.description) return false;

    // Check insights
    if (!Array.isArray(result.insights) || result.insights.length === 0) return false;

    return true;
}

function AnalyzeContent() {
    const searchParams = useSearchParams();
    const companyName = searchParams.get('company') || '';
    const websiteUrl = searchParams.get('url') || '';

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [result, setResult] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        if (!companyName || !websiteUrl) {
            setError('Organisaation nimi ja verkkosivujen osoite puuttuvat');
            setIsLoading(false);
            return;
        }

        const analyze = async () => {
            try {
                const response = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ companyName, websiteUrl }),
                });

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.error || 'Analyysi epäonnistui');
                }

                // Validate that result is complete before displaying
                if (!isCompleteResult(data.data)) {
                    throw new Error('Analyysin tulos on puutteellinen. Yritä uudelleen.');
                }

                setResult(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Tuntematon virhe');
            } finally {
                setIsLoading(false);
            }
        };

        analyze();
    }, [companyName, websiteUrl]);

    // Loading state
    if (isLoading) {
        return (
            <AnalysisProgress
                companyName={companyName}
                logoUrl={getCompanyLogoUrl(websiteUrl)}
            />
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4" role="alert" aria-live="assertive">
                <div className="max-w-md text-center">
                    <p className="text-6xl mb-4" aria-hidden="true">😕</p>
                    <h1 className="text-2xl font-bold text-white mb-4">Hups! Jotain meni pieleen</h1>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-all"
                    >
                        ← Yritä uudelleen
                    </Link>
                </div>
            </div>
        );
    }

    // Results
    if (!result) return null;

    const sortedTrends = (Object.keys(MEGATRENDS) as MegatrendKey[])
        .map((key) => ({
            key,
            ...MEGATRENDS[key],
            ...result.megatrendScores[key],
        }))
        .sort((a, b) => b.score - a.score);

    return (
        <div className="min-h-screen bg-slate-950 noise text-slate-50">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px] animate-pulse-soft" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 py-8 md:py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <p className="text-teal-400 text-sm tracking-[0.2em] mb-2">MEGATRENDIPROFIILI 2026</p>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">{result.company.name}</h1>
                        <p className="text-slate-400 mt-2">{result.company.industry}</p>
                    </div>

                    {/* Main attraction: FlipCard */}
                    <div className="mb-12">
                        <FlipCard data={result} />
                    </div>

                    {/* CTAs - Big and clear */}
                    <div className="mb-12">
                        <ShareButtons data={result} />
                    </div>

                    {/* Megatrend Analysis - Detailed breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass rounded-2xl p-6 md:p-8 mb-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <span className="text-3xl">📊</span> Megatrendianalyysi
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {sortedTrends.map(({ key, emoji, label, color, score, reasoning }) => (
                                <div key={key} className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/30 hover:border-slate-600 transition-colors">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-2xl">{emoji}</span>
                                        <span className="font-semibold text-white text-lg">{label}</span>
                                    </div>
                                    {/* Score bar */}
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${score}%` }}
                                            transition={{ duration: 0.8, delay: 0.2 }}
                                            className="h-full rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                    </div>
                                    <p className="text-sm text-slate-300 leading-relaxed">{reasoning}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Wild card - Full detail */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-2xl p-6 md:p-8 mb-12"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">⚠️</span>
                            <h3 className="text-xl font-bold text-amber-400">VILLI KORTTI – Varaudu tähän</h3>
                        </div>
                        <h4 className="text-xl font-semibold text-white mb-3">{result.wildCard.title}</h4>
                        <p className="text-slate-300 leading-relaxed">{result.wildCard.description}</p>
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 rounded-full text-sm text-amber-300">
                            <span>Todennäköisyys:</span>
                            <span className="font-semibold">
                                {result.wildCard.likelihood === 'low' ? 'Matala' :
                                    result.wildCard.likelihood === 'medium' ? 'Keskitaso' : 'Korkea'}
                            </span>
                        </div>
                    </motion.div>

                    {/* Consulting CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-br from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-2xl p-6 md:p-8 mb-8"
                    >
                        <h2 className="text-xl font-bold text-white mb-4">Tarvitsetko käytännönläheistä tekoälykonsulttia?</h2>
                        <p className="text-slate-300 leading-relaxed mb-6">
                            Megatrendikoneen on rakentanut <strong className="text-white">Olli Laitinen</strong>,
                            tekoälykonsultti, joka auttaa organisaatioita hyödyntämään tekoälyä käytännönläheisesti
                            ja strategisesti – yhdistäen liiketoimintatarpeet, modernin teknologian ja toteutuksen,
                            joka tuottaa hyötyä arjessa.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="https://ollilaitinen.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-xl transition-all shadow-lg"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                ollilaitinen.com
                            </a>
                            <a
                                href="https://www.linkedin.com/in/olli-laitinen/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold rounded-xl transition-all"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                LinkedIn
                            </a>
                            <a
                                href="https://github.com/Ollilai/Megatrendikone"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                                </svg>
                                GitHub
                            </a>
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <p className="text-center text-sm text-slate-500">
                        <Link href="/about" className="text-teal-400 hover:underline">
                            Tietoa palvelusta
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default function AnalyzePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
            </div>
        }>
            <AnalyzeContent />
        </Suspense>
    );
}
