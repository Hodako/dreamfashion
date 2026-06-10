import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: true,
  tanstackStart: {
    server: { entry: "server" },
    nitro: {
      enabled: true,
      preset: process.env.VERCEL ? "vercel" : "node-server",
      externals: {
        external: ["mongodb"],
      },
    },
    serverFns: {
      disableCsrfMiddlewareWarning: true,
    },
  },
  vite: {
    server: {
      allowedHosts: true,
      host: true,
    },
    ssr: {
      external: ["mongodb"],
    },
  },
});
