import { scene, camera, renderer, orbit } from "../../init"
import * as dat from "dat.gui"
import { igloo, indices } from "./igloo"
import { AmbientLight, CameraHelper, CapsuleBufferGeometry, Color, DirectionalLight, DirectionalLightHelper, DoubleSide, Fog, GridHelper, Group, InstancedMesh, Mesh, MeshStandardMaterial, Object3D, PCFSoftShadowMap, PlaneBufferGeometry, PointLight, Quaternion, SphereBufferGeometry, Vector2, Vector3 } from "three"
import { getSnowFellas } from "./snowfellas"
import { getRTTData } from "./rtt"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { createNoise2D } from "simplex-noise"

const gui = new dat.GUI()
camera.position.set(2, 5, 8)

renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap

const fog = new Fog("#7af", 5, 15)
scene.fog = fog
// scene.background = new Color("#7af")

orbit.addEventListener("change", () => {
  const length = camera.position.length()
  fog.near = length - 5
  fog.far = length + 5
})



/**
 * MARQUEE
 */

//// MARQUEE
const marquee = new Group()
scene.add(marquee)


//// WALLS
const marqueeWalls = new Mesh(
  igloo,
  new MeshStandardMaterial({ color: "#7fb" })
)
marqueeWalls.material.side = DoubleSide
marqueeWalls.material.flatShading = true
marqueeWalls.castShadow = true
marqueeWalls.receiveShadow = true
marquee.add(marqueeWalls)



//// BELLS
const marqueeBellsGeometry = new CapsuleBufferGeometry(0.06, 0.04, 3, 8)
const marqueeBellsMaterial = new MeshStandardMaterial({ emissive: "#5ff" })
marqueeBellsMaterial.emissiveIntensity = 1
const marqueeBells = new InstancedMesh(marqueeBellsGeometry, marqueeBellsMaterial, indices.length)
const marqueeBellsGismo = new Object3D()
const axisY = new Vector3(0, 1, 0)
const unitQ = new Quaternion()

indices.forEach(([ x, y, z ], i) => {
  marqueeBellsGismo.position.set(x, y ? y : 0.01, z)
  marqueeBellsGismo.position.multiplyScalar(1.02)
  marqueeBellsGismo.quaternion.setFromUnitVectors(axisY, marqueeBellsGismo.position.clone().normalize())
  if (!y) marqueeBellsGismo.quaternion.rotateTowards(unitQ, Math.PI * 0.375)
  marqueeBellsGismo.updateMatrix()
  marqueeBells.setMatrixAt(i, marqueeBellsGismo.matrix)
})
marqueeBells.castShadow = true
marquee.add(marqueeBells)


/**
 * ENVIRONMENT
 */

const {
  texture: colorTexture,
  alpha: alphaTexture,
  buffer: noiseData
} = getRTTData(renderer)

const fellas = getSnowFellas(0.1, noiseData)
fellas.material.flatShading = true
fellas.castShadow = true
fellas.receiveShadow = true
scene.add(fellas)

const floor = new Mesh(
  new PlaneBufferGeometry(10, 10, 64, 64),
  new MeshStandardMaterial({
    color: "#adf",
    map: colorTexture,
    displacementMap: alphaTexture,
    displacementScale: 0.62,
  }),
)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)



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



const flynum = 4
const flyGeometry = new SphereBufferGeometry(0.03, 6, 4)
const flyMaterial = new MeshStandardMaterial({ emissive: "#5ff", emissiveIntensity: 1 })
const fliesMesh = new InstancedMesh(flyGeometry, flyMaterial, flynum)
const flyGismo = new Object3D()
scene.add(fliesMesh)

const noise2D = createNoise2D()

const flies = Array(flynum).fill(null).map((_, i) => {
  const color = "#fff"
  const light = new PointLight(color, 1.5, 3)
  light.castShadow = true
  light.shadow.mapSize = new Vector2(128, 128)
  light.shadow.camera.near = 0.1
  light.shadow.camera.far = 3
  light.shadow.bias = 0.00003
  light.shadow.normalBias = 0.05
  scene.add(light)

  const start = Math.random() * Math.PI * 2
  const vel = 0.001 + Math.random() * 0.002
  const dir = Math.sign(Math.random() - 0.5)
  const distance = 1.4 + Math.random() * 3.3

  let t = 0
  const update = () => {
    const n = noise2D(t + start, 0)
    const d = distance + distance * n / 2
    const dt = distance / d

    flyGismo.position.set(
      Math.cos(start + t * dir * Math.PI * 2) * d,
      2 + n * 1.5,
      Math.sin(start + t * dir * Math.PI * 2) * d,
    )
    t += vel * dt
    light.position.copy(flyGismo.position)

    flyGismo.updateMatrix()
    fliesMesh.setMatrixAt(i, flyGismo.matrix)
  }
  return { update }
})



const grid = new GridHelper(100, 100, 0x444444, 0x222222)
grid.position.y = 0.001
// scene.add(grid)



const play = () => {
  flies.forEach((ghost) => ghost.update())
  fliesMesh.instanceMatrix.needsUpdate = true
}

export { play }



gui.add(ambientLight, "intensity").min(0).max(1).step(0.001)