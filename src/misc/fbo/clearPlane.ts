import { Mesh, MeshBasicMaterial, PlaneBufferGeometry } from "three"
import { camera, orbit, scene } from "./init"

const plane = new Mesh(
  new PlaneBufferGeometry(),
  new MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.1
  })
)
plane.renderOrder = -1

let fov = (camera.fov * Math.PI) / 180

function stickToCamera() {
  const distance = plane.position.distanceTo(camera.position)
  const height = 2 * Math.tan(fov / 2) * distance
  const width = height * camera.aspect
  plane.scale.set(width, height, 1)
  plane.lookAt(camera.position)
}

orbit.noPan = true
orbit.addEventListener("change", stickToCamera)
addEventListener("resize", stickToCamera)

export const initClearPlane = () => {
  scene.add(plane)
}