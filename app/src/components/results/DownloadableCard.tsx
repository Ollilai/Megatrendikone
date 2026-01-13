'use client';

import { forwardRef } from 'react';
import { type AnalysisResult, MEGATRENDS, type MegatrendKey } from '@/lib/megatrends';

interface DownloadableCardProps {
    data: AnalysisResult;
}

export const DownloadableCard = forwardRef<HTMLDivElement, DownloadableCardProps>(
    function DownloadableCard({ data }, ref) {
        const sortedTrends = (Object.keys(MEGATRENDS) as MegatrendKey[])
            .map((key) => ({
                key,
                ...MEGATRENDS[key],
                score: data.megatrendScores[key].score,
            }))
            .sort((a, b) => b.score - a.score);

        const companyInitial = data.company.name.charAt(0).toUpperCase();

        return (
            <div
                ref={ref}
                style={{
                    width: '1080px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '32px',
                    padding: '32px',
                    backgroundColor: '#0f172a',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
            >
                {/* Page 1: Megatrend scores */}
                <div
                    style={{
                        width: '1016px',
                        height: '1270px',
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
                            <p style={{ color: '#14b8a6', fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.2em', marginBottom: '16px', textTransform: 'uppercase' }}>
                                Megatrendiprofiili 2026
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
                                    <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: 0 }}>{data.company.name}</h2>
                                    <p style={{ fontSize: '16px', color: '#94a3b8', margin: '4px 0 0' }}>{data.company.industry}</p>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #475569, transparent)', marginBottom: '32px' }} />

                        {/* Scores */}
                        <div style={{ flex: 1 }}>
                            {sortedTrends.map(({ key, emoji, label, color, score }) => (
                                <div key={key} style={{ marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '28px' }}>{emoji}</span>
                                            <span style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>{label}</span>
                                        </span>
                                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white' }}>{score}%</span>
                                    </div>
                                    <div style={{ height: '16px', backgroundColor: '#334155', borderRadius: '8px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                width: `${score}%`,
                                                height: '100%',
                                                backgroundColor: color,
                                                borderRadius: '8px',
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #475569, transparent)', margin: '24px 0' }} />

                        {/* Top opportunity */}
                        <div
                            style={{
                                backgroundColor: 'rgba(20, 184, 166, 0.1)',
                                border: '1px solid rgba(20, 184, 166, 0.2)',
                                borderRadius: '16px',
                                padding: '24px',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '24px' }}>🎯</span>
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#14b8a6' }}>#1 MAHDOLLISUUS</span>
                            </div>
                            <p style={{ fontSize: '20px', fontWeight: '600', color: 'white', margin: 0 }}>{data.topOpportunity.title}</p>
                            <p style={{ fontSize: '14px', color: '#94a3b8', margin: '8px 0 0' }}>{data.topOpportunity.description}</p>
                        </div>

                        {/* Footer */}
                        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
                            megatrendikone.fi
                        </div>
                    </div>
                </div>

                {/* Page 2: Future vision */}
                <div
                    style={{
                        width: '1016px',
                        height: '1270px',
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
                                alt="Tulevaisuusvisio"
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
                                background: 'linear-gradient(to top, #1e293b, transparent 50%)',
                            }}
                        />
                    </div>

                    {/* Text overlay at bottom */}
                    <div style={{ padding: '48px', backgroundColor: 'rgba(30, 41, 59, 0.95)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '36px' }}>🔮</span>
                            <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: 0 }}>Tulevaisuusvisio</h3>
                        </div>
                        <p style={{ fontSize: '20px', color: '#e2e8f0', margin: '0 0 8px' }}>
                            {data.company.name}n tulevaisuus: {data.topOpportunity.title.toLowerCase()}
                        </p>
                        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                            Kuva generoitu tekoälyllä megatrendianalyysin perusteella
                        </p>

                        {/* Wild card */}
                        <div
                            style={{
                                marginTop: '24px',
                                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                border: '1px solid rgba(245, 158, 11, 0.2)',
                                borderRadius: '16px',
                                padding: '20px',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <span style={{ fontSize: '20px' }}>⚠️</span>
                                <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#f59e0b' }}>VILLI KORTTI</span>
                            </div>
                            <p style={{ fontSize: '16px', fontWeight: '600', color: 'white', margin: '0 0 4px' }}>{data.wildCard.title}</p>
                            <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>{data.wildCard.description}</p>
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
