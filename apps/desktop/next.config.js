/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['@research-hub/ui-components', '@research-hub/utils'],
  },
}

module.exports = nextConfig
