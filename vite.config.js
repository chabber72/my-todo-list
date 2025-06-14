import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import path from "path";
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
        sourcemap: true,
        lib: {
            entry: path.resolve(__dirname, "src/main.tsx"),
            formats: ["es"],
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                preserveModules: true,
                preserveModulesRoot: "src",
            },
        },
    },
});
