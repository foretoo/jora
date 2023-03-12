import { OrthographicCamera, PerspectiveCamera, Scene, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"



// Canvas
const canvas = document.querySelector("canvas")!


// Scene
const scene = new Scene()


// Camera
let aspect = innerWidth / innerHeight
const camera = new PerspectiveCamera(60, aspect, 0.1, 100)
// const camera = new OrthographicCamera(-aspect, aspect, 1, -1, 0.1, 100)

export const logs = document.querySelector("#logs")!
const orbit = new OrbitControls(camera, canvas)

orbit.addEventListener("change", () => {
  const { x: px, y: py, z: pz } = camera.position
  const { x: rx, y: ry, z: rz } = camera.rotation
  logs && (logs.innerHTML =
    `pos: (${px.toFixed(4)}, ${py.toFixed(4)}, ${pz.toFixed(4)})\n` +
    `rot: (${rx.toFixed(4)}, ${ry.toFixed(4)}, ${rz.toFixed(4)})\n`
  )
})


// Renderer
const renderer = new WebGLRenderer({ canvas, antialias: true })
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

addEventListener("resize", () => {
  aspect = innerWidth / innerHeight
  camera.aspect = aspect
  // camera.left  = -aspect
  // camera.right =  aspect
  camera.updateProjectionMatrix()

  renderer.setSize(innerWidth, innerHeight)  
})


// Looper
let looping = true
window.onkeydown = (e: KeyboardEvent) => {
  if (e.code === "Space") {
    e.preventDefault()
    if (looping) looping = false
    else {
      looping = true
      loop(_callback)
    }
  }
}
let _callback: ((t: number) => void) | undefined
const loop = (callback?: (t: number) => void) => {
  _callback = callback
  const commontask = () => {
    orbit.update()
    renderer.render(scene, camera)
  }

  if (!callback) {
    const emptyLooper = () => {
      commontask()
      looping && requestAnimationFrame(emptyLooper)
    }
    requestAnimationFrame(emptyLooper)
    return
  }

  const callbackLooper = (t: number) => {
    callback(t)
    commontask()
    looping && requestAnimationFrame(callbackLooper)
  }
  requestAnimationFrame(callbackLooper)
}

export {
  scene,
  camera,
  orbit,
  renderer,
  canvas,
  loop,
}