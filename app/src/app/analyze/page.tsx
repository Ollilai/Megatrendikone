'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AnalysisProgress } from '@/components/loading/AnalysisProgress';
import { FlipCard } from '@/components/results/FlipCard';
import { ShareButtons } from '@/components/results/ShareButtons';
import { type AnalysisResult, MEGATRENDS, type MegatrendKey, getCompanyLogoUrl } from '@/lib/megatrends';

function AnalyzeContent() {
    const searchParams = useSearchParams();
    const companyName = searchParams.get('company') || '';
    const websiteUrl = searchParams.get('url') || '';

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [result, setResult] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        if (!companyName || !websiteUrl) {
            setError('Yrityksen nimi ja verkkosivujen osoite puuttuvat');
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
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
                <div className="max-w-md text-center">
                    <p className="text-6xl mb-4">😕</p>
                    <h1 className="text-2xl font-bold text-white mb-4">Hups! Jotain meni pieleen</h1>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-all"
                    >
                        ← Yritä uudelleen
                    </a>
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
                    className="max-w-6xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <p className="text-teal-400 text-sm tracking-[0.2em] mb-2">MEGATRENDIPROFIILI 2026</p>
                        <h1 className="text-3xl md:text-4xl font-bold text-white">{result.company.name}</h1>
                        <p className="text-slate-400 mt-2">{result.company.industry}</p>
                    </div>

                    {/* Main layout - Card on left, details on right */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-8">
                        {/* Left: Flip Card */}
                        <div className="flex items-start justify-center">
                            <FlipCard data={result} />
                        </div>

                        {/* Right: Details */}
                        <div className="space-y-6">
                            {/* Score details with reasoning */}
                            <div className="glass rounded-2xl p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="text-2xl">📊</span> Megatrendianalyysi
                                </h2>
                                <div className="space-y-4">
                                    {sortedTrends.map(({ key, emoji, label, color, score, reasoning }) => (
                                        <div key={key} className="bg-slate-900/50 rounded-xl p-5 border border-slate-700/30 hover:border-slate-600 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="flex items-center gap-2">
                                                    <span className="text-xl">{emoji}</span>
                                                    <span className="font-semibold text-white">{label}</span>
                                                </span>
                                                <span className="text-xl font-bold text-white">{score}%</span>
                                            </div>
                                            <p className="text-sm text-slate-300 leading-relaxed">{reasoning}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Wild card */}
                            <div className="bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20 rounded-2xl p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">⚠️</span>
                                    <h3 className="text-lg font-bold text-amber-400">VILLI KORTTI</h3>
                                </div>
                                <h4 className="text-lg font-semibold text-white mb-2">{result.wildCard.title}</h4>
                                <p className="text-slate-300">{result.wildCard.description}</p>
                            </div>

                            {/* Insights */}
                            <div className="glass rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="text-xl">💡</span> Keskeiset havainnot
                                </h3>
                                <ul className="space-y-3">
                                    {result.insights.map((insight, i) => (
                                        <li key={i} className="flex items-start gap-3 text-slate-300 p-3 bg-slate-900/30 rounded-lg hover:bg-slate-900/50 transition-colors">
                                            <span className="text-primary-400 mt-0.5">•</span>
                                            <span className="text-sm">{insight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Share section */}
                    <ShareButtons data={result} />

                    {/* Footer */}
                    <p className="mt-12 text-center text-sm text-slate-500">
                        Lähde:{' '}
                        <a
                            href="https://www.sitra.fi/julkaisut/megatrendit-2026/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-400 hover:underline"
                        >
                            Sitra, Megatrendit 2026
                        </a>{' '}
                        (CC BY-SA 4.0)
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
