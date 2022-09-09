import { camera, orbit, renderer, scene } from "./setup"
import { initiatePointer } from "./pointer"
import { initiateGPUSphere } from "./meshes/gpu-sphere"



camera.position.set(0, 0, 3)
const pointer = initiatePointer()



const sphereUpdate = initiateGPUSphere()



let t = 0
export const play = () => {
  t += 0.01

  pointer.d *= 0.9
  sphereUpdate(t, pointer)

  orbit.update()
  renderer.render(scene, camera)
  requestAnimationFrame(play)
}