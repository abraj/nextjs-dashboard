/** @type {import('next').NextConfig} */

const nextConfig = {
  output: process.env.OUTPUT,
  images: {
    unoptimized: process.env.OUTPUT === 'export',
  },
};

export default nextConfig;
