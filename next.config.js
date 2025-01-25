/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverOptions: {
    host: '0.0.0.0',
    port: 3001
  },
  images: {
    domains: ['cdn2.thedogapi.com', 'pixabay.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://pixabay.com/:path*',
      },
      {
        source: '/api/dogapi/:path*',
        destination: 'https://api.thedogapi.com/v1/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
