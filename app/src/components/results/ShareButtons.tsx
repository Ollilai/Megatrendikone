'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { type AnalysisResult } from '@/lib/megatrends';

interface ShareButtonsProps {
    data: AnalysisResult;
}

export function ShareButtons({ data }: ShareButtonsProps) {
    const [downloading, setDownloading] = useState(false);
    const downloadRef = useRef<HTMLDivElement>(null);

    const handleDownloadImage = async () => {
        if (downloading) return;
        setDownloading(true);

        try {
            // Download the future image if available
            if (data.futureImageUrl) {
                const link = document.createElement('a');
                link.download = `${data.company.name.toLowerCase().replace(/\s+/g, '-')}-tulevaisuus.png`;
                link.href = data.futureImageUrl;
                link.click();
            } else {
                alert('Kuvaa ei ole saatavilla ladattavaksi.');
            }
        } catch (error) {
            console.error('Download failed:', error);
            alert('Lataus epäonnistui. Kokeile uudelleen.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="flex flex-wrap gap-4 justify-center">
            <button
                onClick={handleDownloadImage}
                disabled={downloading || !data.futureImageUrl}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-glow-teal transform hover:-translate-y-0.5"
            >
                {downloading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Ladataan...
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Lataa tulevaisuuskuva
                    </>
                )}
            </button>

            <a
                href="/"
                className="flex items-center gap-2 px-6 py-3 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold rounded-xl transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 hover:bg-slate-800/50"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Analysoi toinen yritys
            </a>
        </div>
    );
}
