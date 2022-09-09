import { camera, orbit, renderer, scene } from "./setup"
import { initiatePointer } from "./pointer"
// import { initiateIcoVelResponse } from "./ico-vel-res"
import { initiateGPUSphere } from "./gpu-sphere"



camera.position.set(0, 0, 3)
const pointer = initiatePointer()



// const { ico, icoUpdate } = initiateIcoVelResponse(1, 7, 0.01)
// scene.add(ico)

const sphereUpdate = initiateGPUSphere()



let t = 0
export const play = () => {
  t += 0.01

  pointer.d *= 0.9
  sphereUpdate(t, pointer)
  // icoUpdate(pointer)

  orbit.update()
  renderer.render(scene, camera)
  requestAnimationFrame(play)
}