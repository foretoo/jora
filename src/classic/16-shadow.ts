import { Mesh, MeshStandardMaterial, SphereBufferGeometry, AmbientLight, PlaneBufferGeometry, DirectionalLight, PointLight, DirectionalLightHelper, PointLightHelper, Object3D, CameraHelper, PCFSoftShadowMap, SpotLight, SpotLightHelper, GridHelper, Color, MeshBasicMaterial, TextureLoader } from "three"
import { TransformControls } from "three/examples/jsm/controls/TransformControls"
import { scene, camera, orbit, renderer, canvas } from "../init"
import * as dat from "dat.gui"

const gui = new dat.GUI()
const control = new TransformControls(camera, canvas)
scene.add(control)

scene.background = new Color("#444")
camera.position.set(0, 3, 2.7)
camera.rotation.set(-1, 0, 0)
// renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap

const data = {
  size: 1024,
  curr: "",
  list: [ "", "point", "direct", "spot", "target" ],
  helpVisible: false
} as Record<string, any>



/**
 * Lights
 */

data.fill = new AmbientLight(0xffffff, 0.5)
scene.add(data.fill)


// Point
data.point = new PointLight(0xffffff, 0.4, 8, 2)
data.point.position.set(0, 2, -2)
data.point.castShadow = true
const pointHelper = new PointLightHelper(data.point, 0.2)

data.point.shadow.mapSize.width = data.size
data.point.shadow.mapSize.height = data.size
data.point.shadow.camera.near = 1
data.point.shadow.camera.far = 5

const pointCamera = new CameraHelper(data.point.shadow.camera)
// pointLight.visible = false
pointHelper.visible = data.helpVisible
pointCamera.visible = false
// scene.add(data.point, pointHelper, pointCamera)


// Directional
data.direct = new DirectionalLight(0xffffff, 0.5)
data.direct.position.set(-2, 2, 0)
data.direct.target.position.set(0, 0.5, 0)
data.direct.castShadow = true
const directHelper = new DirectionalLightHelper(data.direct, 0.2)
setTimeout(() => requestAnimationFrame(() => directHelper.update()), 0)

data.direct.shadow.mapSize.width = data.size
data.direct.shadow.mapSize.height = data.size
data.direct.shadow.camera.near = 1
data.direct.shadow.camera.far = 5
data.direct.shadow.camera.left = -1
data.direct.shadow.camera.right = 1
data.direct.shadow.camera.top = -1
data.direct.shadow.camera.bottom = 1

const directCamera = new CameraHelper(data.direct.shadow.camera)
// shadow.direct.visible = false
directHelper.visible = data.helpVisible
directCamera.visible = false
scene.add(data.direct, data.direct.target, directHelper, directCamera)


// Spot
data.spot = new SpotLight(0xffffff, 0.5, 5, Math.PI / 6, 0.3, 0.5)
data.spot.position.set(-1, 1, 2)
data.spot.target = data.direct.target
data.spot.castShadow = true
const spotHelper = new SpotLightHelper(data.spot, 0xffffff)
setTimeout(() => requestAnimationFrame(() => spotHelper.update()), 0)

data.spot.shadow.mapSize.width = data.size
data.spot.shadow.mapSize.height = data.size
data.spot.shadow.camera.near = 1
data.spot.shadow.camera.far = 5
data.spot.shadow.camera.fov = 30

const spotCamera = new CameraHelper(data.spot.shadow.camera)
// shadow.spot.visible = false
spotHelper.visible = data.helpVisible
spotCamera.visible = false
// scene.add(data.spot, data.spot.target, spotHelper, spotCamera)



/**
 * Meshes
 */

const material = new MeshStandardMaterial()
// material.wireframe = true
material.roughness = 0.3

const plane = new Mesh(new PlaneBufferGeometry(4, 4), material)
plane.rotateX(-Math.PI / 2)
plane.receiveShadow = true

const sphere = new Mesh(new SphereBufferGeometry(0.5, 48, 24), material)
sphere.position.set(0, 0.5, 0)
sphere.castShadow = true

const loader = new TextureLoader()

// const texture = loader.load("textures/bakedShadow.jpg")
// const shadowMaterial = new MeshBasicMaterial()
// shadowMaterial.map = texture

const texture = loader.load("textures/simpleShadow.jpg")
const shadow = new Mesh(
  new PlaneBufferGeometry(1, 1),
  new MeshBasicMaterial({
    color: 0x222222, transparent:true, alphaMap: texture
  })
)
shadow.position.y = plane.position.y + 0.01
shadow.rotateX(-Math.PI / 2)

const grid = new GridHelper(100, 100, 0xAAAAAA, 0x777777)
grid.visible = data.helpVisible

scene.add(plane, sphere, shadow, grid)



/**
 * G-U-I
 */
gui
  .add(data, "curr", data.list)
  .onChange((value) => {
    if (value === "") control.detach()
    else if (value === "target") control.attach(data.direct.target)
    else {
      control.attach(data[value])
      if (value === "direct") directHelper.update()
      else if (value === "spot") spotHelper.update()
    }
  })

gui
  .add(material, "roughness", 0, 1, 0.01)

gui
  .add(data, "helpVisible")
  .onChange((visible) => {
    grid.visible = visible
    pointHelper.visible = visible
    directHelper.visible = visible
    spotHelper.visible = visible
  })



/**
 * P-L-A-Y
 */
let t = 0
export const play = () => {

  const
    x = Math.cos(t) * 1.5,
    z = Math.sin(t) * 1.5,
    y = Math.abs(Math.cos(t * 3)) + 0.5

  sphere.position.set(x, y, z)

  shadow.material.opacity = 1 - (y - 0.5)
  shadow.position.set(x, 0.01, z)
  t += 0.02

  if (control.dragging) {
    orbit.enabled = false
      
    if (control.object === data.direct.target)
      requestAnimationFrame(() => {
        spotHelper.update()
        directHelper.update()
      })

    else if (control.object === data.spot)
      requestAnimationFrame(() => spotHelper.update())

    else if (control.object === data.direct)
      requestAnimationFrame(() => directHelper.update())
  }
  else orbit.enabled = true
}