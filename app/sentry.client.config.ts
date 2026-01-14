/**
 * Sentry Client-side Configuration
 * Automatically loaded by @sentry/nextjs
 */

import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,

    // Performance Monitoring
    tracesSampleRate: 0.1, // 10% of transactions for performance

    // Session Replay (optional, can capture user sessions)
    replaysOnErrorSampleRate: 0.5, // 50% of errors
    replaysSessionSampleRate: 0, // Don't capture normal sessions

    // Integrations
    integrations: [
        Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
        }),
    ],

    // Don't send in development
    enabled: process.env.NODE_ENV === 'production',

    // Ignore common browser errors
    ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection',
        'NetworkError',
        'Failed to fetch',
    ],

    // Tag all events with release version
    beforeSend(event) {
        // Don't send events in development
        if (process.env.NODE_ENV !== 'production') {
            return null;
        }
        return event;
    },
});
