import { Mesh, MeshBasicMaterial, PlaneBufferGeometry } from "three"
import { camera, orbit, renderer, scene } from "./init"

const plane = new Mesh(
  new PlaneBufferGeometry(),
  new MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.333
  })
)
plane.position.z = -5
plane.renderOrder = -1

let fov = (camera.fov * Math.PI) / 180

function stickToCamera() {
  const distance = plane.position.distanceTo(camera.position)
  const height = 2 * Math.tan(fov / 2) * distance
  const width = height * camera.aspect
  plane.scale.set(width * 100, height * 100, 1)
  plane.lookAt(scene.position)
}
stickToCamera()

orbit.noPan = true
orbit.addEventListener("change", stickToCamera)
addEventListener("resize", stickToCamera)
renderer.autoClearColor = false

export const initClearPlane = () => {
  scene.add(plane)
}