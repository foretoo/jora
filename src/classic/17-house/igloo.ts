import { BufferAttribute } from "three/src/core/BufferAttribute"
import { BufferGeometry } from "three/src/core/BufferGeometry"
import { PolyhedronGeometry } from "three/src/geometries/PolyhedronGeometry"

const octo_vertices = [
  0, 0, -1,    1, 0, 0,    0, 0, 1,    -1, 0, 0,    0, 1, 0,
]
const octo_indices = [
  1, 0, 4,   2, 1, 4,    3, 2, 4,   0, 3, 4,
]
const protoigloo = new PolyhedronGeometry(octo_vertices, octo_indices, 1.5, 2)
const posarray = protoigloo.attributes.position.array
const normarray = protoigloo.attributes.normal.array
const uvarray = protoigloo.attributes.uv.array
const pointcount = protoigloo.attributes.position.count
const polycount = pointcount / 3

let pospoints = new Float32Array(posarray.length)
let normpoints = new Float32Array(normarray.length)
let uvpoints = new Float32Array(uvarray.length)



type TPoint = [ number, number, number ]
let tpoints: TPoint[] = []
let indices: TPoint[] = []

for (let i = 0; i < polycount; i++) {
  if (i === 9 || i === 22) continue

  const j = i * 9
  //// position
  pospoints[j + 0] = posarray[j + 0]; pospoints[j + 1] = posarray[j + 1]; pospoints[j + 2] = posarray[j + 2]
  pospoints[j + 3] = posarray[j + 3]; pospoints[j + 4] = posarray[j + 4]; pospoints[j + 5] = posarray[j + 5]
  pospoints[j + 6] = posarray[j + 6]; pospoints[j + 7] = posarray[j + 7]; pospoints[j + 8] = posarray[j + 8]
  //// normal
  normpoints[j + 0] = normarray[j + 0]; normpoints[j + 1] = normarray[j + 1]; normpoints[j + 2] = normarray[j + 2]
  normpoints[j + 3] = normarray[j + 3]; normpoints[j + 4] = normarray[j + 4]; normpoints[j + 5] = normarray[j + 5]
  normpoints[j + 6] = normarray[j + 6]; normpoints[j + 7] = normarray[j + 7]; normpoints[j + 8] = normarray[j + 8]
  //// uv
  uvpoints[j + 0] = uvarray[j + 0]; uvpoints[j + 1] = uvarray[j + 1]; uvpoints[j + 2] = uvarray[j + 2]
  uvpoints[j + 3] = uvarray[j + 3]; uvpoints[j + 4] = uvarray[j + 4]; uvpoints[j + 5] = uvarray[j + 5]
  uvpoints[j + 6] = uvarray[j + 6]; uvpoints[j + 7] = uvarray[j + 7]; uvpoints[j + 8] = uvarray[j + 8]
  //// indices
  posarray[j + 1] && tpoints.push([ posarray[j + 0], posarray[j + 1], posarray[j + 2] ])
  posarray[j + 4] && tpoints.push([ posarray[j + 3], posarray[j + 4], posarray[j + 5] ])
  posarray[j + 7] && tpoints.push([ posarray[j + 6], posarray[j + 7], posarray[j + 8] ])
}

const igloo = new BufferGeometry()
igloo.setAttribute("position", new BufferAttribute(pospoints, 3, false))
igloo.setAttribute("normal", new BufferAttribute(normpoints, 3, false))
igloo.setAttribute("uv", new BufferAttribute(uvpoints, 3, false))

type Mapper<T, R> = (arr: T) => R
let set  = new Set(tpoints.map(JSON.stringify as Mapper<TPoint, string>))
indices = Array.from(set).map(JSON.parse as Mapper<string, TPoint>)

export { igloo, indices }