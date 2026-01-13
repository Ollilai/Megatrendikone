'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { type AnalysisResult, MEGATRENDS, type MegatrendKey } from '@/lib/megatrends';

interface FlipCardProps {
    data: AnalysisResult;
}

export function FlipCard({ data }: FlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [flipAnnouncement, setFlipAnnouncement] = useState('');

    const handleFlip = () => {
        const newFlipped = !isFlipped;
        setIsFlipped(newFlipped);
        setFlipAnnouncement(
            newFlipped
                ? 'Kortti käännetty: Näytetään tulevaisuusvisio'
                : 'Kortti käännetty: Näytetään megatrendipisteet'
        );
    };

    const sortedTrends = (Object.keys(MEGATRENDS) as MegatrendKey[])
        .map((key) => ({
            key,
            ...MEGATRENDS[key],
            score: data.megatrendScores[key].score,
        }))
        .sort((a, b) => b.score - a.score);

    const companyInitial = data.company.name.charAt(0).toUpperCase();

    return (
        <div className="relative w-full max-w-md mx-auto" style={{ perspective: '1000px' }}>
            {/* Screen reader announcement for flip state */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {flipAnnouncement}
            </div>

            {/* click hint */}
            <p className="text-center text-sm text-slate-400 mb-4" id="flip-hint">
                👆 Klikkaa tai paina Enter kääntääksesi
            </p>

            {/* Card container */}
            <div
                role="button"
                tabIndex={0}
                aria-label="Megatrendikortti: Etupuolella megatrendipisteet, takapuolella tulevaisuusvisio. Käännä painamalla Enter tai välilyönti."
                aria-details="flip-hint"
                className="relative cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/50 rounded-2xl group transition-transform duration-500 hover:scale-[1.02]"
                style={{
                    perspective: '1000px',
                    width: '100%',
                    aspectRatio: '4/5',
                }}
                onClick={handleFlip}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleFlip();
                    }
                }}
            >
                <motion.div
                    className="w-full h-full relative"
                    style={{
                        transformStyle: 'preserve-3d',
                    }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                    {/* Front side - Megatrend scores */}
                    <div
                        className="absolute inset-0 rounded-2xl overflow-hidden"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                        }}
                    >
                        <div className="w-full h-full bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl relative">
                            {/* Gradient mesh bg */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-slate-900 to-accent-900/20" />

                            <div className="relative z-10 p-6 flex flex-col h-full">
                                {/* Header */}
                                <div className="text-center mb-4">
                                    <p className="text-primary-400 text-xs font-bold tracking-[0.2em] mb-2 uppercase">Megatrendiprofiili 2026</p>
                                    <div className="flex items-center justify-center gap-4 mb-2">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 flex items-center justify-center text-xl font-bold">
                                            {companyInitial}
                                        </div>
                                        <div className="text-left">
                                            <h2 className="text-lg font-bold text-white leading-tight">{data.company.name}</h2>
                                            <p className="text-xs text-slate-400">{data.company.industry}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-4" />

                                {/* Scores */}
                                <div className="flex-1 space-y-3">
                                    {sortedTrends.map(({ key, emoji, label, color, score }) => (
                                        <div key={key}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="flex items-center gap-2">
                                                    <span className="text-lg">{emoji}</span>
                                                    <span className="text-xs font-semibold text-white">{label}</span>
                                                </span>
                                                <span className="text-sm font-bold text-white">{score}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${score}%` }}
                                                    transition={{ duration: 0.8, delay: 0.2 }}
                                                    className="h-full rounded-full"
                                                    style={{ backgroundColor: color }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent my-4" />

                                {/* Top opportunity */}
                                <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">🎯</span>
                                        <span className="text-xs font-bold text-teal-400">#1 MAHDOLLISUUS</span>
                                    </div>
                                    <p className="text-sm font-semibold text-white">{data.topOpportunity.title}</p>
                                </div>

                                {/* Footer */}
                                <div className="mt-4 text-center text-xs text-slate-500">
                                    megatrendikone.fi • Lähde: Sitra 2026
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Back side - Future vision image */}
                    <div
                        className="absolute inset-0 rounded-2xl overflow-hidden"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(180deg)',
                        }}
                    >
                        <div className="w-full h-full bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative group">
                            {/* Image container */}
                            <div className="flex-1 relative overflow-hidden">
                                {data.futureImageUrl ? (
                                    <img
                                        src={data.futureImageUrl}
                                        alt="Tulevaisuusvisio"
                                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                                        <div className="text-center text-slate-400">
                                            <span className="text-4xl mb-2 block">🔮</span>
                                            <p className="text-sm">Tulevaisuuskuva ei saatavilla</p>
                                        </div>
                                    </div>
                                )}

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                            </div>

                            {/* Text overlay at bottom */}
                            <div className="p-6 bg-slate-900/90 backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">🔮</span>
                                    <h3 className="text-lg font-bold text-white">Tulevaisuusvisio</h3>
                                </div>
                                <p className="text-sm text-slate-300 mb-2">
                                    {data.company.name}n tulevaisuus: {data.topOpportunity.title.toLowerCase()}
                                </p>
                                <p className="text-xs text-slate-500">
                                    Kuva generoitu tekoälyllä megatrendianalyysin perusteella
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Side indicator */}
            <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Kortin puoli">
                <button
                    onClick={() => {
                        if (isFlipped) {
                            setIsFlipped(false);
                            setFlipAnnouncement('Kortti käännetty: Näytetään megatrendipisteet');
                        }
                    }}
                    aria-label="Näytä etupuoli: Megatrendipisteet"
                    aria-selected={!isFlipped}
                    role="tab"
                    className={`w-2 h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${!isFlipped ? 'bg-teal-400 w-6' : 'bg-slate-600'
                        }`}
                />
                <button
                    onClick={() => {
                        if (!isFlipped) {
                            setIsFlipped(true);
                            setFlipAnnouncement('Kortti käännetty: Näytetään tulevaisuusvisio');
                        }
                    }}
                    aria-label="Näytä takapuoli: Tulevaisuusvisio"
                    aria-selected={isFlipped}
                    role="tab"
                    className={`w-2 h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${isFlipped ? 'bg-teal-400 w-6' : 'bg-slate-600'
                        }`}
                />
            </div>
        </div>
    );
}
