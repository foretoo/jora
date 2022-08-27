import { scene, camera, renderer } from "../../init"
import * as dat from "dat.gui"
import { igloo, indices } from "./igloo"
import { AmbientLight, CapsuleBufferGeometry, DirectionalLight, DirectionalLightHelper, DoubleSide, Euler, GridHelper, Group, InstancedMesh, Mesh, MeshStandardMaterial, Object3D, PlaneBufferGeometry, Quaternion, Vector3 } from "three"
import { getSnowFellas } from "./snowfellas"
import { getTexture } from "./rtt"

const gui = new dat.GUI()
camera.position.set(0, 8, 5)


const count = 50
const snowball = getSnowFellas(0.1, count)
scene.add(snowball)



/**
 * HOUSE
 */

//// HOUSE
const house = new Group()
scene.add(house)


//// WALLS
const walls = new Mesh(
  igloo,
  new MeshStandardMaterial({ color: "#ac8e82" })
)
walls.material.side = DoubleSide
walls.material.flatShading = true
house.add(walls)



//// STICKS
const indiestick = new CapsuleBufferGeometry(0.04, 0.2, 3, 8)
const indiematerial = new MeshStandardMaterial({ color: "#7c5e52" })
const sticks = new InstancedMesh(indiestick, indiematerial, indices.length)
const stickGismo = new Object3D()
const axisY = new Vector3(0, 1, 0)
const unitQ = new Quaternion()

indices.forEach(([ x, y, z ], i) => {
  stickGismo.position.set(x, y ? y : 0.05, z)
  stickGismo.position.multiplyScalar(1.02)
  stickGismo.quaternion.setFromUnitVectors(axisY, stickGismo.position.clone().normalize())
  if (!y) stickGismo.quaternion.rotateTowards(unitQ, Math.PI * 0.333)
  stickGismo.updateMatrix()
  sticks.setMatrixAt(i, stickGismo.matrix)
})
house.add(sticks)


//// FLOOR
const planeTexture = getTexture(renderer)
const floor = new Mesh(
  new PlaneBufferGeometry(10, 10),
  new MeshStandardMaterial({
    color: "#adf",
    map: planeTexture,
  }),
)
floor.rotation.x = -Math.PI / 2
scene.add(floor)



/**
 * LIGHTS
 */

const ambientLight = new AmbientLight(0xffffff, 0.618)
scene.add(ambientLight)

const moonLight = new DirectionalLight("#f70", 0.618)
moonLight.position.set(4, 5, -2)
const directHelper = new DirectionalLightHelper(moonLight, 0.2)
setTimeout(() => directHelper.update(), 0)
scene.add(moonLight, directHelper)



const grid = new GridHelper(100, 100, 0x444444, 0x222222)
grid.position.y = 0.001
scene.add(grid)



gui.add(ambientLight, "intensity").min(0).max(1).step(0.001)



const play = () => {}

export { play }