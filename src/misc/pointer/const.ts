import { Mesh, SphereBufferGeometry, Vector3 } from "three"
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler"

const sphereGeometry = new SphereBufferGeometry(1, 36, 18)
const sampler = new MeshSurfaceSampler(new Mesh(sphereGeometry))
.setWeightAttribute(null)
.build()



export const SIDE = 128
export const AMOUNT = SIDE * SIDE
export const INITIAL_DATA = new Float32Array(AMOUNT * 4)

const p = new Vector3()
for (let i = 0; i < AMOUNT * 4; i += 4) {
  sampler.sample(p)
  INITIAL_DATA[i + 0] = p.x
  INITIAL_DATA[i + 1] = p.y
  INITIAL_DATA[i + 2] = p.z
  INITIAL_DATA[i + 3] = 1
}