let t0: number

const rndPoints = (
  points: Float32Array,
  i: number,
  roughness: number,
) => {
  const k = Math.sqrt(roughness)
  points[i * 3 + 0] *= 1 + Math.random() * k
  points[i * 3 + 1] *= 1 + Math.random() * k
  points[i * 3 + 2] *= 1 + Math.random() * k
}



let thomasB = 0.208186
export const thomasAttractorTick = (
  points: Float32Array,
  t: number,
  roughness: number,
) => {
  const dt = (t - t0 || 0) / 618
  const max = points.length / 3

  for (let i = 0; i < max; i++) {
    const x = points[i * 3 + 0]
    const y = points[i * 3 + 1]
    const z = points[i * 3 + 2]

    points[i * 3 + 0] = x + dt * (Math.sin(y) - thomasB * x)
    points[i * 3 + 1] = y + dt * (Math.sin(z) - thomasB * y)
    points[i * 3 + 2] = z + dt * (Math.sin(x) - thomasB * z)

    if (Math.random() > 1 - roughness) rndPoints(points, i, roughness)
  }
  t0 = t
}



let
  aizawaA = 0.95, // height of torus
  aizawaB = 0.5, // attract to polars >1 top, <0 bottom
  aizawaC = 1.40, // attratct to torus
  aizawaD = 0.01, // rotating by Y
  aizawaE = 0.15, // more tiny torus
  aizawaF = 0.01  // skew -> mobius ribbon

  // aizawaA = 0.1, // 0.95
  // aizawaB = 0.7,
  // aizawaC = 1.6,
  // aizawaD = 3.5,
  // aizawaE = 0.25,
  // aizawaF = 0.91,

export const aizawaAttractorTick = (
  points: Float32Array,
  t: number,
  roughness: number,
) => {
  const dt = (t - t0 || 0) / 2000
  const max = points.length / 3

  for (let i = 0; i < max; i++) {
    const x = points[i * 3 + 0]
    const y = points[i * 3 + 1]
    const z = points[i * 3 + 2]

    points[i * 3 + 0] = x + dt * ((z - aizawaB) * x - aizawaD * y)
    points[i * 3 + 1] = y + dt * (aizawaD * x + (z - aizawaB) * y)
    points[i * 3 + 2] = z + dt * (aizawaC + aizawaA * z - (z * z * z) / 3 - (x * x + y * y) * (1 + aizawaE * z) + aizawaF * z * x * x * x)

    if (Math.random() > 1 - roughness) rndPoints(points, i, roughness)
  }
  t0 = t
}



let
  sprottA = 2.07,
  sprottB = 1.79

export const sprottAttractorTick = (
  points: Float32Array,
  t: number,
  roughness: number,
) => {
  const dt = (t - t0 || 0) / 3000
  const max = points.length / 3

  for (let i = 0; i < max; i++) {
    const x = points[i * 3 + 0]
    const y = points[i * 3 + 1]
    const z = points[i * 3 + 2]

    points[i * 3 + 0] = x + dt * (y  +  sprottA * x * y  +  x * z)
    points[i * 3 + 1] = y + dt * (1  -  sprottB * x * x  +  y * z)
    points[i * 3 + 2] = z + dt * (x  -  x * x  -  y * y)

    if (Math.random() > 1 - roughness) rndPoints(points, i, roughness)
  }
  t0 = t
}



let
  halvorsenA = 3.89

export const halvorsenAttractorTick = (
  points: Float32Array,
  t: number,
  roughness: number,
) => {
  const dt = (t - t0 || 0) / 5000
  const max = points.length / 3

  for (let i = 0; i < max; i++) {
    const x = points[i * 3 + 0]
    const y = points[i * 3 + 1]
    const z = points[i * 3 + 2]

    points[i * 3 + 0] = x + dt * (-halvorsenA * x - 4 * y - 4 * z - y * y)
    points[i * 3 + 1] = y + dt * (-halvorsenA * y - 4 * z - 4 * x - z * z)
    points[i * 3 + 2] = z + dt * (-halvorsenA * z - 4 * x - 4 * y - x * x)

    if (Math.random() > 1 - roughness) rndPoints(points, i, roughness)
  }
  t0 = t
}



let
  lorenzA = 10,
  lorenzB = 28,
  lorenzC = 8/3

export const lorenzAttractorTick = (
  points: Float32Array,
  t: number,
  roughness: number,
) => {
  const dt = (t - t0 || 0) / 10000
  const max = points.length / 3

  for (let i = 0; i < max; i++) {
    const x = points[i * 3 + 0]
    const y = points[i * 3 + 1]
    const z = points[i * 3 + 2]

    points[i * 3 + 0] = x + dt * (lorenzA * (-x + y))
    points[i * 3 + 1] = y + dt * (-x * z + lorenzB * x - y)
    points[i * 3 + 2] = z + dt * (x * y - lorenzC * z)

    if (Math.random() > 1 - roughness) rndPoints(points, i, roughness)
  }
  t0 = t
}



let
  tsA = 32.48,
  tsB = 45.84,
  tsC = 1.18,
  tsD = 0.13,
  tsE = 0.57,
  tsF = 14.7


export const threeScrollAttractorTick = (
  points: Float32Array,
  t: number,
  roughness: number,
) => {
  const dt = (t - t0 || 0) / 50000
  const max = points.length / 3

  for (let i = 0; i < max; i++) {
    const x = points[i * 3 + 0]
    const y = points[i * 3 + 1]
    const z = points[i * 3 + 2]

    points[i * 3 + 0] = x + dt * (tsA * (y - x)  +  tsD * x * z)
    points[i * 3 + 1] = y + dt * (tsB * x  -  x * z  +  tsF * y)
    points[i * 3 + 2] = z + dt * (tsC * z  +  x * y  -  tsE * x * x)

    if (Math.random() > 1 - roughness) rndPoints(points, i, roughness)
  }
  t0 = t
}



let
  djA =  0.97,
  djB = -1.91,
  djC =  1.41,
  djD = -1.51

export const deJongAttractorTick = (
  points: Float32Array,
  t: number,
  roughness: number,
) => {
  const dt = (t - t0 || 0) / 1000
  const max = points.length / 3

  for (let i = 0; i < max; i++) {
    const x = points[i * 3 + 0]
    const y = points[i * 3 + 1]
    const z = points[i * 3 + 2]

    points[i * 3 + 0] = Math.sin(djA * y) - Math.cos(djB * x)
    points[i * 3 + 1] = Math.sin(djC * x) - Math.cos(djD * y)
    points[i * 3 + 2] = z

    if (Math.random() > 1 - roughness) rndPoints(points, i, roughness)
  }
  t0 = t
}