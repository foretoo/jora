import { camera, orbit, renderer, scene } from "./setup"
import { initiateCPUSphere } from "./cpu-sphere"
import { Matrix4 } from "three"
import { icosahpoints } from "./icosah"



camera.position.set(0, 0, 3)

const sphere = initiateCPUSphere()
scene.add(sphere)



const mat = new Matrix4()



const f = 2 * Math.tan((camera.fov * Math.PI) / 360)
const hScale = f * camera.position.distanceTo(sphere.position)
const wScale = hScale * camera.aspect



const pointer = { x: 0, y: 0}

addEventListener("pointermove", (e) => {
  for (let i = 0; i < 12; i++) {
    if (icosahpoints[i * 3 + 2] >= 0) {
      pointer.x = (e.clientX / innerWidth  *  2 - 1) * wScale
      pointer.y = (e.clientY / innerHeight * -2 + 1) * hScale

      const x = icosahpoints[i * 3 + 0]
      const y = icosahpoints[i * 3 + 1]
      const z = icosahpoints[i * 3 + 2]

      const [ dx, dy ] = [ x - pointer.x, y - pointer.y ]
      const len = Math.sqrt(dx ** 2 + dy ** 2)
      const dir = { x: dx / len, y: dy / len }

      const f = len < 2 ? Math.cos(len * Math.PI / 4) / 2 : 0
      const zlen = Math.sqrt(pointer.x ** 2 + pointer.y ** 2)
      const zf = zlen < 1.9 ? Math.cos((zlen / 1.9) * (Math.PI / 2)) / 2 : 0

      mat.makeTranslation(
        x + dir.x * f * f,
        y + dir.y * f * f,
        z * (1 + zf * zf)
      )

      sphere.setMatrixAt(i, mat)
      sphere.instanceMatrix.needsUpdate = true
    }
  }
})



let t = 0
export const play = () => {
  t += 0.01

  orbit.update()
  renderer.render(scene, camera)
  requestAnimationFrame(play)
}