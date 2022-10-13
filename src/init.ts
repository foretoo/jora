import { PerspectiveCamera, Scene, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"



// Canvas
const canvas = document.querySelector("canvas")!


// Scene
const scene = new Scene()


// Camera
const camera = new PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100)

const logs = document.querySelector("#logs")!
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
  camera.aspect = innerWidth / innerHeight
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
  const callbackLooper = (t: number) => {
    callback!(t)
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
  scene,
  camera,
  orbit,
  renderer,
  canvas,
  loop,
}