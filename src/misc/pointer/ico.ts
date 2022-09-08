import { InstancedMesh, MeshBasicMaterial, Object3D, OctahedronBufferGeometry } from "three"
import { getIcoVertecies } from "./ico-vertecies"



export const getIco = (
  radius?: number,
  detail?: number,
  vertexRadius?: number
) => {
  const icoVertecies = getIcoVertecies(radius, detail)
  const unitGeometry = new OctahedronBufferGeometry(vertexRadius || 0.01)
  const unitMaterial = new MeshBasicMaterial({ color: 0xffffff })

  const icoMesh = new InstancedMesh(unitGeometry, unitMaterial, icoVertecies.length / 3)

  const gizmo = new Object3D()
  for (let i = 0; i < icoVertecies.length / 3; i++) {
    gizmo.position.set(
      icoVertecies[i * 3 + 0],
      icoVertecies[i * 3 + 1],
      icoVertecies[i * 3 + 2],
    )
    gizmo.updateMatrix()
    icoMesh.setMatrixAt(i, gizmo.matrix)
  }


  return [ icoMesh, icoVertecies ] as [ InstancedMesh<OctahedronBufferGeometry, MeshBasicMaterial>, number[] ]
}