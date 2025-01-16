/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',  // Enable static export
    distDir: 'out',    // Specify output directory
    images: {
      unoptimized: true, // Required for static export
    },
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://salary-predictor-production.up.railway.app'
    }
  }
  
  module.exports = nextConfig
