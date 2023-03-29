import { InstancedMesh, Mesh, MeshBasicMaterial, MeshNormalMaterial, Object3D, PolyhedronGeometry } from "three"
import Stats from "three/examples/jsm/libs/stats.module"
import GUI from "lil-gui"
import { camera, scene } from "init"
import { BODY_RADIUS, CONTAINER_RADIUS, IDataWithRapier, MAX, N, tetrahedronIndices, tetrahedronVertices, timeStep } from "./constants"
import RapierWorker from "./rapier-worker?worker"



////////
//////// SETUP

const stats = Stats()
document.body.appendChild(stats.dom)

const options = { n: N }
const gui = new GUI()
gui.add(options, "n", 0, MAX, 1).name("number")

camera.position.set(0, 2, 5)

const gizmo = new Object3D()

const normalMaterial = new MeshNormalMaterial()

const wireframeMaterial = new MeshBasicMaterial({ wireframe: true })



////////
//////// CONTAINER

const containerGeometry = new PolyhedronGeometry(
  tetrahedronVertices,
  tetrahedronIndices,
  CONTAINER_RADIUS,
)

const container = new Mesh(containerGeometry, wireframeMaterial)
scene.add(container)



////////
//////// MESHES

const meshGeometry = new PolyhedronGeometry(
  tetrahedronVertices,
  tetrahedronIndices,
  BODY_RADIUS,
)

const meshes = new InstancedMesh(meshGeometry, normalMaterial, MAX)
scene.add(meshes)

gizmo.scale.set(0, 0, 0)
gizmo.updateMatrix()
for (let i = N; i < MAX; i++) meshes.setMatrixAt(i, gizmo.matrix)
meshes.instanceMatrix.needsUpdate = true
gizmo.scale.set(1, 1, 1)



////////
//////// WORKER

const worker = new RapierWorker()

let data: IDataWithRapier
let sendTime: number
let deltaN = 0

const requestWorkerData = () => {
  stats.begin()
  sendTime = performance.now()
  worker.postMessage(data, [ data.transfer.buffer ])
}

worker.onmessage = (e: MessageEvent<IDataWithRapier>) => {
  data = e.data

  deltaN = options.n - data.n
  meshes.count = data.n = options.n

  copyData(0, data.transfer, container)
  for (let i = 0; i < data.n; i++) {
    copyData(i + 1, data.transfer, gizmo)
    gizmo.updateMatrix()
    meshes.setMatrixAt(i, gizmo.matrix)
  }
  meshes.instanceMatrix.needsUpdate = true

  const delay = timeStep * 1000 - (performance.now() - sendTime)
  setTimeout(requestWorkerData, Math.max(delay, 0))

  stats.end()
}



////////
//////// UTILS

function copyData(
  i: number,
  data: Float32Array,
  mesh: Object3D,
) {
  const j = i * 7
  mesh.position.set(
    data[j + 0],
    data[j + 1],
    data[j + 2],
  )
  mesh.quaternion.set(
    data[j + 3],
    data[j + 4],
    data[j + 5],
    data[j + 6],
  )
}



function setScale(
  i: number,
  scale: number,
  gizmo: Object3D,
  meshes: InstancedMesh,
) {
  gizmo.scale.set(scale, scale, scale)
  gizmo.updateMatrix()
  meshes.setMatrixAt(i, gizmo.matrix)
}



export const play = () => {
  if (deltaN === 0) return

  if (deltaN > 0) {
    for (let i = options.n - deltaN; i < options.n; i++) {
      setScale(i, 1, gizmo, meshes)
    }
  }
  else {
    for (let i = options.n; i < options.n - deltaN; i++) {
      setScale(i, 0, gizmo, meshes)
    }
    gizmo.scale.set(1, 1, 1)
  }
}