/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.imgur.com', 'imgur.com'],
  },
  experimental: {
    // Remove appDir as it's no longer needed in Next.js 14
  }
}

module.exports = nextConfig 