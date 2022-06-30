import { defineConfig } from "vite"

export default defineConfig({
  server: {
    open: true,
    host: true
  },
  optimizeDeps: {
    entries: "./src/index.ts"
  },
  build: {
    target: "esnext",
  },
})