'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type AnalysisResult } from '@/lib/megatrends';

interface FlipCardProps {
    data: AnalysisResult;
}

export function FlipCard({ data }: FlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [flipAnnouncement, setFlipAnnouncement] = useState('');
    const [hasAutoFlipped, setHasAutoFlipped] = useState(false);

    // Auto-flip after 5 seconds (only once)
    useEffect(() => {
        if (!hasAutoFlipped) {
            const timer = setTimeout(() => {
                setIsFlipped(true);
                setFlipAnnouncement('Kortti käännetty: Näytetään tulevaisuuskuva');
                setHasAutoFlipped(true);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [hasAutoFlipped]);

    const handleFlip = () => {
        const newFlipped = !isFlipped;
        setIsFlipped(newFlipped);
        setFlipAnnouncement(
            newFlipped
                ? 'Kortti käännetty: Näytetään tulevaisuuskuva'
                : 'Kortti käännetty: Näytetään mahdollisuus ja villi kortti'
        );
    };

    const companyInitial = data.company.name.charAt(0).toUpperCase();
    const logoUrl = data.company.logoUrl;

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
            <p className="text-center text-sm text-slate-500 mb-4" id="flip-hint">
                👆 Klikkaa korttia kääntääksesi {!hasAutoFlipped && '(kääntyy automaattisesti)'}
            </p>

            {/* Card container */}
            <div
                role="button"
                tabIndex={0}
                aria-label="Tulevaisuuskortti: Etupuolella mahdollisuus ja villi kortti, takapuolella tulevaisuuskuva. Käännä painamalla Enter tai välilyönti."
                aria-details="flip-hint"
                className="relative cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/50 rounded-2xl group transition-transform duration-500 hover:scale-[1.01]"
                style={{
                    perspective: '1000px',
                    width: '100%',
                    minHeight: '600px',
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
                    className="w-full relative"
                    style={{
                        transformStyle: 'preserve-3d',
                        WebkitTransformStyle: 'preserve-3d',
                        minHeight: '600px',
                    }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                    {/* Front side - Insights & Wild Card */}
                    <div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            transform: 'rotateY(0deg) translateZ(1px)',
                            WebkitTransform: 'rotateY(0deg) translateZ(1px)',
                            zIndex: 2,
                            willChange: 'transform',
                        }}
                    >
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl relative">
                            {/* Gradient mesh bg */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 via-white to-accent-100/50 rounded-2xl" />

                            <div className="relative z-10 p-5">
                                {/* Header */}
                                <div className="text-center mb-3">
                                    <p className="text-primary-600 text-xs font-bold tracking-[0.2em] mb-2 uppercase">Tulevaisuuskortti 2026</p>
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xl font-bold shadow-lg overflow-hidden">
                                            {logoUrl ? (
                                                <img src={logoUrl} alt="" className="w-full h-full object-contain p-1" />
                                            ) : (
                                                companyInitial
                                            )}
                                        </div>
                                        <div className="text-left">
                                            <h2 className="text-lg font-bold text-slate-900 leading-tight">{data.company.name}</h2>
                                            <p className="text-xs text-slate-600">{data.company.industry}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-3" />

                                {/* Top opportunity - equal weight */}
                                <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-4">
                                    <span className="text-xs font-bold text-primary-700 uppercase tracking-wide">Keskeinen mahdollisuus</span>
                                    <p className="text-base font-semibold text-slate-900 mb-2">{data.topOpportunity.title}</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">{data.topOpportunity.description}</p>
                                </div>

                                {/* Wild card - equal weight */}
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Yllättävä uhka</span>
                                    <p className="text-base font-semibold text-slate-900 mb-2">{data.wildCard.title}</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">{data.wildCard.description}</p>
                                </div>

                                <div className="mt-3 text-center text-xs text-slate-500">
                                    megatrendikone.vercel.app
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
                            transform: 'rotateY(180deg) translateZ(1px)',
                            WebkitTransform: 'rotateY(180deg) translateZ(1px)',
                            zIndex: 1,
                            willChange: 'transform',
                        }}
                    >
                        <div className="w-full h-full bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative group">
                            {/* Image container */}
                            <div className="flex-1 relative overflow-hidden">
                                {data.futureImageUrl ? (
                                    <img
                                        src={data.futureImageUrl}
                                        alt={`${data.company.name} tulevaisuudessa`}
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
                                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                            </div>

                            {/* Text overlay at bottom */}
                            <div className="p-6 bg-white/95 backdrop-blur-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-lg font-bold overflow-hidden">
                                        {logoUrl ? (
                                            <img src={logoUrl} alt="" className="w-full h-full object-contain p-1" />
                                        ) : (
                                            companyInitial
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900">{data.company.name}</h3>
                                        <p className="text-xs text-slate-600">Tulevaisuuskuva 2026</p>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600">
                                    {data.topOpportunity.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-2">
                                    megatrendikone.vercel.app
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
                            setFlipAnnouncement('Kortti käännetty: Näytetään mahdollisuus ja villi kortti');
                        }
                    }}
                    aria-label="Näytä etupuoli: Mahdollisuus ja villi kortti"
                    aria-selected={!isFlipped}
                    role="tab"
                    className={`w-2 h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${!isFlipped ? 'bg-primary-600 w-6' : 'bg-slate-300'
                        }`}
                />
                <button
                    onClick={() => {
                        if (!isFlipped) {
                            setIsFlipped(true);
                            setFlipAnnouncement('Kortti käännetty: Näytetään tulevaisuuskuva');
                        }
                    }}
                    aria-label="Näytä takapuoli: Tulevaisuuskuva"
                    aria-selected={isFlipped}
                    role="tab"
                    className={`w-2 h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 ${isFlipped ? 'bg-primary-600 w-6' : 'bg-slate-300'
                        }`}
                />
            </div>
        </div>
    );
}
