import { AmbientLight, BufferAttribute, BufferGeometry, DirectionalLight, Euler, Group, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, MeshPhongMaterial, Object3D, PlaneBufferGeometry, Quaternion, TetrahedronBufferGeometry, TetrahedronGeometry, Vector3 } from "three"
import Stats from "three/examples/jsm/libs/stats.module.js"
import { camera, scene } from "../../init"
import { IData, N, tetrahedronIndices, tetrahedronVertices, timeStep } from "./constants"



/**
 * SETUP
 */

const stats = Stats()
stats.dom.style.left = "auto"
stats.dom.style.right = "0"
document.body.append(stats.dom)

let data: IData = new Float32Array((N + 1) * 7)

const gizmo = new Object3D()
let sendTime: number

camera.position.z = 5
const vertices = new Float32Array(tetrahedronVertices)

const a_light = new AmbientLight(0xffffff, 0.2)
const d_light = new DirectionalLight(0xffffff, 0.8)
d_light.position.set(3, 5, 7)
scene.add(a_light, d_light)



/**
 * MESHES
 */

const geometry = new BufferGeometry()
geometry.setAttribute("position", new BufferAttribute(vertices, 3))
geometry.setIndex(tetrahedronIndices)
const material = new MeshPhongMaterial({ flatShading: true })
const meshes = new InstancedMesh(geometry, material, N)
scene.add(meshes)



/**
 * CONTAINER
 */

const tetrahedronGeometry = new TetrahedronBufferGeometry(0.25)
const tetrahedronMaterial = new MeshBasicMaterial({ wireframe: true })
const sphereGroup = new Group()
const
  widthSegments = 6,
  heightSegments = 4,
  widthUnitAngle = Math.PI * 2 / widthSegments,
  heightUnitAngle = Math.PI / heightSegments

for (let wi = 0; wi < widthSegments; wi++) {
  for (let hi = 0; hi < heightSegments; hi++) {
    const mesh = new Mesh(tetrahedronGeometry, tetrahedronMaterial)
    const { position, quaternion } = mesh

    const wAngle = wi * widthUnitAngle
    const hAngle = heightUnitAngle / 2 + hi * heightUnitAngle
    position.set(Math.sin(wAngle) * Math.sin(hAngle), Math.cos(hAngle), Math.cos(wAngle) * Math.sin(hAngle))
    quaternion.setFromEuler(new Euler(hAngle - Math.PI / 2, wAngle, 0, "YXZ"))

    mesh.rotateOnAxis(new Vector3(1, -1, 0).normalize(), Math.atan(Math.SQRT2))
    mesh.applyMatrix4(new Matrix4().makeRotationAxis(position.normalize(), position.y > 0 ? -Math.PI / 12 : Math.PI / 4))
    mesh.position.multiplyScalar(1.06)

    sphereGroup.add(mesh)
  }
}
scene.add(sphereGroup)



/**
 * WORKER
 */

const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })

const requestWorkerData = () => {
  sendTime = performance.now()
  worker.postMessage(data, [ data.buffer ])
}

worker.onmessage = (e: MessageEvent<IData>) => {
  stats.begin()
  data = e.data

  copyData(0, data, sphereGroup)

  for (let i = 1; i < N + 1; i++) {
    copyData(i * 7, data, gizmo)
    gizmo.updateMatrix()
    meshes.setMatrixAt(i - 1, gizmo.matrix)
  }
  meshes.instanceMatrix.needsUpdate = true

  const delay = timeStep * 1000 - (performance.now() - sendTime)
  setTimeout(requestWorkerData, Math.max(delay, 0))
  stats.end()
}
requestWorkerData()



/**
 * UTILS
 */

function copyData(
  i: number,
  data: IData,
  mesh: Object3D,
) {
  mesh.position.set(
    data[i + 0],
    data[i + 1],
    data[i + 2],
  )
  mesh.quaternion.set(
    data[i + 3],
    data[i + 4],
    data[i + 5],
    data[i + 6],
  )
}



/**
 * RENDER
 */

export const play = () => {}