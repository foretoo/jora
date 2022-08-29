import { scene } from "../../init"
import { CapsuleBufferGeometry, DoubleSide, Group, InstancedMesh, Mesh, MeshStandardMaterial, Object3D, Quaternion, Vector3 } from "three"
import { iglooGeometry, iglooIndices } from "./igloo-geometry"



//// GROUP
const igloo = new Group()


//// WALLS
const iglooMesh = new Mesh(
  iglooGeometry,
  new MeshStandardMaterial({ color: "#7fb" })
)
iglooMesh.material.side = DoubleSide
iglooMesh.material.flatShading = true
iglooMesh.castShadow = true
iglooMesh.receiveShadow = true
igloo.add(iglooMesh)


//// BELLS
const bellsGeometry = new CapsuleBufferGeometry(0.06, 0.04, 3, 8)
const bellsMaterial = new MeshStandardMaterial({ emissive: "#5ff" })
bellsMaterial.emissiveIntensity = 1
const bells = new InstancedMesh(bellsGeometry, bellsMaterial, iglooIndices.length)
const bellsGismo = new Object3D()
const axisY = new Vector3(0, 1, 0)
const unitQ = new Quaternion()

iglooIndices.forEach(([ x, y, z ], i) => {
  bellsGismo.position.set(x, y ? y : 0.01, z)
  bellsGismo.position.multiplyScalar(1.02)
  bellsGismo.quaternion.setFromUnitVectors(axisY, bellsGismo.position.clone().normalize())
  if (!y) bellsGismo.quaternion.rotateTowards(unitQ, Math.PI * 0.375)
  bellsGismo.updateMatrix()
  bells.setMatrixAt(i, bellsGismo.matrix)
})
bells.castShadow = true
igloo.add(bells)



export const initIgloo = () => {
  scene.add(igloo)
}