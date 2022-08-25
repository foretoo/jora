import { RepeatWrapping, WebGLRenderer } from "three"
import { GPUComputationRenderer, Variable } from "three/examples/jsm/misc/GPUComputationRenderer"
import thomasShader from "./shaders/thomas.glsl"
import aizawaShader from "./shaders/aizawa.glsl"

import * as dat from "dat.gui"

let positionVar: Variable

const gui = new dat.GUI()
const attractor = {
  attractor: "thomas",
  list: [ "thomas", "aizawa" ],
  
  roughness: 0.0,
  vel: 2.0,

  a: 1.0,
  b: 0.5,
  c: 1.5,
  d: 0.0,
  e: 0.2,
  skew: 0.0,
}

gui.add(attractor, "attractor", attractor.list)
.onChange((curr: string) => {
  if (curr === attractor.list[0]) {
    positionVar.material.fragmentShader = thomasShader
    positionVar.material.needsUpdate = true
  }
  else if (curr === attractor.list[1]) {
    positionVar.material.fragmentShader = aizawaShader
    positionVar.material.needsUpdate = true
  }
})

gui.add(attractor, "roughness", 0, 1, 0.01)
.onChange((roughness: number) => {
  positionVar.material.uniforms.roughness.value = roughness
})
gui.add(attractor, "vel", 0, 4, 0.05)
.onChange((vel: number) => {
  positionVar.material.uniforms.vel.value = vel
})

gui.add(attractor, "a", -4, 4, 0.05)
.onChange((value: number) => {
  positionVar.material.uniforms.a.value = value
})
gui.add(attractor, "b", -4, 4, 0.05)
.onChange((value: number) => {
  positionVar.material.uniforms.b.value = value
})
gui.add(attractor, "c", -4, 4, 0.05)
.onChange((value: number) => {
  positionVar.material.uniforms.c.value = value
})
gui.add(attractor, "e", 0, 1, 0.05)
.onChange((value: number) => {
  positionVar.material.uniforms.e.value = value
})
gui.add(attractor, "skew", -0.5, 0.5, 0.01)
.onChange((value: number) => {
  positionVar.material.uniforms.f.value = value
})

export const getGPGPU = (
  width: number,
  height: number,
  renderer: WebGLRenderer,
) => {
  const gpuCompute = new GPUComputationRenderer( width, height, renderer )

  const data = new Float32Array(width * height * 4)
  for (let i = 0; i < data.length; i += 4) {
    data[i + 0] = Math.random() * 2 - 1
    data[i + 1] = Math.random() * 2 - 1
    data[i + 2] = Math.random() * 2 - 1
    data[i + 3] = 1
  }

  const positionTexture = gpuCompute.createTexture()
  positionTexture.image.data.set(data)
  positionVar = gpuCompute.addVariable("positionTexture", thomasShader, positionTexture)

  positionVar.material.uniforms.vel = { value: attractor.vel }
  positionVar.material.uniforms.roughness = { value: attractor.roughness }

  positionVar.material.uniforms.a = { value: attractor.a }
  positionVar.material.uniforms.b = { value: attractor.b }
  positionVar.material.uniforms.c = { value: attractor.c }
  positionVar.material.uniforms.d = { value: attractor.d }
  positionVar.material.uniforms.e = { value: attractor.e }
  positionVar.material.uniforms.f = { value: attractor.skew }

  positionVar.wrapS = RepeatWrapping
  positionVar.wrapT = RepeatWrapping

  const error = gpuCompute.init()
  if ( error !== null ) console.error( error )

  return () => {
    gpuCompute.compute()
    return gpuCompute.getCurrentRenderTarget(positionVar).texture
  }
}