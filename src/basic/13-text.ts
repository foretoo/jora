import { TextureLoader, MeshMatcapMaterial, Mesh, TorusBufferGeometry } from "three"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry"
import { scene } from "../init"



const textureLoader = new TextureLoader()
const matcapTexture = textureLoader.load("/textures/matcaps/5.png")
const material = new MeshMatcapMaterial({ matcap: matcapTexture })



let textGeometry: TextGeometry
let textMesh: Mesh

const fontLoader = new FontLoader()
fontLoader.load(
  "fonts/helvetiker_regular.typeface.json",
  (font) => {
    textGeometry = new TextGeometry(
      "Booblik",
      {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 16,
        bevelEnabled: true,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelOffset: 0,
        bevelSegments: 5,
      }
    )
    textGeometry.center()
    textMesh = new Mesh(textGeometry, material)
    scene.add(textMesh)
  }
)



const donatGeometry = new TorusBufferGeometry(0.5, 0.3, 16, 32)
for (let i = 0; i < 300; i++) {
  const donat = new Mesh(donatGeometry, material)

  donat.position.x = (Math.random() - 0.5) * 30
  donat.position.y = (Math.random() - 0.5) * 30
  donat.position.z = (Math.random() - 0.5) * 30

  const scale = 0.333 + Math.random() * 1
  donat.scale.set(scale, scale, scale)

  donat.rotateX(Math.random() * Math.PI)
  donat.rotateY(Math.random() * Math.PI)
  scene.add(donat)
}



const play = () => {}
export { play }