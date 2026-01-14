'use client';

import { forwardRef } from 'react';
import { type AnalysisResult } from '@/lib/megatrends';

interface DownloadableCardProps {
    data: AnalysisResult;
}

export const DownloadableCardFront = forwardRef<HTMLDivElement, DownloadableCardProps>(
    function DownloadableCardFront({ data }, ref) {
        const companyInitial = data.company.name.charAt(0).toUpperCase();

        return (
            <div
                ref={ref}
                style={{
                    width: '1080px',
                    height: '1350px',
                    padding: '32px',
                    backgroundColor: '#0f172a',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#1e293b',
                        borderRadius: '24px',
                        border: '1px solid rgba(100, 116, 139, 0.3)',
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                >
                    {/* Gradient background */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, #1e293b 50%, rgba(59, 130, 246, 0.1) 100%)',
                        }}
                    />

                    <div style={{ position: 'relative', zIndex: 1, padding: '48px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Header */}
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <p style={{ color: '#14b8a6', fontSize: '16px', fontWeight: 'bold', letterSpacing: '0.2em', marginBottom: '20px', textTransform: 'uppercase' }}>
                                Tulevaisuuskortti 2026
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
                                <div
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '16px',
                                        background: 'linear-gradient(135deg, #14b8a6, #3b82f6)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '36px',
                                        fontWeight: 'bold',
                                        color: 'white',
                                    }}
                                >
                                    {companyInitial}
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: 0 }}>{data.company.name}</h2>
                                    <p style={{ fontSize: '18px', color: '#94a3b8', margin: '4px 0 0' }}>{data.company.industry}</p>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #475569, transparent)', marginBottom: '32px' }} />

                        {/* Top opportunity - equal weight */}
                        <div
                            style={{
                                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                                border: '1px solid rgba(20, 184, 166, 0.2)',
                                borderRadius: '20px',
                                padding: '32px',
                                marginBottom: '32px',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                <span style={{ fontSize: '36px' }}>🎯</span>
                                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.15em' }}>#1 Mahdollisuus</span>
                            </div>
                            <p style={{ fontSize: '28px', fontWeight: '600', color: 'white', margin: '0 0 16px', lineHeight: 1.3 }}>{data.topOpportunity.title}</p>
                            <p style={{ fontSize: '18px', color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>{data.topOpportunity.description}</p>
                        </div>

                        {/* Wild card - equal weight */}
                        <div
                            style={{
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                border: '1px solid rgba(245, 158, 11, 0.2)',
                                borderRadius: '20px',
                                padding: '32px',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                                <span style={{ fontSize: '36px' }}>⚠️</span>
                                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Villi Kortti</span>
                            </div>
                            <p style={{ fontSize: '28px', fontWeight: '600', color: 'white', margin: '0 0 16px', lineHeight: 1.3 }}>{data.wildCard.title}</p>
                            <p style={{ fontSize: '18px', color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>{data.wildCard.description}</p>
                        </div>

                        {/* Footer */}
                        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
                            megatrendikone.fi
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

export const DownloadableCardBack = forwardRef<HTMLDivElement, DownloadableCardProps>(
    function DownloadableCardBack({ data }, ref) {
        const companyInitial = data.company.name.charAt(0).toUpperCase();

        return (
            <div
                ref={ref}
                style={{
                    width: '1080px',
                    height: '1350px',
                    padding: '32px',
                    backgroundColor: '#0f172a',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#1e293b',
                        borderRadius: '24px',
                        border: '1px solid rgba(100, 116, 139, 0.3)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {/* Image container */}
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                        {data.futureImageUrl ? (
                            <img
                                src={data.futureImageUrl}
                                alt={`${data.company.name} tulevaisuudessa`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#334155',
                                }}
                            >
                                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                    <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>🔮</span>
                                    <p style={{ fontSize: '18px' }}>Tulevaisuuskuva ei saatavilla</p>
                                </div>
                            </div>
                        )}

                        {/* Gradient overlay */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, #1e293b, transparent 40%)',
                            }}
                        />
                    </div>

                    {/* Text overlay at bottom */}
                    <div style={{ padding: '48px', backgroundColor: 'rgba(30, 41, 59, 0.98)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
                            <div
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #14b8a6, #3b82f6)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '28px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                }}
                            >
                                {companyInitial}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: 0 }}>{data.company.name}</h3>
                                <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0' }}>Tulevaisuusvisio 2026</p>
                            </div>
                        </div>
                        <p style={{ fontSize: '20px', color: '#e2e8f0', margin: '0 0 16px' }}>
                            {data.topOpportunity.title}
                        </p>
                        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                            megatrendikone.fi
                        </p>
                    </div>
                </div>
            </div>
        );
    }
);
