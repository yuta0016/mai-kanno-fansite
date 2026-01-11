import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.mai-kanno-fansite.net',
          },
        ],
        destination: 'https://mai-kanno-fansite.net/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
