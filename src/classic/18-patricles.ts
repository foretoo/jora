import { AdditiveBlending, BoxBufferGeometry, BufferAttribute, BufferGeometry, Mesh, MeshBasicMaterial, Points, PointsMaterial, RawShaderMaterial, TextureLoader } from "three"
import { scene } from "../init"



const amount = 128 ** 2

const tLoader = new TextureLoader()
const aTexture = tLoader.load("../../../public/textures/particles/11.png")



const geometry = new BufferGeometry()
const positions = new Float32Array(amount * 3)
const colors = new Float32Array(amount * 3)
for (let i = 0; i < amount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 6
  colors[i] = Math.random()
}
geometry.setAttribute("position", new BufferAttribute(positions, 3))
geometry.setAttribute("color", new BufferAttribute(colors, 3))



const material = new PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  vertexColors: true,
  alphaMap: aTexture,
  transparent: true,
  alphaTest: 0.01,
  // depthTest: false,
  depthWrite: false,
  blending: AdditiveBlending,
})



const points = new Points(geometry, material)
scene.add(points)



const cube = new Mesh(
  new BoxBufferGeometry(),
  new MeshBasicMaterial({ color: "#000" })
)
scene.add(cube)



export const play = () => {

}