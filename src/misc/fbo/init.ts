import { Color, PerspectiveCamera, Scene, WebGLRenderer } from "three"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls"



// Canvas
export const canvas = document.querySelector("canvas")!

// Scene
export const scene = new Scene()
scene.background = new Color("#fff")

// Camera
export const camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100)
camera.position.set(0, 0, 2)

// Orbit
export const orbit = new TrackballControls(camera, canvas)

// Renderer
export const renderer = new WebGLRenderer({
  canvas,
  preserveDrawingBuffer: true,
})
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)  
})