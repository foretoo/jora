import { BoxGeometry, InstancedMesh, Mesh, MeshBasicMaterial, MeshNormalMaterial, Object3D } from "three"
import { containerBox, IData, N, timeStep } from "./shared"
import { camera, logs, scene } from "init"
import Stats from "three/examples/jsm/libs/stats.module"



////////
//////// SETUP

const stats = Stats()
stats.dom.style.left = "auto"
stats.dom.style.right = "0"
document.body.append(stats.dom)

let sendTime: number

let transfer = new Float32Array(N * 10)

const gizmo = new Object3D()

camera.position.set(3, 6, 9)



////////
//////// SCENE

const material = new MeshNormalMaterial()
const wireframe = new MeshBasicMaterial({ wireframe: true })

const container = new Mesh(new BoxGeometry(...Object.values(containerBox)), wireframe)
container.translateY(containerBox.height / 2)
scene.add(container)

const meshes = new InstancedMesh(new BoxGeometry(), material, N)
scene.add(meshes)

scene.position.set(0, -containerBox.height / 2, 0)



////////
//////// WORKER

const worker = new Worker(new URL("./physic-worker.ts", import.meta.url), { type: "module" })

let n = 0
const requestWorkerData = () => {
  stats.begin()
  sendTime = performance.now()
  worker.postMessage({ transfer, n }, [ transfer.buffer ])
}

worker.onmessage = (e: MessageEvent<IData>) => {
  ({ transfer, n } = e.data)

  logs.textContent = `${n}`

  for (let i = 0; i < n; i++) {
    copyData(i, transfer, gizmo)
    gizmo.updateMatrix()
    meshes.setMatrixAt(i, gizmo.matrix)
  }
  meshes.instanceMatrix.needsUpdate = true

  const delay = timeStep * 1000 - (performance.now() - sendTime)
  setTimeout(requestWorkerData, Math.max(delay, 0))
  
  stats.end()
}
requestWorkerData()



////////
//////// UTILS

function copyData(
  i: number,
  data: Float32Array,
  mesh: Object3D,
) {
  const j = i * 10
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
  mesh.scale.set(
    data[j + 7],
    data[j + 8],
    data[j + 9],
  )
}

export const play = () => {}