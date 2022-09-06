import { PerspectiveCamera, Scene, WebGLRenderer } from "three"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls"
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer"
import { SIDE } from "./const"

const canvas = document.querySelector("canvas")!



export const scene = new Scene()

export const camera = new PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100)

export const orbit = new TrackballControls(camera, canvas)
orbit.staticMoving = true

export const renderer = new WebGLRenderer({ canvas })
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
})



export const gpu = new GPUComputationRenderer(SIDE, SIDE, renderer)

export const pointer = new Float32Array(2)

addEventListener("pointermove", (e) => {
  pointer[0] = e.clientX / innerWidth  *  2 - 1
  pointer[1] = e.clientY / innerHeight * -2 + 1
})