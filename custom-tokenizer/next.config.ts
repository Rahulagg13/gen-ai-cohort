// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  //@ts-ignore
  webpack(config, { isServer, dev }) {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true, // optional, only if you need Webpack layers
    };

    return config;
  },
};

export default nextConfig;
