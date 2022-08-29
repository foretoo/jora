import { createNoise2D } from "simplex-noise"
import { InstancedMesh, MeshStandardMaterial, Object3D, PointLight, SphereBufferGeometry, Vector2 } from "three"
import { scene } from "../../init"

const flynum = 4
const flyGeometry = new SphereBufferGeometry(0.03, 6, 4)
const flyMaterial = new MeshStandardMaterial({ emissive: "#5ff", emissiveIntensity: 1 })
const fliesMesh = new InstancedMesh(flyGeometry, flyMaterial, flynum)
const flyGismo = new Object3D()
scene.add(fliesMesh)

const noise2D = createNoise2D()

const flies = Array(flynum).fill(null).map((_, i) => {
  const color = "#fff"
  const light = new PointLight(color, 1.5, 3)
  light.castShadow = true
  light.shadow.mapSize = new Vector2(128, 128)
  light.shadow.camera.near = 0.1
  light.shadow.camera.far = 3
  light.shadow.bias = 0.00003
  light.shadow.normalBias = 0.05
  scene.add(light)

  const start = Math.random() * Math.PI * 2
  const vel = 0.001 + Math.random() * 0.002
  const dir = Math.sign(Math.random() - 0.5)
  const distance = 1.4 + Math.random() * 3.3

  let t = 0
  const update = () => {
    const n = noise2D(t + start, 0)
    const d = distance + distance * n / 2
    const dt = distance / d

    flyGismo.position.set(
      Math.cos(start + t * dir * Math.PI * 2) * d,
      2 + n * 1.5,
      Math.sin(start + t * dir * Math.PI * 2) * d,
    )
    t += vel * dt
    light.position.copy(flyGismo.position)

    flyGismo.updateMatrix()
    fliesMesh.setMatrixAt(i, flyGismo.matrix)
  }
  return { update }
})

export const updateFlies = () => {
  flies.forEach((ghost) => ghost.update())
  fliesMesh.instanceMatrix.needsUpdate = true
}