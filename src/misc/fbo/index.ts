import { camera, orbit, renderer, scene } from "./init"

import { initGUI } from "./gui"
import { updateAttractor } from "./attractor"



initGUI()
camera.position.set(0, 0, 12)





let t = 0
export const play = () => {
  t += 0.01
  updateAttractor(t)

  orbit.update()
  renderer.render(scene, camera)
  requestAnimationFrame(play)
}