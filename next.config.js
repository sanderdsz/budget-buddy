/** @type {import('next').NextConfig} */
const { NEXT_PUBLIC_API_BASE_URL } = process.env;

const nextConfig = {
  reactStrictMode: true,
  headers: [
    {
      key: 'Content-Security-Policy',
      value: `default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self'; connect-src 'self' ${NEXT_PUBLIC_API_BASE_URL};`,
    }
  ]
}

module.exports = nextConfig
