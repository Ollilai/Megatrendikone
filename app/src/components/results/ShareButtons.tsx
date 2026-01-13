'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import Link from 'next/link';
import { type AnalysisResult } from '@/lib/megatrends';
import { DownloadableCard } from './DownloadableCard';

interface ShareButtonsProps {
    data: AnalysisResult;
}

export function ShareButtons({ data }: ShareButtonsProps) {
    const [downloading, setDownloading] = useState(false);
    const downloadRef = useRef<HTMLDivElement>(null);

    const handleDownloadImage = async () => {
        if (downloading || !downloadRef.current) return;
        setDownloading(true);

        try {
            // Capture both card sides as a single image
            const dataUrl = await toPng(downloadRef.current, {
                quality: 0.95,
                pixelRatio: 2,
                backgroundColor: '#0f172a',
            });

            // Download the image
            const link = document.createElement('a');
            link.download = `${data.company.name.toLowerCase().replace(/\s+/g, '-')}-tulevaisuuskortti.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error('Download failed:', error);
            alert('Lataus epäonnistui. Kokeile uudelleen.');
        } finally {
            setDownloading(false);
        }
    };

    const handleShareLinkedIn = () => {
        const text = `🔮 ${data.company.name} ja megatrendit 2026\n\n#1 Mahdollisuus: ${data.topOpportunity.title}\n\nTutustu organisaatiosi megatrendiprofiiliin: megatrendikone.fi`;
        const url = 'https://megatrendikone.fi';
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`;
        window.open(linkedInUrl, '_blank', 'width=600,height=600');
    };

    return (
        <>
            {/* Hidden downloadable card for image generation */}
            <div
                style={{
                    position: 'absolute',
                    left: '-9999px',
                    top: 0,
                    opacity: 0,
                    pointerEvents: 'none',
                }}
                aria-hidden="true"
            >
                <DownloadableCard ref={downloadRef} data={data} />
            </div>

            <div className="flex flex-col items-center gap-4">
                {/* Primary CTAs */}
                <div className="flex flex-wrap gap-4 justify-center">
                    <button
                        onClick={handleDownloadImage}
                        disabled={downloading}
                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-glow-teal transform hover:-translate-y-0.5"
                    >
                        {downloading ? (
                            <>
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Ladataan...
                            </>
                        ) : (
                            <>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Lataa tulevaisuuskortti
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleShareLinkedIn}
                        className="flex items-center gap-3 px-8 py-4 bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-lg rounded-xl transition-all shadow-lg transform hover:-translate-y-0.5"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                        Jaa LinkedInissä
                    </button>
                </div>

                {/* Secondary CTA */}
                <Link
                    href="/"
                    className="flex items-center gap-2 px-6 py-3 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 hover:bg-slate-800/50"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Analysoi uusi organisaatio
                </Link>
            </div>
        </>
    );
}
