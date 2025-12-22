// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better error detection
  reactStrictMode: true,
  
  // Allow images from PokeAPI
  images: {
    domains: ['raw.githubusercontent.com'],
  },
  
  // Optimize for production
  swcMinify: true,
};

export default nextConfig;