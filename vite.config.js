import { defineConfig } from "vite"
import glsl from "vite-plugin-glsl"

export default defineConfig({
  publicDir: false,
  plugins: [glsl()],
  server: {
    open: "/src/index.html",
    host: true,
  },
  resolve: {
    alias: {
      misc: "/src/misc",
      init: "/src/init.ts"
    }
  },
  build: {
    assetsDir: ".",
    rollupOptions: {
      input: "/src/index.ts",
      output: {
        dir: ".",
        assetFileNames: "dist/style.css",
        entryFileNames: "dist/bundle.js",
        chunkFileNames: "[name]",
        manualChunks: {
          "vendors/three.js": ["three"],
        }
      },
    },
    emptyOutDir: true,
  },
})