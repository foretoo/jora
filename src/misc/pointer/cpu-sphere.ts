import { InstancedMesh, MeshBasicMaterial, Object3D, OctahedronBufferGeometry } from "three"
import { icosah } from "./icosah"



const pointGeometry = new OctahedronBufferGeometry(0.1)
const pointMaterial = new MeshBasicMaterial({ color: 0xffffff })

const points = new InstancedMesh(pointGeometry, pointMaterial, 12)
points.scale.multiplyScalar(0.5)

const gizmo = new Object3D()
for (let i = 0; i < 12; i++) {
  gizmo.position.set(
    icosah[i * 3 + 0],
    icosah[i * 3 + 1],
    icosah[i * 3 + 2],
  )
  gizmo.updateMatrix()
  points.setMatrixAt(i, gizmo.matrix)
}


export const initiateCPUSphere = () => points