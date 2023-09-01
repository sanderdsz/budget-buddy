/** @type {import('next').NextConfig} */
const { NEXT_PUBLIC_API_BASE_URL } = process.env;

const nextConfig = {
  reactStrictMode: true,
}
module.exports = nextConfig

const ContentSecurityPolicy = `
  default-src 'self' 'unsafe-inline';
  script-src 'self' 'unsafe-inline';
  child-src example.com;
  style-src 'self' example.com fonts.googleapis.com;
  style-src-elem 'self' example.com;
  font-src 'self';
  connect-src http://168.75.75.99:8080;
`;

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
          },
        ],
      }
    ]
  }
}