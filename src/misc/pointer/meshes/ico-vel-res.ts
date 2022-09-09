import { Matrix4 } from "three"
import { getIco } from "./ico"



export const initiateIcoVelResponse = (
  radius = 1,
  detail = 5,
  vertexRadius = 0.02,
) => {

  const [ ico, ip ] = getIco(radius, detail, vertexRadius)
  const vel = new Float32Array(ip.length)

  const mat = new Matrix4()



  const icoUpdate = (
    pointer: { x: number, y: number, d: number }
  ) => {
    for (let i = 0; i < ico.count; i++) {
      ico.getMatrixAt(i, mat)

      const ix = ip[i * 3 + 0]
      const iy = ip[i * 3 + 1]

      let x = mat.elements[12]
      let y = mat.elements[13]

      let vx = vel[i * 3 + 0]
      let vy = vel[i * 3 + 1]

      let dx = x - pointer.x
      let dy = y - pointer.y



      // push from pointer

      const dd = Math.sqrt(dx ** 2 + dy ** 2)
      const f = dd < 1 ? Math.cos((dd / 1) * Math.PI / 2) : 0

      vx += (dx / dd) * f * f * pointer.d * 0.1
      vy += (dy / dd) * f * f * pointer.d * 0.1

      // fade out pushing

      vx *= 0.9
      vy *= 0.9

      // pull to initial position

      dx = ix - x
      dy = iy - y
      vx += dx * 0.01
      vy += dy * 0.01

      // move

      x += vx
      y += vy



      vel[i * 3 + 0] = vx
      vel[i * 3 + 1] = vy

      mat.elements[12] = x
      mat.elements[13] = y

      ico.setMatrixAt(i, mat)
      ico.instanceMatrix.needsUpdate = true
    }
  }



  return { ico, icoUpdate }
}