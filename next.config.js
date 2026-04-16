/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/.well-known/agent-card.json',
        destination: '/api/well-known/agent-card.json',
      },
      {
        source: '/.well-known/agent.json',
        destination: '/api/well-known/agent-card.json',
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'metadata.ens.domains' },
      { protocol: 'https', hostname: '**.ipfs.dweb.link' },
      { protocol: 'https', hostname: '**.ipfs.nftstorage.link' },
      { protocol: 'https', hostname: 'openseauserdata.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'gateway.lighthouse.storage' },
      ...(process.env.NEXT_PUBLIC_ZEROG_GATEWAY ? [{ protocol: new URL(process.env.NEXT_PUBLIC_ZEROG_GATEWAY).protocol.replace(':', ''), hostname: new URL(process.env.NEXT_PUBLIC_ZEROG_GATEWAY).hostname }] : []),
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      "fs/promises": false,
      "node:fs/promises": false,
      "node:fs": false,
      "util": false,
      "path": false,
      "crypto": false
    };
    return config;
  },
};

module.exports = nextConfig;
