'use client';

import React from 'react';
import Link from 'next/link';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Log error to console in development
        console.error('Error boundary caught:', error, errorInfo);

        // Send to Sentry in production
        if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
            import('@sentry/nextjs').then((Sentry) => {
                Sentry.captureException(error, {
                    contexts: {
                        react: {
                            componentStack: errorInfo.componentStack,
                        },
                    },
                });
            });
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-950 noise flex items-center justify-center px-4">
                    <div className="max-w-md text-center">
                        <div className="mb-6">
                            <p className="text-6xl mb-4" aria-hidden="true">⚠️</p>
                            <h1 className="text-3xl font-bold text-white mb-4">
                                Jotain meni vikaan
                            </h1>
                            <p className="text-slate-400 mb-6">
                                Pahoittelut! Sovelluksessa tapahtui odottamaton virhe.
                                Tiimimme on saanut ilmoituksen asiasta.
                            </p>
                            {process.env.NODE_ENV === 'development' && this.state.error && (
                                <details className="text-left bg-slate-900 p-4 rounded-lg mb-6 text-sm text-slate-300">
                                    <summary className="cursor-pointer font-semibold mb-2">
                                        Kehittäjätiedot
                                    </summary>
                                    <pre className="whitespace-pre-wrap overflow-auto">
                                        {this.state.error.message}
                                        {'\n\n'}
                                        {this.state.error.stack}
                                    </pre>
                                </details>
                            )}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        this.setState({ hasError: false, error: null });
                                        window.location.reload();
                                    }}
                                    className="px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-all"
                                >
                                    Yritä uudelleen
                                </button>
                                <Link
                                    href="/"
                                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all"
                                >
                                    Palaa etusivulle
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
