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
let lastN = options.n

const requestWorkerData = () => {
  stats.begin()
  sendTime = performance.now()
  worker.postMessage(data, [ data.transfer.buffer ])
}

worker.onmessage = (e: MessageEvent<IDataWithRapier>) => {
  data = e.data

  copyData(0, data.transfer, container)

  deltaN = lastN - data.n
  meshes.count = lastN = data.n

  if (deltaN < 0) {
    setGizmoScale(0)
    for (let i = lastN; i < lastN - deltaN; i++) {
      meshes.setMatrixAt(i, gizmo.matrix)
    }
    setGizmoScale(1)
  }

  for (let i = 0; i < data.n; i++) {
    copyData(i + 1, data.transfer, gizmo)
    gizmo.updateMatrix()
    meshes.setMatrixAt(i, gizmo.matrix)
  }

  meshes.instanceMatrix.needsUpdate = true

  data.n = options.n

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

function setGizmoScale(v: number) {
  gizmo.scale.set(v, v, v)
  gizmo.updateMatrix()
}



export const play = () => {}