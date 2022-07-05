import { Mesh, MeshStandardMaterial, SphereBufferGeometry, AmbientLight, PlaneBufferGeometry, BoxBufferGeometry, TorusBufferGeometry, DirectionalLight, HemisphereLight, PointLight, RectAreaLight, SpotLight, HemisphereLightHelper, DirectionalLightHelper, PointLightHelper, SpotLightHelper } from "three"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"
import { TransformControls } from "three/examples/jsm/controls/TransformControls"
import { scene, camera, orbit, canvas } from "../init"
import * as dat from "dat.gui"

camera.position.set(0, 2, 3)

const gui = new dat.GUI()
const control = new TransformControls(camera, canvas)
control.space = "local"
scene.add(control)
const data = {
  current: "",
  list: [ "point", "direct", "rect", "spot", "target", "" ],
  mode: "translate",
}
const light = {} as {
  fill: AmbientLight
  direct: DirectionalLight
  sphere: HemisphereLight
  point: PointLight
  rect: RectAreaLight
  spot: SpotLight
}



/**
 * Lights
 */

// Fill
light.fill = new AmbientLight(0xffffff, 0.5)

// Direct
light.direct = new DirectionalLight(0x00fffc, 0.3)
light.direct.position.set(2, 4, 2)
const directHelper = new DirectionalLightHelper(light.direct, 0.2)

// Sphere
light.sphere = new HemisphereLight(0xff0000, 0x0000ff, 0.3)
const hemiHelper = new HemisphereLightHelper(light.sphere, 0.2)

// Point
light.point = new PointLight(0xff9000, 0.5, 10, 2)
light.point.position.set(-2, 1, -2)
const pointHelper = new PointLightHelper(light.point, 0.2)

// RectArea
light.rect = new RectAreaLight(0x4e00ff, 2, 1, 1)
light.rect.position.set(-1.5, 0, 1.5)
light.rect.lookAt(0, 0, 0)
const rectHelper = new RectAreaLightHelper(light.rect, 0.2)


// Spot
light.spot = new SpotLight(0x78ff00, 0.5, 10, Math.PI * 0.1, 0.25, 1)
light.spot.position.set(0, 2, 3)
light.spot.target.position.set(-0.5, 0, -1)
const spotHelper = new SpotLightHelper(light.spot, 0.2)
setTimeout(() => requestAnimationFrame(() => spotHelper.update()), 0)


scene.add(light.fill, light.direct, light.sphere, light.point, light.rect, light.spot, light.spot.target)
scene.add(directHelper, pointHelper, rectHelper, spotHelper)



/**
 * GUI
 */

gui
  .add(data, "current", data.list)
  .onChange((curr: "point" | "direct" | "rect" | "spot" | "target" | "") => {
    if (curr === "") control.detach()
    else if (curr === "target") control.attach(light.spot.target)
    else control.attach(light[curr])
  })

gui
  .add(data, "mode", [ "translate", "rotate" ])
  .onChange((mode: "translate" | "rotate") => {
    control.setMode(mode)
  })



/**
 * Meshes
 */

// Material
const material = new MeshStandardMaterial({
  // wireframe: true,
  roughness: 0.4,
})

// Plane
const plane = new Mesh(new PlaneBufferGeometry(5, 5), material)
plane.rotateX(-Math.PI / 2)

// Sphere
const sphere = new Mesh(new SphereBufferGeometry(0.5, 18, 12), material)
sphere.position.set(-1.5, 0.5, 0)

// Cube
const cube = new Mesh(new BoxBufferGeometry(0.8, 0.8, 0.8), material)
cube.translateY(0.5657)
cube.rotateX(Math.PI / 4)

// Torus
const torus = new Mesh(new TorusBufferGeometry(0.3, 0.2, 12, 24), material)
torus.position.set(1.5, 0.5, 0)



scene.add(plane, sphere, cube, torus)



export const play = () => {
  orbit.enabled = control.dragging ? false : true
  if (control.dragging && (control.object === light.spot || control.object === light.spot.target)) {
    requestAnimationFrame(() => spotHelper.update())
  }
}