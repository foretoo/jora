import { RepeatWrapping, WebGLRenderer } from "three"
import { GPUComputationRenderer, Variable } from "three/examples/jsm/misc/GPUComputationRenderer"
import { controls } from "./controls"



export let positionVar: Variable

export const getGPGPU = (
  width: number,
  height: number,
  renderer: WebGLRenderer,
) => {
  const gpuCompute = new GPUComputationRenderer(width, height, renderer)

  const data = new Float32Array(width * height * 4)
  for (let i = 0; i < data.length; i += 4) {
    data[i + 0] = Math.random() * 2 - 1
    data[i + 1] = Math.random() * 2 - 1
    data[i + 2] = Math.random() * 2 - 1
    data[i + 3] = 1
  }

  const positionTexture = gpuCompute.createTexture()
  positionTexture.image.data.set(data)
  positionVar = gpuCompute.addVariable("positionTexture", controls.shader, positionTexture)

  positionVar.material.uniforms.vel = { value: controls.vel }
  positionVar.material.uniforms.roughness = { value: controls.roughness }

  positionVar.material.uniforms.tb = { value: controls.thomas.b }
  positionVar.material.uniforms.aa = { value: controls.aizawa.a }
  positionVar.material.uniforms.ab = { value: controls.aizawa.b }
  positionVar.material.uniforms.ac = { value: controls.aizawa.c }
  positionVar.material.uniforms.ad = { value: controls.aizawa.d }
  positionVar.material.uniforms.ae = { value: controls.aizawa.e }
  positionVar.material.uniforms.af = { value: controls.aizawa.f }

  positionVar.wrapS = RepeatWrapping
  positionVar.wrapT = RepeatWrapping

  const error = gpuCompute.init()
  if ( error !== null ) console.error( error )

  return () => {
    gpuCompute.compute()
    return gpuCompute.getCurrentRenderTarget(positionVar).texture
  }
}