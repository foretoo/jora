import { ACESFilmicToneMapping, Mesh, MeshStandardMaterial, PerspectiveCamera, PMREMGenerator, SphereGeometry, sRGBEncoding, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment"



////
////
//// SETUP

const canvas = document.querySelector("canvas")!

const camera = new PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100)
camera.position.set(0, 2, 5)

const renderer = new WebGLRenderer({ canvas })
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.outputEncoding = sRGBEncoding
renderer.toneMapping = ACESFilmicToneMapping

onresize = () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
}

const controls = new OrbitControls(camera, canvas)

const environment = new RoomEnvironment()

const pmremGenerator = new PMREMGenerator(renderer)
// scene.environment = pmremGenerator.fromScene(environment).texture

environment.add(
  new Mesh(
    new SphereGeometry(1, 64, 32),
    new MeshStandardMaterial({
      metalness: 0,
      roughness: 1,
      envMap: pmremGenerator.fromScene(environment, 0).texture,
    }),
  ),
)



////
////
//// RENDER

export const play = () => {
  controls.update()
  renderer.render(environment, camera)
  requestAnimationFrame(play)
}