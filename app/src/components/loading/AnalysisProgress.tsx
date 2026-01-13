'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LOADING_MESSAGES = [
    'Tutkitaan yritystäsi...',
    'Analysoidaan verkkosivuja...',
    'Sovitetaan megatrendeihin...',
    'Arvioidaan vaikutuksia...',
    'Luodaan profiiliasi...',
];

interface AnalysisProgressProps {
    companyName: string;
    logoUrl?: string;
}

export function AnalysisProgress({ companyName, logoUrl }: AnalysisProgressProps) {
    const [messageIndex, setMessageIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Rotate messages every 6 seconds
        const messageInterval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 6000);

        // Animate progress bar (reach 90% in ~30s)
        const progressInterval = setInterval(() => {
            setProgress((prev) => Math.min(prev + 2, 90));
        }, 700);

        return () => {
            clearInterval(messageInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full text-center"
            >
                {/* Company logo */}
                {logoUrl && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                    >
                        <img
                            src={logoUrl}
                            alt={companyName}
                            className="w-16 h-16 mx-auto rounded-xl bg-white p-2"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                    </motion.div>
                )}

                {/* Company name */}
                <h2 className="text-2xl font-bold text-white mb-8">{companyName}</h2>

                {/* Animated spinner */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-t-teal-400 border-r-transparent border-b-transparent border-l-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className="absolute inset-2 rounded-full bg-slate-800/50 flex items-center justify-center">
                        <span className="text-teal-400 font-bold">{progress}%</span>
                    </div>
                </div>

                {/* Status message */}
                <motion.p
                    key={messageIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-lg text-slate-300"
                >
                    {LOADING_MESSAGES[messageIndex]}
                </motion.p>

                {/* Progress bar */}
                <div className="mt-8 w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-teal-500 to-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {/* Time estimate */}
                <p className="mt-4 text-sm text-slate-500">
                    Analyysi kestää noin 30-60 sekuntia
                </p>
            </motion.div>
        </div>
    );
}
