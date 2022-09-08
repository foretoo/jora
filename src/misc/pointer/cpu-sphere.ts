import { InstancedMesh, MeshBasicMaterial, Object3D, OctahedronBufferGeometry } from "three"
import { icosahpoints } from "./icosah"



const pointGeometry = new OctahedronBufferGeometry(0.05)
const pointMaterial = new MeshBasicMaterial({ color: 0xffffff })

const points = new InstancedMesh(pointGeometry, pointMaterial, icosahpoints.length / 3)

const gizmo = new Object3D()
for (let i = 0; i < icosahpoints.length / 3; i++) {
  gizmo.position.set(
    icosahpoints[i * 3 + 0],
    icosahpoints[i * 3 + 1],
    icosahpoints[i * 3 + 2],
  )
  gizmo.updateMatrix()
  points.setMatrixAt(i, gizmo.matrix)
}


export const initiateCPUSphere = () => points