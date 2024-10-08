import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "bucket.pego.dev",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias["html-dom-parser"] = path.resolve(
        "./node_modules/html-dom-parser/lib/server/html-to-dom.js"
      );
    }
    return config;
  },
};

export default nextConfig;
