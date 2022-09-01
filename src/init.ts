import { PerspectiveCamera, Scene, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"



// Sizes
let
  width = window.innerWidth,
  height = window.innerHeight


// Canvas
const canvas = document.querySelector("canvas")!


// Scene
const scene = new Scene()


// Camera
const aspect = width / height
const camera = new PerspectiveCamera(75, aspect, 0.1, 100)
camera.position.set(0, 0, 2)

const logs = document.querySelector("#logs")!
const orbit = new OrbitControls(camera, canvas)

orbit.addEventListener("change", () => {
  logs.innerHTML =
    `pos: (${camera.position.x.toFixed(4)}, ${camera.position.y.toFixed(4)}, ${camera.position.z.toFixed(4)})\n` +
    `rot: (${camera.rotation.x.toFixed(4)}, ${camera.rotation.y.toFixed(4)}, ${camera.rotation.z.toFixed(4)})`
})


// Renderer
const renderer = new WebGLRenderer({ canvas })
renderer.setSize(width, height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

addEventListener("resize", () => {
  width = window.innerWidth
  height = window.innerHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)  
})


// Looper
let looping = true
window.onkeydown = (e: KeyboardEvent) => {
  if (e.code === "Space") {
    if (looping) looping = false
    else {
      looping = true
      loop(_callback)
    }
  }
}
let _callback: (() => void) | undefined
const loop = (callback?: () => void) => {
  _callback = callback
  const commontask = () => {
    orbit.update()
    renderer.render(scene, camera)
  }
  const callbackLooper = () => {
    callback!()
    commontask()
    looping && requestAnimationFrame(callbackLooper)
  }
  const emptyLooper = () => {
    commontask()
    looping && requestAnimationFrame(emptyLooper)
  }
  requestAnimationFrame(callback ? callbackLooper : emptyLooper)
}

export {
  width,
  height,
  scene,
  camera,
  orbit,
  renderer,
  canvas,
  loop,
}