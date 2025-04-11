import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8001/:path*', // redireciona para o Laravel
      },
    ];
  },
  // Adicione outras configurações se necessário
};

export default nextConfig;
