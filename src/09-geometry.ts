import { Mesh, BufferGeometry, BufferAttribute, MeshBasicMaterial } from "three"
import { scene } from "./init"



// const points = new Float32Array([
//   0,0,0,
//   0,1,0,
//   1,0,0
// ])
const num = 100
const points = new Float32Array(num * 3 * 3)
for (let i = 0; i < num * 3 * 3; i++) {
  points[i] = Math.random() - 0.5
}
const positions = new BufferAttribute(points, 3)
const geometry = new BufferGeometry()
geometry.setAttribute("position", positions)
const material = new MeshBasicMaterial({
    color: 0xff0000,
    wireframe: true
  })
const mesh = new Mesh(geometry, material)
scene.add(mesh)

const play = () => {}

export { play }