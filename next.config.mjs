/** @type {import('next').NextConfig} */

const nextConfig = {
  output: process.env.OUTPUT,
  images: {
    unoptimized: process.env.OUTPUT === 'export',
  },
  experimental: {
    ppr: (process.env.OUTPUT !== 'export') && 'incremental',
  },
};

export default nextConfig;
