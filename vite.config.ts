import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: true,
  tanstackStart: {
    server: { entry: "server" },
    nitro: { enabled: true },
    serverFns: {
      disableCsrfMiddlewareWarning: true,
    },
  },
});
