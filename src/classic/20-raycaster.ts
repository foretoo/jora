import { BufferGeometry, IcosahedronBufferGeometry, Line, LineBasicMaterial, Mesh, MeshBasicMaterial, MeshBasicMaterialParameters, Raycaster, Vector2, Vector3 } from "three"
import { camera, scene } from "../init"



camera.position.z = 5
const sphereGeometry = new IcosahedronBufferGeometry(0.5, 4)
const sphereMaterialParams: MeshBasicMaterialParameters = {
  color: "#f00",
  wireframe: true,
}



const obj1 = new Mesh(
  sphereGeometry,
  new MeshBasicMaterial(sphereMaterialParams)
)
obj1.position.x = -2
const obj2 = new Mesh(
  sphereGeometry,
  new MeshBasicMaterial(sphereMaterialParams)
)
const obj3 = new Mesh(
  sphereGeometry,
  new MeshBasicMaterial(sphereMaterialParams)
)
obj3.position.x = 2

const objects = [ obj1, obj2, obj3 ]
scene.add(...objects)



const raycaster = new Raycaster(
  // new Vector3(-5, 0, 0),
  // new Vector3(1, 0, 0).normalize(),
)

scene.add(
  new Line(
    new BufferGeometry()
      .setFromPoints([
        raycaster.ray.origin,
        raycaster.ray.direction.clone().multiplyScalar(10)
      ]),
    new LineBasicMaterial({ color: "#fff" })
  )
)



const pointer = new Vector2(0,0)
addEventListener("pointermove", (e) => {
  pointer.x = e.clientX /  innerWidth  * 2 - 1
  pointer.y = e.clientY / -innerHeight * 2 + 1

  raycaster.setFromCamera(pointer, camera)

  const intersections = raycaster.intersectObjects<typeof obj1>(objects)

  for (const obj of objects) {
    obj.material.color.set("#f00")
  }

  for (const intersection of intersections) {
    intersection.object.material.color.set("#00f")
  }
})


let t = 0
export const play = () => {
  t += 0.02

  obj1.position.y = Math.sin(t/3)
  obj2.position.y = Math.sin(-t/2)
  obj3.position.y = Math.sin(t)

  // const intersections = raycaster.intersectObjects<typeof obj1>(objects)

  // for (const obj of objects) {
  //   obj.material.color.set("#f00")
  // }

  // for (const intersection of intersections) {
  //   intersection.object.material.color.set("#00f")
  // }
}