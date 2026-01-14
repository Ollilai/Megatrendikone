/**
 * Next.js Instrumentation for Sentry
 * This file is automatically loaded by Next.js
 */

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        // Server-side Sentry initialization
        const Sentry = await import('@sentry/nextjs');

        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV,

            // Performance Monitoring
            tracesSampleRate: 0.1, // 10% of requests for performance monitoring

            // Capture unhandled promise rejections
            integrations: [
                Sentry.httpIntegration(),
            ],

            // Don't send in development
            enabled: process.env.NODE_ENV === 'production',

            // Ignore common non-critical errors
            ignoreErrors: [
                'AbortError',
                'Non-Error promise rejection',
                'NetworkError',
            ],
        });
    }

    if (process.env.NEXT_RUNTIME === 'edge') {
        // Edge runtime Sentry (if using edge functions)
        const Sentry = await import('@sentry/nextjs');

        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV,
            tracesSampleRate: 0.1,
            enabled: process.env.NODE_ENV === 'production',
        });
    }
}
