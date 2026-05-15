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
  webpack: (config, { isServer, webpack }) => {
    // 1. Your existing fallbacks
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

    // 2. Clear the node: prefix scheme error for browser builds
    if (!isServer) {
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /^node:/,
          (resource) => {
            resource.request = resource.request.replace(/^node:/, '');
          }
        )
      );
    }

    return config;
  },
};

module.exports = nextConfig;
