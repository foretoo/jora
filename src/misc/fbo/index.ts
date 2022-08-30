import { camera, orbit, renderer, scene } from "./init"
import { initGUI } from "./gui"
// import { updateAttractor } from "./attractor"
import { initSphere } from "./sphere"



initGUI()
camera.position.set(0, 0, 12)

const updateSphere1 = initSphere(Math.random() * 123, 0.2)
const updateSphere2 = initSphere(Math.random() * 123, 0.25)
const updateSphere3 = initSphere(Math.random() * 123, 0.3)



let t = 0
export const play = () => {
  t += 0.01
  // updateAttractor(t)
  updateSphere1(t)
  updateSphere2(t/2)
  updateSphere3(t/3)

  orbit.update()
  renderer.render(scene, camera)
  requestAnimationFrame(play)
}