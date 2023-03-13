import { defineConfig } from "vite"
import glsl from "vite-plugin-glsl"
import wasm from "vite-plugin-wasm"
import topLevelAwait from "vite-plugin-top-level-await"

export default defineConfig({
  publicDir: false,
  plugins: [
    wasm(),
    topLevelAwait(),
    glsl(),
  ],
  server: {
    open: "/src/index.html",
    host: true,
  },
  resolve: {
    alias: {
      misc: "/src/misc",
      init: "/src/init.ts",
      utils: "/src/utils.ts",
      vendors: "/dist/vendors"
    },
  },

  build: {
    rollupOptions: {
      input: "/src/index.html",
      external: [
        "three",
        "three/examples/jsm/controls/OrbitControls",
      ],
      output: {
        dir: "dist",
        assetFileNames: "style.css",
        entryFileNames: "bundle.js",
        chunkFileNames: "[name]",
        manualChunks: (id) => {
          if (!/node_modules/.test(id)) return
          const chunkPath = id.match(/node_modules\/(.+)/)[1]

          if (!/^three\//.test(chunkPath)) {
            const name = chunkPath.match(/^[^\/]+/)
            return `vendors/${name}.js`
          }

          const threeModuleName = chunkPath.match(/[^\/]+$/)
          if (threeModuleName === "three.module.js") return
          return `vendors/three/${threeModuleName}`
        },
        paths: {
          "three": "../vendors/three/three.module.js",
          "three/examples/jsm/controls/OrbitControls": "../vendors/three/OrbitControls.js",
        },
      },
    },
    emptyOutDir: false,
  },

  worker: {
    plugins: [
      wasm(),
      topLevelAwait(),
    ],
  }
})