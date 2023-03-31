const nd = 3
export const unitGRandom = () => {
  let rand = 0
  for (let i = 0; i < nd; i++) {
    rand += Math.random()
  }
  return rand / nd
}

export const gRandom = (
  min?: number,
  max?: number,
) => {
  max ?? (max = min, min = 0)
  min ?? (min = 0, max = 1)
  return min + unitGRandom() * (max! - min)
}

export function random(
  min?: number,
  max?: number,
) {
  if (min === undefined) return Math.random()
  max ?? (max = min, min = 0)
  return min + Math.random() * (max! - min)
}

export function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.max(Math.min(value, max), min)
}

export function randomBallPoint(
  radius = 1,
) {
  const u = Math.random()
  const v = Math.random()
  const theta = u * 2.0 * Math.PI
  const phi = Math.acos(2.0 * v - 1.0)
  const r = Math.cbrt(Math.random() * radius)
  const sinTheta = Math.sin(theta)
  const cosTheta = Math.cos(theta)
  const sinPhi = Math.sin(phi)
  const cosPhi = Math.cos(phi)
  const x = r * sinPhi * cosTheta
  const y = r * sinPhi * sinTheta
  const z = r * cosPhi
  return { x, y, z }
}

export const sleep = async (time: number): Promise<never> => await new Promise((res) => void setTimeout(res, time))

export const randomQuaternion = () => {

  // from THREE.Quaternion.random

  const u1 = Math.random()
  const sqrt1u1 = Math.sqrt( 1 - u1 )
  const sqrtu1 = Math.sqrt( u1 )

  const u2 = 2 * Math.PI * Math.random()

  const u3 = 2 * Math.PI * Math.random()

  return {
    x: sqrt1u1 * Math.cos( u2 ),
    y: sqrtu1 * Math.sin( u3 ),
    z: sqrtu1 * Math.cos( u3 ),
    w: sqrt1u1 * Math.sin( u2 ),
  }
}

