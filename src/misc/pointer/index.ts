import { camera, orbit, renderer, scene } from "./setup"
import { getIco } from "./cpu-sphere"
import { Matrix4 } from "three"



camera.position.set(0, 0, 3)

const [ ico, ip ] = getIco(1, 2, 0.02)
scene.add(ico)



const mat = new Matrix4()



const f = Math.tan((camera.fov * Math.PI) / 360)
const hScale = f * camera.position.distanceTo(ico.position)
const wScale = hScale * camera.aspect



const pointer = { x: 0, y: 0}

addEventListener("pointermove", (e) => {
  for (let i = 0; i < ico.count; i++) {
    pointer.x = (e.clientX / innerWidth  *  2 - 1) * wScale
    pointer.y = (e.clientY / innerHeight * -2 + 1) * hScale

    const x = ip[i * 3 + 0]
    const y = ip[i * 3 + 1]
    const z = ip[i * 3 + 2]

    const [ dx, dy ] = [ x - pointer.x, y - pointer.y ]
    const len = Math.sqrt(dx ** 2 + dy ** 2)
    const dir = { x: dx / len, y: dy / len }

    const f = len < 1 ? Math.cos(len * Math.PI / 2) / 2 : 0

    mat.makeTranslation(
      x + dir.x * f * f,
      y + dir.y * f * f,
      z
    )

    ico.setMatrixAt(i, mat)
    ico.instanceMatrix.needsUpdate = true
  }
})



let t = 0
export const play = () => {
  t += 0.01

  orbit.update()
  renderer.render(scene, camera)
  requestAnimationFrame(play)
}