let t0: number



let thomasB = 0.208186
export const thomasAttractorTick = (
  points: Float32Array,
  t: number
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

    if (Math.random() > 0.99) {
      points[i * 3] *= 1.1
      points[i * 3 + 1] *= 1.1
      points[i * 3 + 2] *= 1.1
    }

  }
  t0 = t
}



let
  aizawaA = 0.55,
  aizawaB = 0.7,
  aizawaC = 0.6,
  aizawaD = 3.5,
  aizawaE = 0.25,
  aizawaF = 0.1

  // aizawaA = 0.1, // 0.95
  // aizawaB = 0.7,
  // aizawaC = 1.6,
  // aizawaD = 3.5,
  // aizawaE = 0.25,
  // aizawaF = 0.91,

export const aizawaAttractorTick = (
  points: Float32Array,
  t: number
) => {
  const dt = (t - t0 || 0) / 3000
  const max = points.length / 3

  for (let i = 0; i < max; i++) {
    const x = points[i * 3 + 0]
    const y = points[i * 3 + 1]
    const z = points[i * 3 + 2]

    points[i * 3 + 0] = x + dt * ((z - aizawaB) * x - aizawaD * y)
    points[i * 3 + 1] = y + dt * (aizawaD * x + (z - aizawaB) * y)
    points[i * 3 + 2] = z + dt * (aizawaC + aizawaA * z - (z * z * z) / 3 - (x * x + y * y) * (1 + aizawaE * z) + aizawaF * z * x * x * x)

    if (Math.random() > 0.99) {
      points[i * 3] *= 1.1
      points[i * 3 + 1] *= 1.1
      points[i * 3 + 2] *= 1.1
    }

  }
  t0 = t
}



let
  sprottA = 2.07,
  sprottB = 1.79

export const sprottAttractorTick = (
  points: Float32Array,
  t: number
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

    if (Math.random() > 0.99) {
      points[i * 3] *= 1.1
      points[i * 3 + 1] *= 1.1
      points[i * 3 + 2] *= 1.1
    }

  }
  t0 = t
}



let
  halvorsenA = 3.89

export const halvorsenAttractorTick = (
  points: Float32Array,
  t: number
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

    if (Math.random() > 0.99) {
      points[i * 3] *= 1.1
      points[i * 3 + 1] *= 1.1
      points[i * 3 + 2] *= 1.1
    }

  }
  t0 = t
}