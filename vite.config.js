import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: { tsconfigPath: "tsconfig.app.json" },
    }),
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false, // Disable source maps in production
    rollupOptions: {
      input: {
        main: "./index.html", // Specify the entry point
      },
      output: {
        // Ensure all chunks go to assets directory
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]",
        // Disable code splitting
        manualChunks: undefined,
      },
    },
    // Prevent chunk splitting
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: false,
  },
});
