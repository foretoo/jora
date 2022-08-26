import { DoubleSide, InstancedMesh, MeshStandardMaterial, Object3D, SphereBufferGeometry } from "three"
import { gRandom } from "../../utils"

export const getSnowFellas = (
  radius: number,
  count: number
) => {

  const geometry = new SphereBufferGeometry(radius, 18, 6, 0, Math.PI * 2, 0, Math.PI / 2)
  const material = new MeshStandardMaterial({ color: "#fff", side: DoubleSide })
  const mesh = new InstancedMesh(geometry, material, count)

  const gizmo = new Object3D()

  for (let i = 0; i < count; i++) {
    const angle = gRandom(-Math.PI, Math.PI * 3)
    const distance = 1.5 + (radius * 10) + Math.random() * (3.5 - (radius * 10))
    gizmo.position.set(
      Math.sin(angle) * distance,
      0,
      Math.cos(angle) * distance,
    )
    const scale = 1 + Math.random() * 3
    const scaleY = scale / 2 + Math.random() * scale * 5
    gizmo.scale.set(scale, scaleY, scale)
  
    gizmo.updateMatrix()
    mesh.setMatrixAt(i, gizmo.matrix)
  }

  return mesh
}