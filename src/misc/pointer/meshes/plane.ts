import { InstancedMesh, Matrix4, MeshBasicMaterial, OctahedronBufferGeometry } from "three"



const geometry = new OctahedronBufferGeometry(0.01)
const material = new MeshBasicMaterial({ color: 0xffffff })
export const plane = new InstancedMesh(geometry, material, 9)



const pos: { x: number, y: number }[] = []
const vel = Array(9).fill(null).map(() => ({ x: 0, y: 0 }))

const mat = new Matrix4()

for (let y = 1; y > -2; y--) {
  for (let x = -1; x < 2; x++) {
    const i = (-y + 1) * 3 + x + 1
    pos[i] = { x, y }
    mat.elements[12] = x
    mat.elements[13] = y
    plane.setMatrixAt(i, mat)
  }
}



export const updatePlane = (
  pointer: { x: number, y: number, d: number }
) => {
  if (pointer.d < 1e-8) return
  for (let i = 0; i < plane.count; i++) {
    
    plane.getMatrixAt(i, mat)

    const ix = pos[i].x
    const iy = pos[i].y

    let x = mat.elements[12]
    let y = mat.elements[13]

    let vx = vel[i].x
    let vy = vel[i].y

    let dx = x - pointer.x
    let dy = y - pointer.y



    // push from pointer

    const dd = Math.sqrt(dx ** 2 + dy ** 2)
    const f = dd < 1 ? Math.cos(dd * Math.PI / 2) : 0

    vx += (dx / dd) * f * pointer.d * 0.01
    vy += (dy / dd) * f * pointer.d * 0.01

    // fade out pushing

    vx *= 0.9
    vy *= 0.9

    // pull to initial position

    dx = ix - x
    dy = iy - y
    vx += dx * 0.05
    vy += dy * 0.05

    // move

    x += vx
    y += vy



    vel[i].x = vx
    vel[i].y = vy

    mat.elements[12] = x
    mat.elements[13] = y

    plane.setMatrixAt(i, mat)
    plane.instanceMatrix.needsUpdate = true
  }
}