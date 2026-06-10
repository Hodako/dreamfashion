/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow MongoDB server-side code to build properly
  serverExternalPackages: ["mongodb"],
  eslint: {
    // Disable ESLint during production build since we lint separately
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript build errors temporarily during initial migration steps
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
