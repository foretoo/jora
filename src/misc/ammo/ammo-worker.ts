import { Ammo } from "vendors/ammo.wasm.js"
import { Quaternion } from "three"
import { random } from "utils"
import { containerBox, IData, N, timeStep } from "./shared"

const config = { locateFile: () => "/dist/vendors/ammo.wasm.wasm" }

declare const self: Worker



////////
//////// SETUP

const bodies: Ammo.btRigidBody[] = []

const colideMaterial = { friction: 1, restitution: 0.667 }
const bodyBox = { min: 0.1, max: 0.5 }

const sizes = new Float32Array(N * 3)

for (let i = 0; i < N * 3; i += 3) {
  sizes[i + 0] = random(bodyBox.min, bodyBox.max)
  sizes[i + 1] = random(bodyBox.min, bodyBox.max)
  sizes[i + 2] = random(bodyBox.min, bodyBox.max)
}



////////
//////// PHYSIC


const AMMO = await Ammo(config) as Awaited<ReturnType<typeof Ammo>>

// World

const collisionConfiguration = new AMMO.btDefaultCollisionConfiguration()
const dispatcher = new AMMO.btCollisionDispatcher(collisionConfiguration)
const broadphase = new AMMO.btDbvtBroadphase()
const solver = new AMMO.btSequentialImpulseConstraintSolver()
const world = new AMMO.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration)
world.setGravity(new AMMO.btVector3(0, -9.81, 0))

const transform = new AMMO.btTransform()

createContainer()



////////
//////// WORKER

let data = {
  n: 0,
  transfer: new Float32Array(N * 10),
}

self.onmessage = (e: MessageEvent<IData>) => {
  data = e.data

  data.n < N && createBox(data.n)
  data.n = Math.min(N, ++data.n)

  world.stepSimulation(timeStep)

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
  body: Ammo.btRigidBody,
) {
  body.getMotionState().getWorldTransform(transform)
  const position = transform.getOrigin()
  const quaternion = transform.getRotation()
  const j = i * 10
  const k = i * 3

  data[j + 0] = position.x()
  data[j + 1] = position.y()
  data[j + 2] = position.z()
  data[j + 3] = quaternion.x()
  data[j + 4] = quaternion.y()
  data[j + 5] = quaternion.z()
  data[j + 6] = quaternion.w()
  data[j + 7] = sizes[k + 0]
  data[j + 8] = sizes[k + 1]
  data[j + 9] = sizes[k + 2]
}

function createContainer() {
  const shape = new AMMO.btBoxShape(new AMMO.btVector3(50, 50, 50))
  transform.setIdentity()
  transform.setOrigin(new AMMO.btVector3(0, -50, 0))
  const inertia = new AMMO.btVector3(0, 0, 0)
  const motionstate = new AMMO.btDefaultMotionState(transform)
  const info = new AMMO.btRigidBodyConstructionInfo(0, motionstate, shape, inertia) as Ammo.btRigidBodyConstructionInfo
  info.set_m_friction(colideMaterial.friction)
  info.set_m_restitution(colideMaterial.restitution)
  const body = new AMMO.btRigidBody(info) as Ammo.btRigidBody

  world.addRigidBody(body)
}

function createBox(i: number) {
  const shape = new AMMO.btBoxShape(
    new AMMO.btVector3(sizes[i * 3] * 0.5, sizes[i * 3 + 1] * 0.5, sizes[i * 3 + 2] * 0.5),
  ) as Ammo.btBoxShape

  transform.setIdentity()
  transform.setOrigin(new AMMO.btVector3(
    (containerBox.width - bodyBox.max) * random(-0.5, 0.5),
    containerBox.height,
    (containerBox.depth - bodyBox.max) * random(-0.5, 0.5),
  ))

  transform.setRotation(new AMMO.btQuaternion(...Object.values(new Quaternion().random()) as Tuple<number, 4>))

  const mass = 1
  const inertia = new AMMO.btVector3(0, 0, 0)
  shape.calculateLocalInertia(mass, inertia)
  const motionState = new AMMO.btDefaultMotionState(transform)
  const info = new AMMO.btRigidBodyConstructionInfo(mass, motionState, shape, inertia) as Ammo.btRigidBodyConstructionInfo
  info.set_m_friction(colideMaterial.friction)
  info.set_m_restitution(colideMaterial.restitution)
  // info.set_m_linearSleepingThreshold(1)
  // info.set_m_angularSleepingThreshold(1)
  const body = new AMMO.btRigidBody(info)

  world.addRigidBody(body)
  bodies.push(body)
}
