import { Color, ConeGeometry, CylinderBufferGeometry, DoubleSide, InstancedMesh, MeshStandardMaterial, Object3D, SphereBufferGeometry } from "three"
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
    return noiseData[i + 3] / 255
  }

  let tryNum = 20
  const getPoints = (): [number, number][] | undefined => {
    try {
      tryNum--
      const points: [number, number][] = new PoissonDiskSampling({
        shape: [ size, size ],
        minDistance: 18,
        maxDistance: 108,
        tries: 40,
        distanceFunction: (p: [ number, number ]) => {
          const v = getValue(p[0], p[1])
          return v > 0.3 ? 0 : 1 - v
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

  const geometry = new SphereBufferGeometry(radius, 3, 1, 0, Math.PI * 2, 0, Math.PI / 2) // new ConeGeometry(radius, radius * 2, 12, 1, true) // new CylinderBufferGeometry(radius / 2, radius, radius * 2, 12, 1)
  const material = new MeshStandardMaterial({ color: "#fff", side: DoubleSide })
  const mesh = new InstancedMesh(geometry, material, count)

  const gizmo = new Object3D()

  for (let i = 0; i < count; i++) {

    const px = points![i][0]
    const py = points![i][1]
    const ox = px / size * 10 - 5
    const oy = 5 - py / size * 10
    gizmo.position.set(ox, -0.1, oy)

    const v = Math.max(getValue(px, py), 0.25)
    const scaleH = 1 + v * Math.random() * 9
    const scaleV = v * scaleH * 3
    gizmo.scale.set(scaleH, scaleV, scaleH)

    gizmo.rotation.set(
      Math.random() / 3,
      Math.random() * Math.PI,
      0
    )
  
    gizmo.updateMatrix()
    mesh.setMatrixAt(i, gizmo.matrix)
  }

  return mesh
}