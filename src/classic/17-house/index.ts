import { scene, camera } from "../../init"
import * as dat from "dat.gui"
import { igloo, indices } from "./igloo"

import { Group } from "three/src/objects/Group"
import { Mesh } from "three/src/objects/Mesh"
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial"
import { Vector3 } from "three/src/math/Vector3"
import { PlaneBufferGeometry } from "three/src/geometries/PlaneGeometry"
import { AmbientLight } from "three/src/lights/AmbientLight"
import { DirectionalLight } from "three/src/lights/DirectionalLight"
import { DirectionalLightHelper } from "three/src/helpers/DirectionalLightHelper"
import { GridHelper } from "three/src/helpers/GridHelper"
import { DoubleSide } from "three/src/constants"
import { CapsuleBufferGeometry } from "three"

const gui = new dat.GUI()
camera.position.y = 3
camera.position.z = 5



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
const indiestick = new CapsuleBufferGeometry(0.04, 0.1, 3, 8)
const indiematerial = new MeshStandardMaterial({ color: "#7c5e52" })
const axisY = new Vector3(0, 1, 0)
// indiematerial.flatShading = true
indices.forEach(([ x, y, z ]) => {
  const stick = new Mesh(indiestick, indiematerial)
  stick.position.set(x, y, z)
  stick.position.multiplyScalar(1.02)
  stick.quaternion.setFromUnitVectors(axisY, stick.position.clone().normalize())
  house.add(stick)
})



//// FLOOR
const floor = new Mesh(
  new PlaneBufferGeometry(10, 10),
  new MeshStandardMaterial({ color: "#adf" }),
)
floor.rotation.x = -Math.PI / 2
scene.add(floor)



/**
 * LIGHTS
 */

const ambientLight = new AmbientLight(0xffffff, 0.5)
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001)
scene.add(ambientLight)

const moonLight = new DirectionalLight("#f70", 0.5)
moonLight.position.set(4, 5, -2)
const directHelper = new DirectionalLightHelper(moonLight, 0.2)
setTimeout(() => directHelper.update(), 0)
scene.add(moonLight, directHelper)



// const grid = new GridHelper(100, 100, 0x444444, 0x222222)
// scene.add(grid)

const play = () => {}
export { play }