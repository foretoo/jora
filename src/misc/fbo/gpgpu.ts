import { RepeatWrapping, WebGLRenderer } from "three"
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer"
import computeShader from "./shaders/compute.glsl"

export const getGPGPU = (
  width: number,
  height: number,
  renderer: WebGLRenderer,
) => {
  const gpuCompute = new GPUComputationRenderer( width, height, renderer )
  const positionTexture = gpuCompute.createTexture()

  const data = positionTexture.image.data
  for (let i = 0; i < data.length; i += 4) {
    data[i + 0] = Math.random() * 2 - 1
    data[i + 1] = Math.random() * 2 - 1
    data[i + 2] = Math.random() * 2 - 1
    data[i + 3] = 1
  }

  const posVar = gpuCompute.addVariable("positionTexture", computeShader, positionTexture)

  posVar.material.uniforms.time =  { value: 0 }
  posVar.material.uniforms.vel = { value: 0.03 }
  posVar.material.uniforms.roughness = { value: 0.5 }
  posVar.wrapS = RepeatWrapping
  posVar.wrapT = RepeatWrapping

  const error = gpuCompute.init()
  if ( error !== null ) console.error( error )

  return () => {
    posVar.material.uniforms.time.value += 0.01
    gpuCompute.compute()
    return gpuCompute.getCurrentRenderTarget(posVar).texture
  }
}