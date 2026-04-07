/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tell Next.js to ignore this old Node library during the build step
  serverExternalPackages: ["pdf-parse", "yt-search"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
    ],
  },
};

export default nextConfig;