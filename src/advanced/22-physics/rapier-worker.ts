import type { RigidBody } from "@dimforge/rapier3d"
import { BODY_RADIUS, CONTAINER_RADIUS, IDataWithRapier, MAX, N, tetrahedronIndices, tetrahedronVertices } from "./constants"
import { randomBallPoint, randomQuaternion } from "utils"

declare const self: Worker



////////
//////// SETUP

const colideMaterial = { friction: 0.2, restitution: 0.2 }



////////
//////// PHYSICS

const RAPIER = await import("@dimforge/rapier3d")

const world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 })

// BODIES

const tetraBodyDesc = RAPIER.RigidBodyDesc.dynamic()

const tetraColliderDesc = RAPIER.ColliderDesc.convexMesh(
  new Float32Array(tetrahedronVertices.map((v) => v * BODY_RADIUS * (1 / Math.sqrt(3)))),
  new Uint32Array(tetrahedronIndices),
)!.setFriction(colideMaterial.friction)
  .setRestitution(colideMaterial.restitution)

const bodies: RigidBody[] = []

for (let i = 0; i < MAX; i++) {
  const body = world.createRigidBody(tetraBodyDesc)
  body.setTranslation(randomBallPoint(CONTAINER_RADIUS / 3 - BODY_RADIUS), false)
  body.setRotation(randomQuaternion(), false)
  world.createCollider(tetraColliderDesc, body)
  bodies.push(body)

  if (i >= N) body.setEnabled(false)
}

// CONTAINER

const containerBodyDesc = RAPIER.RigidBodyDesc.kinematicVelocityBased()
const containerBody = world.createRigidBody(containerBodyDesc)
containerBody.setAngvel(new RAPIER.Vector3(-1, 0, 1), false)

const vs = tetrahedronVertices.map((v) => v * CONTAINER_RADIUS * (1 / Math.sqrt(3)) / 3)

for (let i = 0; i < 4; i++) {
  let [ i1, i2, i3 ] = tetrahedronIndices.slice(i * 3, i * 3 + 3)
  i1 *= 3; i2 *= 3; i3 *= 3

  const px = vs[i1 + 0] + vs[i2 + 0] + vs[i3 + 0]
  const py = vs[i1 + 1] + vs[i2 + 1] + vs[i3 + 1]
  const pz = vs[i1 + 2] + vs[i2 + 2] + vs[i3 + 2]

  const nl = -1 / Math.sqrt(px ** 2 + py ** 2 + pz ** 2)
  const [ nx, ny, nz ] = [ px * nl, py * nl, pz * nl ]

  world.createCollider(createPlaneCollider(nx, ny, nz, px, py, pz), containerBody)
}



////////
//////// WORKER

let data = {
  n: N,
  transfer: new Float32Array((MAX + 1) * 7),
}
let lastN = data.n

self.onmessage = (e: MessageEvent<IDataWithRapier>) => {
  data = e.data

  const deltaN = data.n - lastN
  lastN = data.n

  if (deltaN < 0) {
    for (let i = data.n; i < data.n - deltaN; i++) {
      bodies[i].setEnabled(false)
    }
  }
  else if (deltaN > 0) {
    for (let i = data.n - deltaN; i < data.n; i++) {
      bodies[i].setTranslation(randomBallPoint(CONTAINER_RADIUS / 3 - BODY_RADIUS), false)
      bodies[i].setRotation(randomQuaternion(), false)
      bodies[i].setEnabled(true)
    }
  }

  world.step()

  pasteData(0, data.transfer, containerBody)
  for (let i = 0; i < data.n; i++) {
    pasteData(i + 1, data.transfer, bodies[i])
  }

  self.postMessage(data, [ data.transfer.buffer ])
}
self.postMessage(data, [ data.transfer.buffer ])






////////
//////// UTILS

function pasteData(
  i: number,
  data: Float32Array,
  body: RigidBody,
) {
  const position = body.translation()
  const quaternion = body.rotation()
  const j = i * 7

  data[j + 0] = position.x
  data[j + 1] = position.y
  data[j + 2] = position.z
  data[j + 3] = quaternion.x
  data[j + 4] = quaternion.y
  data[j + 5] = quaternion.z
  data[j + 6] = quaternion.w
}



function createPlaneCollider(
  nx: number, ny: number, nz: number,
  px: number, py: number, pz: number,
) {
  return new RAPIER.ColliderDesc(new RAPIER.HalfSpace(new RAPIER.Vector3(nx, ny, nz)))
    .setFriction(colideMaterial.friction)
    .setRestitution(colideMaterial.restitution)
    .setTranslation(px, py, pz)
}
