import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Vercel deployment
  output: 'standalone',
  
  // Enable static optimization for client-side pages
  experimental: {
    optimizePackageImports: ['lucide-react', '@clerk/nextjs'],
  },
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coingecko.com',
      },
    ],
  },
  
  // Reduce serverless functions by grouping routes
  // All pages are client-side, so they can be statically optimized
};

export default nextConfig;
