export const randomSpherePoint = (
  radius: number = 1,
  x: number = 0,
  y: number = 0,
  z: number = 0,
) => {
  const u = Math.random()
  const v = Math.random()
  const theta = 2 * Math.PI * u
  const phi = Math.acos(2 * v - 1)
  return [
    x + (radius * Math.sin(phi) * Math.cos(theta)),
    y + (radius * Math.sin(phi) * Math.sin(theta)),
    z + (radius * Math.cos(phi)),
  ]
}

type Mapper = <T>(value: T, index: number, array: T[]) => number
export const fArray = (
  n: number,
  mapper: Mapper
) => {
  return new Float32Array(Array(n).fill(0).map(mapper))
}