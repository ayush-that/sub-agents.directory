import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "yt3.googleusercontent.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "cdn.brandfetch.io" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "console.settlemint.com" },
    ],
  },
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
};

export default nextConfig;
