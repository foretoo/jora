import { camera, orbit, scene } from "./setup"



export const initiatePointer = (
  x = 0,
  y = 0,
  z = 0,
  d = 0,
) => {

  const f = Math.tan((camera.fov * Math.PI) / 360)
  let hScale = f * camera.position.distanceTo(scene.position)
  let wScale = hScale * camera.aspect

  addEventListener("resize", () => wScale = hScale * camera.aspect)

  orbit.addEventListener("change", () => {
    hScale = f * camera.position.distanceTo(scene.position)
    wScale = hScale * camera.aspect
  })



  const prevPointer = { x, y, z }
  const pointer = { x, y, z, d }

  addEventListener("pointermove", (e) => {
    pointer.x = (e.clientX / innerWidth  *  2 - 1) * wScale
    pointer.y = (e.clientY / innerHeight * -2 + 1) * hScale
    const clen = Math.sqrt(pointer.x ** 2 + pointer.y ** 2)
    pointer.z = clen < 1 ? Math.cos(clen * Math.PI / 2) : 0

    const [ dx, dy, dz ] = [ pointer.x - prevPointer.x, pointer.y - prevPointer.y, pointer.z - prevPointer.z ]
    pointer.d += Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2)
    

    prevPointer.x = pointer.x
    prevPointer.y = pointer.y
    prevPointer.z = pointer.z
  })

  return pointer
}