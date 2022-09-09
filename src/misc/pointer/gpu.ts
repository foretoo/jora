import { NearestFilter, RepeatWrapping } from "three"
import { INITIAL_DATA, SIDE } from "./const"
import { gpu } from "./setup"
import computeShader from "./compute.glsl"



const positionTexture = gpu.createTexture()
positionTexture.image.data.set(INITIAL_DATA)

const vecPointer = new Float32Array(3)
const material = gpu.createShaderMaterial(
  computeShader,
  {
    positionTexture: { value: positionTexture },
    pointer: { value: vecPointer },
  }
)



const renderTarget = Array(2).fill(null).map(() => (
  gpu.createRenderTarget(SIDE, SIDE, RepeatWrapping, RepeatWrapping, NearestFilter, NearestFilter)
))



let i = 1
export const compute = (
  time: number,
  pointer: { x: number, y: number, d: number },
) => {
  vecPointer[0] = pointer.x
  vecPointer[1] = pointer.y
  vecPointer[2] = pointer.d

  gpu.doRenderTarget(material, renderTarget[i^=1])

  material.uniforms.positionTexture.value = renderTarget[i].texture
  material.uniforms.pointer.value = pointer

  return renderTarget[i].texture
}