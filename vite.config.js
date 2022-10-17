import { defineConfig } from "vite"
import glsl from "vite-plugin-glsl"

export default defineConfig({
  publicDir: false,
  plugins: [glsl()],
  server: {
    open: "/src/index.html",
    host: true,
  },
  optimizeDeps: {
    entries: "./src/index.ts"
  },
  build: {
    assetsDir: ".",
    rollupOptions: {
      input: "/src/index.ts",
      output: {
        dir: "dist",
        assetFileNames: "style.css",
        entryFileNames: "bundle.js",
      },
    },
    emptyOutDir: false,
  },
})