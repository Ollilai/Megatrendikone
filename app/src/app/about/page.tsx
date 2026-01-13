'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-950 noise text-slate-50">
            {/* Background decoration */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px] animate-pulse-soft" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto"
                >
                    {/* Back link */}
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Takaisin etusivulle
                    </Link>

                    <h1 className="text-4xl font-bold text-white mb-8">Tietoa palvelusta</h1>

                    {/* About Megatrendikone */}
                    <section className="glass rounded-2xl p-6 md:p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Mikä on Megatrendikone?</h2>
                        <p className="text-slate-300 leading-relaxed mb-4">
                            Megatrendikone on ilmainen työkalu, joka analysoi miten Sitran tunnistamien neljän megatrendin
                            muuttuvat vaikutukset heijastuvat organisaatioosi. Palvelu hyödyntää tekoälyä ja Sitran avointa dataa
                            luodakseen räätälöidyn analyysin juuri sinun organisaatiollesi.
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                            Soveltuu yrityksille, kunnille, järjestöille ja kaikille organisaatioille, jotka haluavat
                            ymmärtää tulevaisuuden muutosvoimia ja niiden vaikutuksia omaan toimintaansa.
                        </p>
                    </section>

                    {/* About Sitra Megatrends */}
                    <section className="glass rounded-2xl p-6 md:p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Sitran Megatrendit 2026</h2>
                        <p className="text-slate-300 leading-relaxed mb-4">
                            Megatrendikone perustuu Sitran julkaisuun{' '}
                            <a
                                href="https://www.sitra.fi/julkaisut/megatrendit-2026/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-400 hover:underline"
                            >
                                Megatrendit 2026
                            </a>
                            , joka kuvaa neljä suurta muutosvoimaa:
                        </p>
                        <ul className="space-y-3 text-slate-300 mb-4">
                            <li className="flex items-start gap-3">
                                <span className="text-xl">🤖</span>
                                <div>
                                    <strong className="text-white">Teknologia</strong> – Tekoäly mullistaa yhteiskunnan perustaa
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-xl">🌿</span>
                                <div>
                                    <strong className="text-white">Luonto</strong> – Ympäristökriisi pakottaa sopeutumaan
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-xl">👥</span>
                                <div>
                                    <strong className="text-white">Ihmiset</strong> – Suuntana pitkäikäisten yhteiskunta
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-xl">⚖️</span>
                                <div>
                                    <strong className="text-white">Valta</strong> – Maailmanjärjestyksen murros mittaa demokratian voiman
                                </div>
                            </li>
                        </ul>
                        <p className="text-sm text-slate-400">
                            Lähde: Sitra, Megatrendit 2026 (CC BY-SA 4.0)
                        </p>
                    </section>

                    {/* Consulting CTA */}
                    <section className="bg-gradient-to-br from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-2xl p-6 md:p-8 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Tarvetta käytännönläheiselle tekoälykonsultille?</h2>
                        <p className="text-slate-300 leading-relaxed mb-6">
                            Megatrendikoneen on rakentanut <strong className="text-white">Olli Laitinen</strong>,
                            tekoälykonsultti joka auttaa organisaatioita hyödyntämään tekoälyä käytännönläheisesti
                            ja strategisesti. Autamalla yhdistämään liiketoimintatarpeet ja modernin teknologian.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <a
                                href="https://ollilaitinen.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                                ollilaitinen.com
                            </a>
                            <a
                                href="https://www.linkedin.com/in/ollilaitinen/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold rounded-xl transition-all"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                LinkedIn
                            </a>
                        </div>
                    </section>

                    {/* Back button */}
                    <div className="text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-semibold rounded-xl transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Takaisin etusivulle
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
