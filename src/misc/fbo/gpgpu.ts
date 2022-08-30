import { RepeatWrapping, WebGLRenderer } from "three"
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer"
import { controls } from "./controls"
import { sphere } from "./sphere"



export const getGPGPU = (
  width: number,
  height: number,
  renderer: WebGLRenderer,
) => {
  const gpuCompute = new GPUComputationRenderer(width, height, renderer)

  const l = sphere.geometry.attributes.position.count * 3
  const p = sphere.geometry.attributes.position.array



  const data = new Float32Array(width * height * 4)
  for (let i = 0; i < data.length; i++) {
    data[i * 4 + 0] = p[(i * 3 + 0) % l] + (Math.random() * 2 - 1) * 0.333
    data[i * 4 + 1] = p[(i * 3 + 1) % l] + (Math.random() * 2 - 1) * 0.333
    data[i * 4 + 2] = p[(i * 3 + 2) % l] + (Math.random() * 2 - 1) * 0.333
    data[i * 4 + 3] = 1
  }

  const positionTexture = gpuCompute.createTexture()
  positionTexture.image.data.set(data)
  const positionVar = gpuCompute.addVariable("positionTexture", controls.shader, positionTexture)



  // uniforms
  positionVar.material.uniforms.vel = { value: controls.vel }
  positionVar.material.uniforms.roughness = { value: controls.roughness }

  positionVar.material.uniforms.tb = { value: controls.thomas.b }
  positionVar.material.uniforms.aa = { value: controls.aizawa.a }
  positionVar.material.uniforms.ab = { value: controls.aizawa.b }
  positionVar.material.uniforms.ac = { value: controls.aizawa.c }
  positionVar.material.uniforms.ad = { value: controls.aizawa.d }
  positionVar.material.uniforms.ae = { value: controls.aizawa.e }
  positionVar.material.uniforms.af = { value: controls.aizawa.f }

  // listeners
  controls.listen.roughness.push((v) => positionVar.material.uniforms.roughness.value = v)
  controls.listen.vel.push((v) => positionVar.material.uniforms.vel.value = v)
  
  controls.listen.thomas.b.push((v) => positionVar.material.uniforms.tb.value = v)
  controls.listen.aizawa.a.push((v) => positionVar.material.uniforms.aa.value = v)
  controls.listen.aizawa.b.push((v) => positionVar.material.uniforms.ab.value = v)
  controls.listen.aizawa.c.push((v) => positionVar.material.uniforms.ac.value = v)
  controls.listen.aizawa.d.push((v) => positionVar.material.uniforms.ad.value = v)
  controls.listen.aizawa.e.push((v) => positionVar.material.uniforms.ae.value = v)
  controls.listen.aizawa.f.push((v) => positionVar.material.uniforms.af.value = v)

  controls.listen.attractor.push((shader) => {
    positionVar.material.fragmentShader = shader
    positionVar.material.needsUpdate = true
  })



  positionVar.wrapS = RepeatWrapping
  positionVar.wrapT = RepeatWrapping

  const error = gpuCompute.init()
  if ( error !== null ) console.error( error )

  return () => {
    gpuCompute.compute()
    return gpuCompute.getCurrentRenderTarget(positionVar).texture
  }
}