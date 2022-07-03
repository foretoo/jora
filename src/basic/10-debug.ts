import { Mesh, BufferGeometry, BufferAttribute, MeshBasicMaterial } from "three"
import { scene } from "../init"
import gsap from "gsap"
import * as dat from "dat.gui"



const params = {
  color: 0x00ffff,
  spin: () => {
    gsap.to(mesh.rotation, {
      y: mesh.rotation.y + Math.PI * 2,
      duration: 1
    })
  }
}

const gui = new dat.GUI({
  closed: true
})

// const points = new Float32Array([
//   0,0,0,
//   0,1,0,
//   1,0,0
// ])
const num = 200
const points = new Float32Array(num * 3 * 3)
for (let i = 0; i < num * 3; i++) {
  const theta = Math.random() * Math.PI * 2
  const phi =   Math.random() * Math.PI
  points[i * 3 + 0] = 0.5 * Math.sin(theta) * Math.cos(phi)
  points[i * 3 + 1] = 0.5 * Math.sin(theta) * Math.sin(phi)
  points[i * 3 + 2] = 0.5 * Math.cos(theta)
}

const positions = new BufferAttribute(points, 3)
const geometry = new BufferGeometry()
geometry.setAttribute("position", positions)
const material = new MeshBasicMaterial({
  color: params.color,
  wireframe: true,
})
const mesh = new Mesh(geometry, material)
scene.add(mesh)



gui.add(mesh.position, "y", -2, 2, 0.01)
   .name("Y coordinate")
gui.add(params, "spin")
gui.add(mesh, "visible")
gui.add(material, "wireframe")
gui.addColor(params, "color")
   .onChange(() => {
     material.color.set(params.color)
   })



const play = () => {}

export { play }