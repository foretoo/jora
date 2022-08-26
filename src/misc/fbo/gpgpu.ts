import { RepeatWrapping, WebGLRenderer } from "three"
import { GPUComputationRenderer, Variable } from "three/examples/jsm/misc/GPUComputationRenderer"
import thomasShader from "./shaders/thomas.glsl"
import aizawaShader from "./shaders/aizawa.glsl"

import * as dat from "dat.gui"

let positionVar: Variable

const gui = new dat.GUI()
const attractor = {
  attractor: "aizawa",
  list: [ "thomas", "aizawa" ],
  
  roughness: 0.0,
  vel: 2.0,

  thomas: {
    b: 0.208186,
  },

  aizawa: {
    a: 1.0,
    b: 0.5,
    c: 1.5,
    d: 0.0,
    e: 0.2,
    skew: 0.0,
  }
}

gui.add(attractor, "attractor", attractor.list)
.onChange((curr: string) => {
  if (curr === attractor.list[0]) {
    positionVar.material.fragmentShader = thomasShader
    positionVar.material.needsUpdate = true
    aizawaFolder.hide()
    thomasFolder.show()
  }
  else if (curr === attractor.list[1]) {
    positionVar.material.fragmentShader = aizawaShader
    positionVar.material.needsUpdate = true
    aizawaFolder.show()
    thomasFolder.hide()
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

const thomasFolder = gui.addFolder("thomas props")
thomasFolder.open()
thomasFolder.hide()

thomasFolder.add(attractor.thomas, "b", 0.1, 0.3, 0.01)
.onChange((value: number) => {
  positionVar.material.uniforms.tb.value = value
})

const aizawaFolder = gui.addFolder("aizawa props")
aizawaFolder.open()

aizawaFolder.add(attractor.aizawa, "a", -4, 4, 0.05)
.onChange((value: number) => {
  positionVar.material.uniforms.aa.value = value
})

aizawaFolder.add(attractor.aizawa, "b", -4, 4, 0.05)
.onChange((value: number) => {
  positionVar.material.uniforms.ab.value = value
})

aizawaFolder.add(attractor.aizawa, "c", -4, 4, 0.05)
.onChange((value: number) => {
  positionVar.material.uniforms.ac.value = value
})

aizawaFolder.add(attractor.aizawa, "e", 0, 1, 0.05)
.onChange((value: number) => {
  positionVar.material.uniforms.ae.value = value
})

aizawaFolder.add(attractor.aizawa, "skew", -0.5, 0.5, 0.01)
.onChange((value: number) => {
  positionVar.material.uniforms.af.value = value
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
  positionVar = gpuCompute.addVariable("positionTexture", aizawaShader, positionTexture)

  positionVar.material.uniforms.vel = { value: attractor.vel }
  positionVar.material.uniforms.roughness = { value: attractor.roughness }

  positionVar.material.uniforms.tb = { value: attractor.thomas.b }
  positionVar.material.uniforms.aa = { value: attractor.aizawa.a }
  positionVar.material.uniforms.ab = { value: attractor.aizawa.b }
  positionVar.material.uniforms.ac = { value: attractor.aizawa.c }
  positionVar.material.uniforms.ad = { value: attractor.aizawa.d }
  positionVar.material.uniforms.ae = { value: attractor.aizawa.e }
  positionVar.material.uniforms.af = { value: attractor.aizawa.skew }

  positionVar.wrapS = RepeatWrapping
  positionVar.wrapT = RepeatWrapping

  const error = gpuCompute.init()
  if ( error !== null ) console.error( error )

  return () => {
    gpuCompute.compute()
    return gpuCompute.getCurrentRenderTarget(positionVar).texture
  }
}