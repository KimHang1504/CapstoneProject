import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: "https",
        hostname: "ongvove.com",
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
};

export default nextConfig;
