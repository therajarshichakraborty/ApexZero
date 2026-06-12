import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    //@ts-ignore
    turbo: {
      rules: {},
    },
  },
};

export default nextConfig;
