import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const repoBase = process.env.VITE_BASE_PATH ?? "/high-traffic-site-tutorial/";

export default defineConfig({
  base: repoBase,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    sourcemap: true,
    target: "es2022",
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          tone: ["tone"],
          motion: ["framer-motion"],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
  },
});
