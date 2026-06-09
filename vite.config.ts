import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    nitro: { enabled: true },
    serverFns: {
      disableCsrfMiddlewareWarning: true,
    },
  },
});
