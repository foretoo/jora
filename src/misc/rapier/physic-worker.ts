import type { RigidBody, World } from "@dimforge/rapier3d"
import { Quaternion } from "three"
import { random, sleep } from "utils"
import { containerBox, IData, N } from "./shared"

declare const self: Worker

type Rapier = typeof import("@dimforge/rapier3d")



////////
//////// SETUP

let world: World
const bodies: RigidBody[] = []
let ready = false

const colideMaterial = {
  friction: 1,
  restitution: 0.2,
}

const bodyBox = {
  min: 0.1, max: 0.5
}

const sizes = new Float32Array(N * 3)

for (let i = 0; i < N * 3; i += 3) {
  sizes[i + 0] = random(bodyBox.min, bodyBox.max)
  sizes[i + 1] = random(bodyBox.min, bodyBox.max)
  sizes[i + 2] = random(bodyBox.min, bodyBox.max)
}



import("@dimforge/rapier3d").then((RAPIER) => {

  ////////
  //////// PHYSIC WORLD

  world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 })

  createContainer(world, RAPIER)

  const ballBodyDesc = RAPIER.RigidBodyDesc.dynamic()
    .setCanSleep(true)

  for (let i = 0; i < N; i++) {
    const cube = world.createRigidBody(ballBodyDesc)

    world.createCollider(
      RAPIER.ColliderDesc
        .cuboid(sizes[i * 3] / 2, sizes[i * 3 + 1] / 2, sizes[i * 3 + 2] / 2)
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

  self.onmessage = (e: MessageEvent<IData>) => {
    e.data.n = Math.min(N, ++e.data.n)
    bodies[e.data.n - 1].setEnabled(true)

    world.step()

    for (let i = 0; i < e.data.n; i++) {
      pasteData(i, e.data.transfer, bodies[i])

      const v = bodies[i].linvel()
      const velSum = Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z)

      if (velSum < 0.001) bodies[i].sleep()
    }

    self.postMessage(e.data, [ e.data.transfer.buffer ])
  }
})

self.onmessage = async (e: MessageEvent<IData>) => {
  await sleep(100)
  self.postMessage(e.data, [ e.data.transfer.buffer ])
}



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
  world.createCollider(
    new RAPIER.ColliderDesc(
      new RAPIER.HalfSpace({ x: 0, y: 1, z: 0 })
    )
    .setFriction(colideMaterial.friction)
    .setRestitution(colideMaterial.restitution)
  )
  world.createCollider(
    new RAPIER.ColliderDesc(
      new RAPIER.HalfSpace({ x: 1, y: 0, z: 0 })
    )
    .setFriction(colideMaterial.friction)
    .setRestitution(colideMaterial.restitution)
    .setTranslation(containerBox.width * -0.5, 0, 0)
  )
  world.createCollider(
    new RAPIER.ColliderDesc(
      new RAPIER.HalfSpace({ x: -1, y: 0, z: 0 })
    )
    .setFriction(colideMaterial.friction)
    .setRestitution(colideMaterial.restitution)
    .setTranslation(containerBox.width * 0.5, 0, 0)
  )
  world.createCollider(
    new RAPIER.ColliderDesc(
      new RAPIER.HalfSpace({ x: 0, y: 0, z: 1 })
    )
    .setFriction(colideMaterial.friction)
    .setRestitution(colideMaterial.restitution)
    .setTranslation(0, 0, containerBox.depth * -0.5)
  )
  world.createCollider(
    new RAPIER.ColliderDesc(
      new RAPIER.HalfSpace({ x: 0, y: 0, z: -1 })
    )
    .setFriction(colideMaterial.friction)
    .setRestitution(colideMaterial.restitution)
    .setTranslation(0, 0, containerBox.depth * 0.5)
  )
}