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
  webpack: (config) => {
    config.module.rules = [
      ...config.module.rules,
      {
        test: /html-react-parser\/lib\/index\.js$/,
        resolve: {
          alias: {
            "html-dom-parser": path.join(
              path.dirname(require.resolve("html-dom-parser")),
              "server/html-to-dom.js"
            ),
          },
        },
      },
    ];
    return config;
  },
};

export default nextConfig;
