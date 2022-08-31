import { BufferAttribute, BufferGeometry, Points, ShaderMaterial } from "three"
import { renderer, scene } from "./init"
import { controls } from "./controls"
import { getGPGPU } from "./gpgpu"

import vertexShader from "./shaders/vertex.glsl"
import fragmentShader from "./shaders/fragment.glsl"



const width  = 128
const height = width
const computePositionTexture = getGPGPU(width, height, renderer)


export const material = new ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    noiseScale: { value: 1 / controls.noiseScale },
    noiseStrength: { value: controls.noiseStrength },
    positionTexture: { value: null },
  },
  vertexShader,
  fragmentShader,
  transparent: true,
})
controls.listen.noiseScale.push((v) => material.uniforms.noiseScale.value = v)
controls.listen.noiseStrength.push((v) => material.uniforms.noiseStrength.value = v)


const geometry = new BufferGeometry()
const position = new Float32Array(width * height * 3)
const reference = new Float32Array(width * height * 2)
for (let i = 0; i < width * height; i++) {
  reference[i * 2 + 0] = (i % width) / width
  reference[i * 2 + 1] = (i / width | 0) / height
}
geometry.setAttribute("position", new BufferAttribute(position, 3))
geometry.setAttribute("reference", new BufferAttribute(reference, 2))


const points = new Points(geometry, material)
scene.add(points)

export const updateAttractor = (t: number) => {
  material.uniforms.time.value = t
  material.uniforms.positionTexture.value = computePositionTexture()
}