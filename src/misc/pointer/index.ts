import { camera, orbit, renderer, scene } from "./setup"
import { initiateGPUSphere } from "./gpu-sphere"



camera.position.set(0, 0, 3)

const updateGPUSphere = initiateGPUSphere()



let t = 0
export const play = () => {
  t += 0.01

  updateGPUSphere(t)
  orbit.update()
  renderer.render(scene, camera)
  requestAnimationFrame(play)
}