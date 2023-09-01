/** @type {import('next').NextConfig} */
const { NEXT_PUBLIC_API_BASE_URL } = process.env;

const nextConfig = {
  reactStrictMode: true,
}
module.exports = nextConfig

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' http://168.75.75.99:8080",
          },
        ],
      }
    ]
  }
}