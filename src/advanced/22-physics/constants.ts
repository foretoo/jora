export type IData = Float32Array

export const N = 1
export const timeStep = 1 / 60

const SCALE = 0.1
export const tetrahedronVertices = [
  1, 1, 1,   -1, -1, 1,   -1, 1, -1,   1, -1, -1
].map((v) => v * SCALE)

export const tetrahedronIndices = [
  2, 1, 0,   0, 3, 2,   1, 3, 0,   2, 3, 1
]