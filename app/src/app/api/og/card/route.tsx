import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs'; // Switch to Node.js for better stability

// Load font
const fontData = fetch(
    new URL('https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjp-Ek-_EeA.woff', import.meta.url)
).then((res) => res.arrayBuffer());

export async function POST(req: NextRequest) {
    try {
        const font = await fontData;

        const body = await req.json();
        const companyName = body.companyName || '';
        const industry = body.industry || '';
        const oppTitle = body.oppTitle || '';
        const oppDesc = body.oppDesc || '';
        const wildTitle = body.wildTitle || '';
        const wildDesc = body.wildDesc || '';

        return new ImageResponse(
            (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        padding: '32px',
                        backgroundColor: '#0f172a',
                        display: 'flex',
                        fontFamily: 'sans-serif',
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
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Gradient background */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, #1e293b 50%, rgba(59, 130, 246, 0.1) 100%)',
                                zIndex: 0,
                            }}
                        />

                        <div style={{ position: 'relative', zIndex: 1, padding: '48px', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            {/* Header */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px', textAlign: 'center' }}>
                                <p style={{ color: '#14b8a6', fontSize: '16px', fontWeight: 'bold', letterSpacing: '0.2em', marginBottom: '24px', textTransform: 'uppercase', margin: 0 }}>
                                    Tulevaisuuskortti 2026
                                </p>
                                <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', margin: '24px 0 8px', textAlign: 'center' }}>{companyName}</h2>
                                <p style={{ fontSize: '18px', color: '#94a3b8', margin: 0, textAlign: 'center' }}>{industry}</p>
                            </div>

                            {/* Divider */}
                            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #475569, transparent)', marginBottom: '32px', width: '100%' }} />

                            {/* Top opportunity */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: 'rgba(20, 184, 166, 0.1)',
                                    border: '1px solid rgba(20, 184, 166, 0.2)',
                                    borderRadius: '20px',
                                    padding: '32px',
                                    marginBottom: '32px',
                                }}
                            >
                                <div style={{ display: 'flex', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#14b8a6', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Keskeinen mahdollisuus</span>
                                </div>
                                <p style={{ fontSize: '28px', fontWeight: '600', color: 'white', margin: '0 0 16px', lineHeight: 1.3 }}>{oppTitle}</p>
                                <p style={{ fontSize: '18px', color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>{oppDesc}</p>
                            </div>

                            {/* Wild card */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                    border: '1px solid rgba(245, 158, 11, 0.2)',
                                    borderRadius: '20px',
                                    padding: '32px',
                                }}
                            >
                                <div style={{ display: 'flex', marginBottom: '20px' }}>
                                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Yllättävä uhka</span>
                                </div>
                                <p style={{ fontSize: '28px', fontWeight: '600', color: 'white', margin: '0 0 16px', lineHeight: 1.3 }}>{wildTitle}</p>
                                <p style={{ fontSize: '18px', color: '#cbd5e1', margin: 0, lineHeight: 1.7 }}>{wildDesc}</p>
                            </div>

                            {/* Footer */}
                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'center', fontSize: '14px', color: '#64748b' }}>
                                megatrendikone.vercel.app
                            </div>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1080,
                height: 1350,
                fonts: [
                    {
                        name: 'Inter',
                        data: font,
                        style: 'normal',
                    },
                ],
            }
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
