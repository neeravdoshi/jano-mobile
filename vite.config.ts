import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/app-icon.svg", "icons/mask-icon.svg"],
      manifest: {
        name: "Jano Doctor Prototype",
        short_name: "Jano",
        description: "High-fidelity PWA prototype for doctor workflow testing.",
        theme_color: "#f6f5f4",
        background_color: "#f6f5f4",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/icons/app-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any"
          },
          {
            src: "/icons/mask-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "maskable"
          }
        ]
      }
    })
  ],
  server: {
    host: "0.0.0.0",
    port: 3000
  },
  preview: {
    host: "0.0.0.0",
    port: 4173
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true,
    css: true
  }
});
