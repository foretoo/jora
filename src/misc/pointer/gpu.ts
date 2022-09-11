import { NearestFilter, RepeatWrapping } from "three"
import { INITIAL_DATA, SIDE } from "./const"
import { gpu } from "./setup"
import computePositionShader from "./compute-position.glsl"
import computeVelocityShader from "./compute-velocity.glsl"



const vecPointer = new Float32Array(4)

const velocityTexture = gpu.createTexture()

const initialPositionTexture = gpu.createTexture()
initialPositionTexture.image.data.set(INITIAL_DATA)

const currentPositionTexture = gpu.createTexture()
currentPositionTexture.image.data.set(INITIAL_DATA)



const velocityMaterial = gpu.createShaderMaterial(
  computeVelocityShader,
  {
    initialPositionTexture: { value: initialPositionTexture },
    currentPositionTexture: { value: currentPositionTexture },
    velocityTexture: { value: velocityTexture },
    pointer: { value: vecPointer },
  }
)

const positionMaterial = gpu.createShaderMaterial(
  computePositionShader,
  {
    currentPositionTexture: { value: currentPositionTexture },
    velocityTexture: { value: velocityTexture },
  }
)



const positionTarget = Array(2).fill(null).map(() => (
  gpu.createRenderTarget(SIDE, SIDE, RepeatWrapping, RepeatWrapping, NearestFilter, NearestFilter)
))
const velocityTarget = Array(2).fill(null).map(() => (
  gpu.createRenderTarget(SIDE, SIDE, RepeatWrapping, RepeatWrapping, NearestFilter, NearestFilter)
))



let i = 1
export const compute = (
  time: number,
  pointer: { x: number, y: number, z: number, d: number },
) => {
  i^=1

  vecPointer[0] = pointer.x
  vecPointer[1] = pointer.y
  vecPointer[2] = pointer.z
  vecPointer[3] = pointer.d

  velocityMaterial.uniforms.pointer.value = vecPointer
  gpu.doRenderTarget(velocityMaterial, velocityTarget[i])

  velocityMaterial.uniforms.velocityTexture.value = velocityTarget[i].texture
  positionMaterial.uniforms.velocityTexture.value = velocityTarget[i].texture

  gpu.doRenderTarget(positionMaterial, positionTarget[i])

  velocityMaterial.uniforms.currentPositionTexture.value = positionTarget[i].texture
  positionMaterial.uniforms.currentPositionTexture.value = positionTarget[i].texture

  return positionTarget[i].texture
}