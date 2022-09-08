import { camera, scene } from "./setup"



export const initiatePointer = (
  x = 0,
  y = 0,
) => {
  const f = Math.tan((camera.fov * Math.PI) / 360)
  const hScale = f * camera.position.distanceTo(scene.position)
  const wScale = hScale * camera.aspect

  const prevPointer = { x, y }

  const pointer = { x, y, d: 0 }

  addEventListener("pointermove", (e) => {
    pointer.x = (e.clientX / innerWidth  *  2 - 1) * wScale
    pointer.y = (e.clientY / innerHeight * -2 + 1) * hScale

    const [ dx, dy ] = [ pointer.x - prevPointer.x, pointer.y - prevPointer.y ]
    pointer.d = Math.sqrt(dx ** 2 + dy ** 2)

    prevPointer.x = pointer.x
    prevPointer.y = pointer.y
  })

  return pointer
}