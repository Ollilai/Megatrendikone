'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Header } from '@/components/Header';

export default function Home() {
  const [companyName, setCompanyName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!companyName.trim() || !websiteUrl.trim()) {
      setError('Täytä molemmat kentät');
      return;
    }

    // Basic URL validation
    try {
      new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
    } catch {
      setError('Tarkista verkkosivun osoite');
      return;
    }

    setIsLoading(true);

    // Navigate to analyze page with params
    const url = websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`;
    router.push(`/analyze?company=${encodeURIComponent(companyName)}&url=${encodeURIComponent(url)}`);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center px-4 noise">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[100px] animate-pulse-soft" />
          <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[80px]" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl w-full text-center"
      >
        {/* Main headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Miten megatrendit vaikuttavat{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
            sinun organisaatioosi?
          </span>
        </h1>

        <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
          Analysoi organisaatiosi megatrendien valossa ja saa jaettava tulevaisuuskortti.
        </p>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSubmit}
          className="glass rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <div className="space-y-4">
            <Input
              id="companyName"
              label="Organisaation nimi"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="esim. Kone Oyj, Helsingin kaupunki"
              disabled={isLoading}
              fullWidth
            />

            <Input
              id="websiteUrl"
              label="Verkkosivujen osoite"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="esim. kone.fi"
              disabled={isLoading}
              fullWidth
            />
          </div>

          {error && (
            <motion.p
              role="alert"
              aria-live="assertive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-error text-sm mt-4"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            isLoading={isLoading}
            variant="primary"
            fullWidth
            className="mt-6"
          >
            Analysoi
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>
        </motion.form>

        {/* Footer */}
        <p className="mt-8 text-sm text-slate-500">
          <a href="/about" className="text-teal-400 hover:underline">Tietoa palvelusta</a>
        </p>
      </motion.div>
    </div>
    </>
  );
}
