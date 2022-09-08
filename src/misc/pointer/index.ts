import { Matrix4 } from "three"
import { camera, orbit, renderer, scene } from "./setup"
import { initiatePointer } from "./pointer"
import { initiateIcoBasicResponse } from "./ico-basic-res"



camera.position.set(0, 0, 3)
const pointer = initiatePointer(-5, -5)



const { ico, icoUpdate } = initiateIcoBasicResponse()
scene.add(ico)



let t = 0
export const play = () => {
  t += 0.01

  icoUpdate(pointer)

  orbit.update()
  renderer.render(scene, camera)
  requestAnimationFrame(play)
}