import { NearestFilter, RepeatWrapping } from "three"
import { INITIAL_DATA, SIDE } from "./const"
import { gpu, pointer } from "./setup"
import computeShader from "./compute.glsl"



const positionTexture = gpu.createTexture()
positionTexture.image.data.set(INITIAL_DATA)

const material = gpu.createShaderMaterial(
  computeShader,
  {
    positionTexture: { value: positionTexture },
    pointer: { value: pointer },
  }
)



const renderTarget = Array(2).fill(null).map(() => (
  gpu.createRenderTarget(SIDE, SIDE, RepeatWrapping, RepeatWrapping, NearestFilter, NearestFilter)
))



let i = 1
export const compute = (time: number) => {
  gpu.doRenderTarget(material, renderTarget[i^=1])
  material.uniforms.positionTexture.value = renderTarget[i].texture
  material.uniforms.pointer.value = pointer
  return renderTarget[i].texture
}