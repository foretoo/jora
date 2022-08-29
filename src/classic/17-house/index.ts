import { scene, camera, renderer, orbit } from "../../init"
import * as dat from "dat.gui"
import { AmbientLight, CameraHelper, DirectionalLight, DirectionalLightHelper, Fog, GridHelper, Mesh, MeshStandardMaterial, PCFSoftShadowMap, PlaneBufferGeometry, Vector2 } from "three"
import { rttAlpha, rttColor } from "./rtt"
import { initFellas } from "./fellas"
import { updateFlies } from "./flies"
import { initIgloo } from "./igloo"



const gui = new dat.GUI()
camera.position.set(2, 5, 8)

renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap



initIgloo()
initFellas()



/**
 * ENVIRONMENT
 */

const floor = new Mesh(
  new PlaneBufferGeometry(10, 10, 64, 64),
  new MeshStandardMaterial({
    color: "#adf",
    map: rttColor,
    displacementMap: rttAlpha,
    displacementScale: 0.62,
  }),
)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)

const fog = new Fog("#fa7", 5, 15)
scene.fog = fog

orbit.addEventListener("change", () => {
  const length = camera.position.length()
  fog.near = length - 5
  fog.far = length + 5
})



/**
 * LIGHTS
 */

const ambientLight = new AmbientLight(0xffffff, 0.1)
scene.add(ambientLight)

const moonLight = new DirectionalLight("#fa7", 0.9)
moonLight.position.set(7, 4, 2)
moonLight.castShadow = true
moonLight.shadow.bias = 0.00003
moonLight.shadow.mapSize = new Vector2(1024, 1024)
moonLight.shadow.normalBias = 0.05

const directHelper = new DirectionalLightHelper(moonLight, 0.2)
setTimeout(() => directHelper.update(), 0)

const directCamera = new CameraHelper(moonLight.shadow.camera)
moonLight.shadow.camera.near = 2
moonLight.shadow.camera.far = 15
moonLight.shadow.camera.left = -8
moonLight.shadow.camera.right = 8
moonLight.shadow.camera.top = 5
moonLight.shadow.camera.bottom = -4
moonLight.shadow.camera.updateProjectionMatrix()
setTimeout(() => directCamera.update(), 0)
// directCamera.visible = false
scene.add(moonLight, directHelper, directCamera)



const grid = new GridHelper(100, 100, 0x444444, 0x222222)
grid.position.y = 0.001
// scene.add(grid)



const play = () => {
  updateFlies()
}

export { play }



gui.add(ambientLight, "intensity").min(0).max(1).step(0.001)