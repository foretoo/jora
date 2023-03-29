import { AmbientLight, BoxGeometry, DirectionalLight, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry, SphereGeometry, Vector3 } from "three"
import { Body, Box, ContactEquation, ContactMaterial, Material, Plane, Quaternion, SAPBroadphase, Sphere, Vec3, World } from "cannon-es"
import GUI from "lil-gui"
import { camera, scene } from "init"
import { clamp, random } from "utils"



//// SETUP

camera.position.set(-2, 5, 2)

const aLight = new AmbientLight(0xffffff, 0.2)
const dLight = new DirectionalLight(0xffffff, 0.8)
dLight.position.set(3, 5, 0)
scene.add(aLight, dLight)

const BV = Math.PI * 4 / 3



//// WORLD

const world = new World({
  gravity: new Vec3(0, -9.82, 0),
})
world.allowSleep = true
world.broadphase = new SAPBroadphase(world)



//// CONTACTS

const defaultMaterial = new Material("default")
const defaultContactMaterial = new ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.2,
    restitution: 0.333,
  },
)
world.defaultContactMaterial = defaultContactMaterial



//// FLOOR

const floorBody = new Body({
  mass: 0,
  shape: new Plane(),
  quaternion: new Quaternion(-Math.SQRT1_2, 0, 0, Math.SQRT1_2),
})
world.addBody(floorBody)

const floorMesh = new Mesh(
  new PlaneGeometry(5, 5),
  new MeshBasicMaterial({ color: 0xaaaaaa }),
)
floorMesh.name = "floor"
{
  const { x, y, z, w } = floorBody.quaternion
  floorMesh.quaternion.set(x, y, z, w)
}
scene.add(floorMesh)



//// BODIES

const ballGeometry = new SphereGeometry(1, 24, 12)
const boxGeometry = new BoxGeometry(1, 1, 1)
const phongMaterial = new MeshPhongMaterial()

const createBody = () => {
  const x = Math.random() - 0.5
  const z = Math.random() - 0.5
  const position = new Vector3(x, 2, z)

  if (Math.random() < 0.5) {
    createSphere(position)
  }
  else {
    createBox(position)
  }
}

const createSphere = (
  position: Vector3,
) => {
  const radius = random(0.033, 0.3)
  const mass = radius * radius * radius * BV

  const shape = new Sphere(radius)

  const bodyPosition = new Vec3(position.x, position.y, position.z)
  const ballBody = new Body({ mass, position: bodyPosition, shape })
  world.addBody(ballBody)
  ballBody.addEventListener("collide", playHitSound)

  const ballMesh = new Mesh(ballGeometry, phongMaterial)
  ballMesh.scale.set(radius, radius, radius)
  ballMesh.position.copy(position)
  scene.add(ballMesh)

  ballMesh.userData.position = position
  ballMesh.userData.quaternion = ballBody.quaternion
}

const createBox = (
  position: Vector3,
) => {
  const width = random(0.033, 0.3)
  const height = random(0.033, 0.3)
  const depth = random(0.033, 0.3)
  const mass = width * height * depth

  const shape = new Box(new Vec3(width * 0.5, height * 0.5, depth * 0.5))
  const bodyPosition = new Vec3(position.x, position.y, position.z)
  const boxBody = new Body({ mass, position: bodyPosition, shape })
  world.addBody(boxBody)
  boxBody.addEventListener("collide", playHitSound)

  const boxMesh = new Mesh(boxGeometry, phongMaterial)
  boxMesh.scale.set(width, height, depth)
  boxMesh.position.copy(position)
  scene.add(boxMesh)

  boxMesh.userData.position = position
  boxMesh.userData.quaternion = boxMesh.quaternion
}



//// SOUND

const hitSound = new Audio("../../public/sounds/hit.mp3")

const playHitSound = (
  collision: {
    body: Body,
    contact: ContactEquation,
    target: Body,
    type: "collide",
  },
) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal()
  if (impactStrength < 1) return

  hitSound.volume = clamp(impactStrength, 0, 1)
  hitSound.currentTime = 0
  hitSound.play()
}



//// INIT

createBody()
// setInterval(createBody, 2000)

const gui = new GUI()
gui.add({ add: createBody }, "add")
gui.add({
  reset: () => {
    while (world.bodies.length > 1) {
      scene.remove(scene.children[scene.children.length - 1])
      world.removeBody(world.bodies[world.bodies.length - 1])
    }
  },
}, "reset")



//// LOOPER

const dt = 1 / 60
let pt = 0
export const play = (
  t: number,
) => {
  world.step(dt, t - pt, 3)
  pt = t

  for (let i = 1; i < world.bodies.length; i++) {
    {
      const { x, y, z } = world.bodies[i].position
      scene.children[i + 2].position.set(x, y, z)
    } {
      const { x, y, z, w } = world.bodies[i].quaternion
      scene.children[i + 2].quaternion.set(x, y, z, w)
    }
  }
}