import { Body, ContactMaterial, ConvexPolyhedron, Material, Plane, Quaternion, SAPBroadphase, Trimesh, Vec3, World } from "cannon-es"
import { getRandomBallPoint, random } from "../../utils"
import { IData, N, tetrahedronIndices, tetrahedronVertices, timeStep } from "./constants"

declare const self: Worker



/**
 * WORLD
 */

const world = new World({
  gravity: new Vec3(0, -10, 0)
})
world.allowSleep = true
world.broadphase = new SAPBroadphase(world)
const defaultMaterial = new Material("default")
const defaultContactMaterial = new ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.618,
    restitution: 0.382,
  }
)
world.defaultContactMaterial = defaultContactMaterial



/**
 * BODIES
 */

const bodies: Body[] = []
const faces: number[][] = []
const vertices: Vec3[] = []

for (let i = 0; i < tetrahedronIndices.length / 3; i++) {
  faces.push([
    tetrahedronIndices[i * 3 + 0],
    tetrahedronIndices[i * 3 + 1],
    tetrahedronIndices[i * 3 + 2],
  ])
}
for (let i = 0; i < tetrahedronVertices.length / 3; i++) {
  vertices.push(new Vec3(
    tetrahedronVertices[i * 3 + 0],
    tetrahedronVertices[i * 3 + 1],
    tetrahedronVertices[i * 3 + 2],
  ))
}

const tetrahedronShape = new ConvexPolyhedron({ vertices, faces })

for (let i = 0; i < N; i++) {
  const body = new Body({ mass: 1 })
  body.addShape(tetrahedronShape)
  body.quaternion.setFromEuler(random(Math.PI), random(Math.PI), random(Math.PI)).normalize()
  const { x, y, z } = getRandomBallPoint()
  body.position.set(x, y, z)
  bodies.push(body)
  world.addBody(body)
}



/**
 * CONTAINER
 */

const container = new Body({ mass: 0, type: Body.KINEMATIC })
container.angularVelocity.set(
  Math.random() - 0.5,
  Math.random() - 0.5,
  Math.random() - 0.5,
).normalize()

const
  widthSegments = 6,
  heightSegments = 4,
  widthUnitAngle = Math.PI * 2 / widthSegments,
  heightUnitAngle = Math.PI / heightSegments

for (let wi = 0; wi < widthSegments; wi++) {
  for (let hi = 0; hi < heightSegments; hi++) {
    const plane = new Plane()
    const wAngle = wi * widthUnitAngle
    const hAngle = heightUnitAngle / 2 + hi * heightUnitAngle
    const offset = new Vec3(
      Math.sin(wAngle) * Math.sin(hAngle),
      Math.cos(hAngle),
      Math.cos(wAngle) * Math.sin(hAngle)
    )
    const orientation = new Quaternion().setFromEuler(hAngle + Math.PI / 2, wAngle, 0, "YXZ")
    container.addShape(plane, offset, orientation)
  }
}

world.addBody(container)



/**
 * WORKER
 */

self.onmessage = (e: MessageEvent<IData>) => {
  const { data } = e
  world.fixedStep(timeStep)

  pasteData(0, data, container)

  for (let i = 1; i < N + 1; i++) {
    pasteData(i * 7, data, bodies[i - 1])
  }

  self.postMessage(data, [ data.buffer ])
}



/**
 * UTILS
 */

function pasteData(
  i: number,
  data: IData,
  body: Body,
) {
  data[i + 0] = body.position.x
  data[i + 1] = body.position.y
  data[i + 2] = body.position.z
  data[i + 3] = body.quaternion.x
  data[i + 4] = body.quaternion.y
  data[i + 5] = body.quaternion.z
  data[i + 6] = body.quaternion.w
}



export type {}