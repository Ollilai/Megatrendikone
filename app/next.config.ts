import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 't1.gstatic.com', // Google Favicon API
      },
      {
        protocol: 'https',
        hostname: 't2.gstatic.com', // Google Favicon API
      },
      {
        protocol: 'https',
        hostname: 't3.gstatic.com', // Google Favicon API
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },

  // Compression
  compress: true,

  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,

  // Enable SWC minification
  swcMinify: true,

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['framer-motion', '@react-pdf/renderer'],
  },
};

export default nextConfig;
