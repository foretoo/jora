import { BufferAttribute, BufferGeometry, Points, ShaderMaterial } from "three"
import { AMOUNT, INITIAL_DATA, SIDE } from "./const"
import { camera, orbit, renderer, scene } from "./setup"
import { compute } from "./gpu"
import vertexShader from "./vertex.glsl"
import fragmentShader from "./fragment.glsl"



camera.position.set(0, 0, 3)



const sphereGeometry = new BufferGeometry()

const ref = new Float32Array(AMOUNT * 2)
for (let i = 0; i < AMOUNT; i++) {
  ref[i * 2 + 0] = (i % SIDE) / SIDE
  ref[i * 2 + 1] = (i / SIDE | 0) / SIDE
}
sphereGeometry.setAttribute("position", new BufferAttribute(INITIAL_DATA, 4))
sphereGeometry.setAttribute("ref", new BufferAttribute(ref, 2))



const sphereMaterial = new ShaderMaterial({
  uniforms: {
    positionTexture: { value: null }
  },
  vertexShader,
  fragmentShader,
})

const sphere = new Points(sphereGeometry, sphereMaterial)
scene.add(sphere)



let t = 0
export const play = () => {
  t += 0.01

  sphereMaterial.uniforms.positionTexture.value = compute(t)

  orbit.update()
  renderer.render(scene, camera)
  requestAnimationFrame(play)
}