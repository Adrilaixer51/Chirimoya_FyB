/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "prod-mercadona.imgix.net",
      },
    ],
  },
};

export default nextConfig;


