/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverOptions: {
    host: '0.0.0.0',
    port: 3001
  }
}

module.exports = nextConfig
