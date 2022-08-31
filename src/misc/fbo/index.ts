import { camera, orbit, renderer, scene } from "./init"
import { initGUI } from "./gui"
// import { updateAttractor } from "./attractor"
import { initClearPlane } from "./clearPlane"
import { initSphere } from "./sphere"



initGUI()
initClearPlane()
camera.position.set(0, 0, 12)



const updateSphere1 = initSphere(Math.random() * 123, 0.25)
const updateSphere2 = initSphere(Math.random() * 123, 0.35)
const updateSphere3 = initSphere(Math.random() * 123, 0.30)



let t = 0
export const play = () => {
  t += 0.01
  // updateAttractor(t)
  updateSphere1(t)
  updateSphere2(t)
  updateSphere3(t)

  orbit.update()
  renderer.render(scene, camera)
  requestAnimationFrame(play)
}