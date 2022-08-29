import { InstancedMesh, MeshStandardMaterial, Object3D, Shader, SphereBufferGeometry } from "three"
import PoissonDiskSampling from "poisson-disk-sampling"
import { scene } from "../../init"
import { rttBuffer } from "./rtt"



const radius = 0.1

const size = Math.sqrt(rttBuffer.length / 4)

const getValue = (
  x: number,
  y: number,
) => {
  const
  _x = Math.floor(x),
  _y = Math.floor(y),
  i = (_y * size + _x) * 4
  return rttBuffer[i] / 255
}

let tryNum = 20
const getPoints = (): [number, number][] | undefined => {
  try {
    tryNum--
    const points: [number, number][] = new PoissonDiskSampling({
      shape: [ size, size ],
      minDistance: size / 16,
      maxDistance: size / 2,
      tries: 40,
      distanceFunction: (p: [ number, number ]) => {
        const v = getValue(p[0], p[1])
        return v > 0.3 ? 0 : 1 - v
      },
    }).fill()
    if (points?.length < 40) throw undefined
    return points
  }
  catch (err) {
    return tryNum ? getPoints() : undefined
  }
}

const points = getPoints()
const count = points?.length || 0

const geometry = new SphereBufferGeometry(radius, 3, 1, 0, Math.PI * 2, 0, Math.PI / 2)
const material = new MeshStandardMaterial()

material.onBeforeCompile = (shader: Shader) => {
  shader.vertexShader =
    "varying vec3 vPosition;\n" +
    shader.vertexShader
      .replace(/#ifdef USE_TRANSMISSION|#endif/g, "")
      .replace(
        "#include <begin_vertex>",
        "vPosition = vec3( position ); vec3 transformed = vec3( position );"
      )

  shader.fragmentShader = shader.fragmentShader
    .replace(
      "varying vec3 vViewPosition;", 
      "varying vec3 vViewPosition; varying vec3 vWorldPosition; varying vec3 vPosition;"
    )
    .replace(
      "#include <color_fragment>",
      `
      float py = vPosition.y * 10.0;
      vec3 wp = vWorldPosition;
      float v = smoothstep(0.0, 1.0, 0.3 + wp.y / 2.5 * 0.7);

      diffuseColor.rgb = vec3(1.0 - (1.0 - v) * py, (v + py) * 0.5, py);
      `
    )
}

material.needsUpdate = true

const mesh = new InstancedMesh(geometry, material, count)
mesh.material.flatShading = true
mesh.castShadow = true
mesh.receiveShadow = true

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
  gizmo.position.y += v * v * 0.62
  gizmo.scale.set(scaleH, scaleV, scaleH)

  gizmo.rotation.set(
    Math.random() / 3,
    Math.random() * Math.PI,
    0
  )

  gizmo.updateMatrix()
  mesh.setMatrixAt(i, gizmo.matrix)
}



export const initFellas = () => {
  scene.add(mesh)
}