import { Scene, PerspectiveCamera, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"



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
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


// Renderer
const renderer = new WebGLRenderer({ canvas })
renderer.setSize(width, height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.onresize = () => {
  width = window.innerWidth
  height = window.innerHeight

  camera.aspect = width / height
  camera.updateProjectionMatrix()

  renderer.setSize(width, height)  
}


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
    controls.update()
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
  renderer,
  canvas,
  loop,
}