import { createScreenProgram } from "./createScreenProgram"
import { createPSProgram } from "./createPSProgram"

const canvas = document.querySelector("canvas")!
const pr = Math.min(devicePixelRatio, 2)
canvas.width = innerWidth * pr
canvas.height = innerHeight * pr
const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true })!
gl.enable(gl.BLEND)
gl.clearColor(1.0, 1.0, 1.0, 0.99)



const fullScreenTriangle = new Float32Array([ -1, 3, -1, -1, 3, -1 ])
const clearPass = createScreenProgram(gl, fullScreenTriangle)



const positionData = new Float32Array(
  Array(100000).fill(0).map(() => Math.random() * 6 - 3)
)

let t0: number
const thomasAttractorTick = (
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

type MouseEventType = "wheel" | "mouseup" | "mousedown" | "mousemove"
type PointControls = { x: number, y: number, a1: number, a2: number }
export type Controls = { a1: number, a2: number, k: number }
function OrbitControls(
  a1 = Math.random() * 4 - 2,
  a2 = Math.random() * 4 - 2,
  k = 100,
  p: PointControls | null = null
) {
  const out = { a1, a2, k }
  const evt = (type: MouseEventType, fn: (e: MouseEvent | WheelEvent) => void) => addEventListener(type, fn)
  evt("wheel", (e) => out.k *= 1 - Math.sign((e as WheelEvent).deltaY) * 0.1)
  evt("mouseup", () => p = null)
  evt("mousedown", (e) => p = { x: e.x, y: e.y, a1: out.a1, a2: out.a2 })
  evt("mousemove", (e) => {
    if (p) {
      out.a1 = p.a1 - (e.x - p.x) / 100
      out.a2 = p.a2 - (e.y - p.y) / 100
    }
  })
  return out
}

const controls = OrbitControls()

const particles = createPSProgram(gl, positionData)



export function play(t: number) {
  thomasAttractorTick(positionData, t)

  clearPass()
  particles(positionData, innerWidth, innerHeight, t, controls)

  requestAnimationFrame(play)
}



