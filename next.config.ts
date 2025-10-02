import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maroon-fantastic-crab-577.mypinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
};

export default nextConfig;