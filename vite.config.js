import { defineConfig } from "vite"
import glsl from "vite-plugin-glsl"

export default defineConfig({
  plugins: [glsl()],
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