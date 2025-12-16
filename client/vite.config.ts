import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { VitePWA } from "vite-plugin-pwa";


export default defineConfig({
  server: {
    proxy: {
      "/uploads": {
        target: "http://localhost:3000",
      },
      "/api": {
        target: "http://localhost:3000",
      },
      '/socket': {
        target: 'ws://localhost:3000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      includeAssets: [
        "favicon.ico",
        "/assets/img/logo-512.png",
        "/assets/img/logo.svg",
      ],
      manifest: {
        name: "My Awesome App",
        short_name: "MyApp",
        description: "My Awesome App description",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/assets/img/logo-512.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/assets/img/logo-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
