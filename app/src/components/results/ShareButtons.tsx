'use client';

import { useState } from 'react';
import { type AnalysisResult } from '@/lib/megatrends';

interface ShareButtonsProps {
    data: AnalysisResult;
}

export function ShareButtons({ data }: ShareButtonsProps) {
    const [downloadingFront, setDownloadingFront] = useState(false);
    const [downloadingBack, setDownloadingBack] = useState(false);

    const baseFilename = data.company.name.toLowerCase().replace(/\s+/g, '-');

    const handleShareOrDownload = async (
        url: string,
        body: Record<string, string>,
        filename: string,
        setLoading: (loading: boolean) => void
    ) => {
        if (downloadingFront || downloadingBack) return;
        setLoading(true);

        try {
            console.log('Fetching image:', url);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error:', errorText);
                throw new Error(`Server error: ${response.status} ${errorText}`);
            }

            const contentType = response.headers.get('content-type');
            console.log('Content-Type:', contentType);

            const blob = await response.blob();
            console.log('Blob size:', blob.size, 'type:', blob.type);

            if (blob.size === 0) {
                throw new Error('Empty response from server');
            }

            const file = new File([blob], filename, { type: 'image/png' });
            console.log('File created:', file.name, file.size, file.type);

            // Try native sharing first (works on mobile)
            if (navigator.share && navigator.canShare({ files: [file] })) {
                console.log('Using native share');
                await navigator.share({
                    files: [file],
                    title: filename,
                });
                console.log('Share completed successfully');
            } else {
                // Fallback to classic download
                console.log('Using classic download');
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => URL.revokeObjectURL(link.href), 100);
                console.log('Download triggered');
            }
        } catch (error) {
            console.error('Download failed:', error);
            console.error('Error details:', error instanceof Error ? error.message : String(error));
            alert(`Lataus epäonnistui: ${error instanceof Error ? error.message : 'Tuntematon virhe'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadFront = () => {
        const body = {
            companyName: data.company.name,
            industry: data.company.industry,
            oppTitle: data.topOpportunity.title,
            oppDesc: data.topOpportunity.description,
            wildTitle: data.wildCard.title,
            wildDesc: data.wildCard.description,
        };
        handleShareOrDownload(
            '/api/og/card',
            body,
            `${baseFilename}-tulevaisuuskortti.png`,
            setDownloadingFront
        );
    };

    const handleDownloadBack = () => {
        const body = {
            imageUrl: data.futureImageUrl || '',
            companyName: data.company.name,
            oppTitle: data.topOpportunity.title,
        };
        handleShareOrDownload(
            '/api/og/image',
            body,
            `${baseFilename}-tulevaisuuskuva.png`,
            setDownloadingBack
        );
    };

    const handleShareLinkedIn = () => {
        const text = `🔮 ${data.company.name} ja megatrendit 2026\n\n#1 Mahdollisuus: ${data.topOpportunity.title}\n\nTutustu organisaatiosi megatrendiprofiiliin: megatrendikone.vercel.app`;
        const url = 'https://megatrendikone.vercel.app';
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`;
        window.open(linkedInUrl, '_blank', 'width=600,height=600');
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Top row: Two download buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
                {/* Left: Download front card */}
                <button
                    onClick={handleDownloadFront}
                    disabled={downloadingFront}
                    className="flex items-center gap-3 px-6 py-3 bg-slate-800 border border-slate-600 hover:border-teal-500/50 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-teal-500/10"
                >
                    {downloadingFront ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Ladataan...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Lataa tulevaisuuskorttisi
                        </>
                    )}
                </button>

                {/* Right: Download back card (future image) */}
                <button
                    onClick={handleDownloadBack}
                    disabled={downloadingBack}
                    className="flex items-center gap-3 px-6 py-3 bg-slate-800 border border-slate-600 hover:border-teal-500/50 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-teal-500/10"
                >
                    {downloadingBack ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Ladataan...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Lataa tulevaisuuskuvasi
                        </>
                    )}
                </button>
            </div>

            {/* Bottom row: LinkedIn share */}
            <button
                onClick={handleShareLinkedIn}
                className="flex items-center gap-3 px-8 py-4 bg-[#0A66C2] hover:bg-[#004182] text-white font-bold text-lg rounded-xl transition-all shadow-lg transform hover:-translate-y-0.5"
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Jaa LinkedInissä
            </button>
        </div>
    );
}
