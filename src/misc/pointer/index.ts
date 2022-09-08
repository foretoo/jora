import { Matrix4 } from "three"
import { camera, orbit, renderer, scene } from "./setup"
import { getIco } from "./cpu-sphere"
import { initiatePointer } from "./pointer"



camera.position.set(0, 0, 3)
const pointer = initiatePointer()



const [ ico, ip ] = getIco(1, 5, 0.02)
scene.add(ico)

const mat = new Matrix4()

const update = () => {
  for (let i = 0; i < ico.count; i++) {
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
}







let t = 0
export const play = () => {
  t += 0.01

  update()

  orbit.update()
  renderer.render(scene, camera)
  requestAnimationFrame(play)
}