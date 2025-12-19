// const { withSentryConfig } = require("@sentry/nextjs");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
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
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
        ],
      },
    ];
  },
  
  env: {
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  },
  
  // Performance optimizations
  reactStrictMode: true,
  swcMinify: true,
  
  // Optimize builds
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
    },
  },
  
  // Transpile workspace packages
  transpilePackages: ['@aspire/ui', '@aspire/lib'],
  
  // Webpack configuration for optional dependencies
  webpack: (config, { isServer }) => {
    // Make optional dependencies external to avoid build errors
    // These will be dynamically imported at runtime if needed
    config.resolve.alias = {
      ...config.resolve.alias,
      'speakeasy': false,
      'qrcode': false,
      '@sentry/nextjs': false,
    };
    
    // For server-side, use externals
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'speakeasy': 'commonjs speakeasy',
        'qrcode': 'commonjs qrcode',
        '@sentry/nextjs': 'commonjs @sentry/nextjs',
      });
    }
    
    return config;
  },
}

// Sentry configuration - disabled for development
module.exports = nextConfig