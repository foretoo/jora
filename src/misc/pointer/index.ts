import { camera, orbit, renderer, scene } from "./setup"
import { initiateSphere } from "./sphere"



camera.position.set(0, 0, 3)

const updateGPUSphere = initiateSphere()



let t = 0
export const play = () => {
  t += 0.01

  updateGPUSphere(t)
  orbit.update()
  renderer.render(scene, camera)
  requestAnimationFrame(play)
}