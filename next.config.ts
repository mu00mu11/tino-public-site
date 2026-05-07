import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Supabase Storage の cast-photos public URL を許可
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jiaqczrudvkixbqpwqkj.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
