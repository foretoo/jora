import { Matrix4 } from "three"
import { getIco } from "./ico"



export const initiateIcoBasicResponse = (
  radius = 1,
  detail = 5,
  vertexRadius = 0.02,
) => {

  const [ ico, ip ] = getIco(radius, detail, vertexRadius)

  const mat = new Matrix4()



  const icoUpdate = (
    pointer: { x: number, y: number }
  ) => {
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



  return { ico, icoUpdate }
}