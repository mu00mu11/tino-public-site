import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // cast-photos バケットだけに絞る (security-reviewer MEDIUM-1)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jiaqczrudvkixbqpwqkj.supabase.co',
        pathname: '/storage/v1/object/public/cast-photos/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },                  // クリックジャッキング防止
          { key: 'X-Content-Type-Options', value: 'nosniff' },        // MIMEスニッフィング防止
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
};

export default nextConfig;
