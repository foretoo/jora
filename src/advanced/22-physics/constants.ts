export type IData = Float32Array

export type IDataWithRapier = {
  n: number
  transfer: Float32Array
}



export const tetrahedronVertices = [
  1, 1, 1,   -1, -1, 1,   -1, 1, -1,   1, -1, -1,
]
export const tetrahedronIndices = [
  2, 1, 0,   0, 3, 2,   1, 3, 0,   2, 3, 1,
]



export const N = 300
export const MAX = 600

export const timeStep = 1 / 60

export const CANNON_RADIUS = 0.1618
export const CONTAINER_RADIUS = Math.sqrt(3)
export const BODY_RADIUS = 0.128 * Math.cbrt(200 / MAX) * CONTAINER_RADIUS
