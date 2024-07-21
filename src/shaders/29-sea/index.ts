/* eslint-disable key-spacing */
import { Clock, DoubleSide, Mesh, PlaneGeometry, ShaderMaterial, Vector2 } from "three"
import GUI from "lil-gui"

import { camera, scene } from "init"
import vertexShader from "./vertex.glsl"
import fragmentShader from "./fragment.glsl"


camera.position.set(0, 1, 1)


const geometry = new PlaneGeometry(1, 1, 512, 512)
geometry.rotateX(-Math.PI / 2)


const uElevation = { value: 0.08 }
const uFrequency = { value: new Vector2(3, 1.5) }
const uTime      = { value: 0 }

const uniforms = {
  uElevation,
  uFrequency,
  uTime,
}

const material = new ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms,
  side: DoubleSide,
})


const plane = new Mesh(geometry, material)
scene.add(plane)


const gui = new GUI()
gui.add(uElevation, "value", 0, 0.2, 0.01).name("elevation")
gui.add(uFrequency.value, "x", 0, 3, 0.01).name("waves X")
gui.add(uFrequency.value, "y", 0, 3, 0.01).name("waves Y")


const clock = new Clock()

export const play = () => {
  uTime.value = clock.getElapsedTime()
}