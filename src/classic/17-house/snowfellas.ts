import { DoubleSide, InstancedMesh, MeshStandardMaterial, Object3D, SphereBufferGeometry } from "three"
import PoissonDiskSampling from "poisson-disk-sampling"



export const getSnowFellas = (
  radius: number,
  noiseData: Uint8Array
) => {

  const size = Math.sqrt(noiseData.length / 4)

  const getValue = (
    x: number,
    y: number,
  ) => {
    const
    _x = Math.floor(x),
    _y = Math.floor(y),
    i = (_y * size + _x) * 4
    return noiseData[i] / 255
  }

  let tryNum = 20
  const getPoints = (): [number, number][] | undefined => {
    try {
      tryNum--
      const points: [number, number][] = new PoissonDiskSampling({
        shape: [ size, size ],
        minDistance: 6,
        maxDistance: 66,
        tries: 20,
        distanceFunction: (p: [ number, number ]) => {
          const v = getValue(p[0], p[1])
          return v > 0.2 ? 0 : 1
        },
      }).fill()
      if (points?.length < 50) throw undefined
      return points
    }
    catch (err) {
      return tryNum ? getPoints() : undefined
    }
  }

  const points = getPoints()
  const count = points?.length || 0

  const geometry = new SphereBufferGeometry(radius, 18, 6, 0, Math.PI * 2, 0, Math.PI / 2)
  const material = new MeshStandardMaterial({ color: "#fff", side: DoubleSide })
  const mesh = new InstancedMesh(geometry, material, count)

  const gizmo = new Object3D()

  for (let i = 0; i < count; i++) {
    const px = points![i][0]
    const py = points![i][1]
    const ox = px / size * 10 - 5
    const oy = 5 - py / size * 10
    gizmo.position.set(
      Math.abs(ox) > 4.5 ? 4.5 * Math.sign(ox) : ox,
      0,
      Math.abs(oy) > 4.5 ? 4.5 * Math.sign(oy) : oy,
    )
    const v = getValue(px, py)
    const scaleH = 1 + v * Math.random() * 5
    const scaleV = v * scaleH * 5
    gizmo.scale.set(scaleH, scaleV, scaleH)
  
    gizmo.updateMatrix()
    mesh.setMatrixAt(i, gizmo.matrix)
  }

  return mesh
}