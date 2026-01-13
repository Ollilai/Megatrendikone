'use client';

import { forwardRef } from 'react';
import { MEGATRENDS, type AnalysisResult, type MegatrendKey } from '@/lib/megatrends';

interface MegatrendCardProps {
    data: AnalysisResult;
}

export const MegatrendCard = forwardRef<HTMLDivElement, MegatrendCardProps>(
    function MegatrendCard({ data }, ref) {
        const sortedTrends = (Object.keys(MEGATRENDS) as MegatrendKey[])
            .map((key) => ({
                key,
                ...MEGATRENDS[key],
                score: data.megatrendScores[key].score,
            }))
            .sort((a, b) => b.score - a.score);

        // Get company initial for logo fallback
        const companyInitial = data.company.name.charAt(0).toUpperCase();

        return (
            <div
                ref={ref}
                className="megatrend-card"
                style={{
                    width: '1080px',
                    height: '1350px',
                    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                    padding: '60px',
                    display: 'flex',
                    flexDirection: 'column',
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* Background glow effects */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: '400px',
                    height: '400px',
                    background: 'radial-gradient(circle, rgba(20, 184, 166, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '30%',
                    right: '10%',
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                }} />

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <p style={{
                        color: '#14b8a6',
                        fontSize: '20px',
                        letterSpacing: '0.3em',
                        fontWeight: 500,
                        marginBottom: '10px',
                    }}>
                        MEGATRENDIPROFIILI 2026
                    </p>
                </div>

                {/* Company info */}
                <div style={{ textAlign: 'center', marginBottom: '50px' }}>
                    {/* Company initial circle */}
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '24px',
                        background: 'linear-gradient(135deg, #14b8a6 0%, #3b82f6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        fontSize: '48px',
                        fontWeight: 'bold',
                    }}>
                        {companyInitial}
                    </div>
                    <h1 style={{
                        fontSize: '56px',
                        fontWeight: 'bold',
                        margin: '0 0 12px',
                        lineHeight: 1.1,
                    }}>
                        {data.company.name}
                    </h1>
                    <p style={{
                        fontSize: '24px',
                        color: '#94a3b8',
                        margin: 0,
                    }}>
                        {data.company.industry}
                    </p>
                </div>

                {/* Divider */}
                <div style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, #475569 50%, transparent 100%)',
                    marginBottom: '50px',
                }} />

                {/* Megatrend bars */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {sortedTrends.map(({ key, emoji, label, color, score }) => (
                        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <span style={{ fontSize: '42px', width: '60px' }}>{emoji}</span>
                            <span style={{ fontSize: '22px', fontWeight: 600, width: '180px' }}>{label}</span>
                            <div style={{
                                flex: 1,
                                height: '48px',
                                background: 'rgba(71, 85, 105, 0.4)',
                                borderRadius: '24px',
                                overflow: 'hidden',
                            }}>
                                <div style={{
                                    height: '100%',
                                    width: `${score}%`,
                                    background: `linear-gradient(90deg, ${color} 0%, ${color}cc 100%)`,
                                    borderRadius: '24px',
                                    transition: 'width 0.5s ease',
                                }} />
                            </div>
                            <span style={{
                                fontSize: '28px',
                                fontWeight: 'bold',
                                width: '80px',
                                textAlign: 'right',
                            }}>
                                {score}%
                            </span>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, #475569 50%, transparent 100%)',
                    margin: '40px 0',
                }} />

                {/* Opportunity */}
                <div style={{
                    background: 'rgba(20, 184, 166, 0.1)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    borderRadius: '20px',
                    padding: '28px',
                    marginBottom: '24px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '28px' }}>🎯</span>
                        <span style={{ color: '#14b8a6', fontWeight: 'bold', fontSize: '20px' }}>#1 MAHDOLLISUUS</span>
                    </div>
                    <p style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px' }}>
                        {data.topOpportunity.title}
                    </p>
                    <p style={{ fontSize: '18px', color: '#cbd5e1', margin: 0 }}>
                        {data.topOpportunity.description}
                    </p>
                </div>

                {/* Wild card */}
                <div style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '20px',
                    padding: '28px',
                    marginBottom: '40px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '28px' }}>⚠️</span>
                        <span style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: '20px' }}>VILLI KORTTI</span>
                    </div>
                    <p style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 8px' }}>
                        {data.wildCard.title}
                    </p>
                    <p style={{ fontSize: '18px', color: '#cbd5e1', margin: 0 }}>
                        {data.wildCard.description}
                    </p>
                </div>

                {/* Footer */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: '#64748b',
                    fontSize: '18px',
                }}>
                    <span>megatrendikone.fi</span>
                    <span>Lähde: Sitra, Megatrendit 2026</span>
                </div>
            </div>
        );
    }
);
