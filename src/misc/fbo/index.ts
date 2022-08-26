import { BufferAttribute, BufferGeometry, Points, ShaderMaterial } from "three"
import { camera, orbit, renderer, scene } from "./init"
import { createPlayer } from "./createPlayer"

import vertexShader from "./shaders/vertex.glsl"
import fragmentShader from "./shaders/fragment.glsl"
import { getGPGPU } from "./gpgpu"



camera.position.set(0, 0, -10)

const width  = 256
const height = 256

const computePositionTexture = getGPGPU(width, height, renderer)



const material = new ShaderMaterial({
  uniforms: {
    time: { value: 0 },
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


export const play = createPlayer(() => {
  material.uniforms.positionTexture.value = computePositionTexture()
  orbit.update()
  renderer.render(scene, camera)
})