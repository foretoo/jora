import type { RigidBody, World } from "@dimforge/rapier3d"
import { Quaternion } from "three"
import { random } from "utils"
import { containerBox, IData, N } from "./shared"

declare const self: Worker

type Rapier = typeof import("@dimforge/rapier3d")



////////
//////// SETUP

const colideMaterial = { friction: 1, restitution: 0.2 }
const bodyBox = { min: 0.1, max: 0.5 }

const sizes = new Float32Array(N * 3)

for (let i = 0; i < N * 3; i += 3) {
  sizes[i + 0] = random(bodyBox.min, bodyBox.max)
  sizes[i + 1] = random(bodyBox.min, bodyBox.max)
  sizes[i + 2] = random(bodyBox.min, bodyBox.max)
}



const RAPIER = await import("@dimforge/rapier3d")

////////
//////// PHYSIC WORLD

const world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 })

createContainer(world, RAPIER)

const ballBodyDesc = RAPIER.RigidBodyDesc.dynamic().setCanSleep(true)

const bodies: RigidBody[] = []
for (let i = 0; i < N; i++) {
  const cube = world.createRigidBody(ballBodyDesc)

  world.createCollider(
    RAPIER.ColliderDesc
      .cuboid(sizes[i * 3] * 0.5, sizes[i * 3 + 1] * 0.5, sizes[i * 3 + 2] * 0.5)
      .setFriction(colideMaterial.friction)
      .setRestitution(colideMaterial.restitution),
    cube
  )

  cube.setTranslation({
    x: (containerBox.width - bodyBox.max) * random(-0.5, 0.5),
    y: containerBox.height,
    z: (containerBox.depth - bodyBox.max) * random(-0.5, 0.5),
  }, false)

  const rot = new Quaternion().random()
  cube.setRotation({
    x: rot.x, y: rot.y, z: rot.z, w: rot.w
  }, false)

  cube.setEnabled(false)
  bodies.push(cube)
}



////////
//////// WORKER

let data = {
  n: 0,
  transfer: new Float32Array(N * 10)
}

self.onmessage = (e: MessageEvent<IData>) => {
  data = e.data

  data.n = Math.min(N, ++data.n)
  bodies[data.n - 1].setEnabled(true)

  world.step()

  for (let i = 0; i < data.n; i++) {
    pasteData(i, data.transfer, bodies[i])
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
  const j = i * 10
  const k = i * 3

  data[j + 0] = position.x
  data[j + 1] = position.y
  data[j + 2] = position.z
  data[j + 3] = quaternion.x
  data[j + 4] = quaternion.y
  data[j + 5] = quaternion.z
  data[j + 6] = quaternion.w
  data[j + 7] = sizes[k + 0]
  data[j + 8] = sizes[k + 1]
  data[j + 9] = sizes[k + 2]
}



function createContainer(world: World, RAPIER: Rapier) {
  // Y+ plane
  world.createCollider(
    new RAPIER.ColliderDesc(
      new RAPIER.HalfSpace({ x: 0, y: 1, z: 0 })
    )
    .setFriction(colideMaterial.friction)
    .setRestitution(colideMaterial.restitution)
  )
  // // X+ plane
  // world.createCollider(
  //   new RAPIER.ColliderDesc(
  //     new RAPIER.HalfSpace({ x: 1, y: 0, z: 0 })
  //   )
  //   .setFriction(colideMaterial.friction)
  //   .setRestitution(colideMaterial.restitution)
  //   .setTranslation(containerBox.width * -0.5, 0, 0)
  // )
  // // X- plane
  // world.createCollider(
  //   new RAPIER.ColliderDesc(
  //     new RAPIER.HalfSpace({ x: -1, y: 0, z: 0 })
  //   )
  //   .setFriction(colideMaterial.friction)
  //   .setRestitution(colideMaterial.restitution)
  //   .setTranslation(containerBox.width * 0.5, 0, 0)
  // )
  // // Z+ plane
  // world.createCollider(
  //   new RAPIER.ColliderDesc(
  //     new RAPIER.HalfSpace({ x: 0, y: 0, z: 1 })
  //   )
  //   .setFriction(colideMaterial.friction)
  //   .setRestitution(colideMaterial.restitution)
  //   .setTranslation(0, 0, containerBox.depth * -0.5)
  // )
  // // Z- plane
  // world.createCollider(
  //   new RAPIER.ColliderDesc(
  //     new RAPIER.HalfSpace({ x: 0, y: 0, z: -1 })
  //   )
  //   .setFriction(colideMaterial.friction)
  //   .setRestitution(colideMaterial.restitution)
  //   .setTranslation(0, 0, containerBox.depth * 0.5)
  // )
}