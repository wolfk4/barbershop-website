

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
    images: {
    domains: ['www.vets4pets.com', 'www.prada.com'],
  },
    typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;