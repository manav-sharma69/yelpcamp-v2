/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "djodiggwht.ufs.sh",
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: "www.nps.gov",
        port: '',
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
