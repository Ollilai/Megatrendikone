import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const imageUrl = searchParams.get('imageUrl');
        const companyName = searchParams.get('companyName') || '';
        const oppTitle = searchParams.get('oppTitle') || '';

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
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Image container */}
                        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex' }}>
                            {imageUrl ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                    src={imageUrl}
                                    alt={`${companyName} tulevaisuudessa`}
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
                                        flexDirection: 'column',
                                    }}
                                >
                                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔮</div>
                                    <p style={{ fontSize: '18px', color: '#94a3b8' }}>Tulevaisuuskuva ei saatavilla</p>
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
                        <div style={{ padding: '48px', backgroundColor: '#1e293b', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: 'white', margin: '0 0 4px' }}>{companyName}</h3>
                                <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>Tulevaisuuskuva 2026</p>
                            </div>
                            <p style={{ fontSize: '20px', color: '#e2e8f0', margin: '0 0 16px' }}>
                                {oppTitle}
                            </p>
                            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                                megatrendikone.vercel.app
                            </p>
                        </div>
                    </div>
                </div>
            ),
            {
                width: 1080,
                height: 1350,
            }
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
