/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Remove noindex — allow search engines to crawl
          { key: 'X-Robots-Tag', value: 'index, follow' },
        ],
      },
    ];
  },
};

export default nextConfig;
