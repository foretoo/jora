import { BufferAttribute, BufferGeometry, Points, ShaderMaterial } from "three"
import { camera, orbit, renderer, scene } from "./init"
import { getGPGPU } from "./gpgpu"
import { initGUI } from "./gui"

import vertexShader from "./shaders/vertex.glsl"
import fragmentShader from "./shaders/fragment.glsl"
import { controls } from "./controls"



initGUI()
camera.position.set(0, 0, -10)

const width  = 256
const height = 256

const computePositionTexture = getGPGPU(width, height, renderer)



export const material = new ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    noiseStrength: { value: controls.noiseStrength },
    positionTexture: { value: null },
  },
  vertexShader,
  fragmentShader,
  transparent: true,
})

const geometry = new BufferGeometry()
const position = new Float32Array(width * height * 3)
const reference = new Float32Array(width * height * 2)
for (let i = 0; i < width * height; i++) {
  reference[i * 2 + 0] = (i % width) / width
  reference[i * 2 + 1] = (i / width | 0) / height
}
geometry.setAttribute("position", new BufferAttribute(position, 3))
geometry.setAttribute("reference", new BufferAttribute(reference, 2))

const plane = new Points(geometry, material)
scene.add(plane)


export const play = () => {
  material.uniforms.time.value += 0.01
  material.uniforms.positionTexture.value = computePositionTexture()
  orbit.update()
  renderer.render(scene, camera)
  requestAnimationFrame(play)
}