let t0: number
export const thomasAttractorTick = (
  pts: Float32Array,
  t: number
) => {
  const dt = t0 ? (t - t0) / 618 : 3
  const max = pts.length / 3
  for (let i = 0; i < max; i++) {
    const x = pts[i * 3 + 0]
    const y = pts[i * 3 + 1]
    const z = pts[i * 3 + 2]

    pts[i * 3 + 0] = x + dt * (Math.sin(y) - 0.15 * x)
    pts[i * 3 + 1] = y + dt * (Math.sin(z) - 0.15 * y)
    pts[i * 3 + 2] = z + dt * (Math.sin(x) - 0.15 * z)

    if (Math.random() > 0.99) {
      pts[i * 3] *= 1.1
      pts[i * 3 + 1] *= 1.1
      pts[i * 3 + 2] *= 1.1
    }

  }
  t0 = t
}