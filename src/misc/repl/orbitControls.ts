type MouseEventType = "wheel" | "mouseup" | "mousedown" | "mousemove"

type PointData = { x: number, y: number, a1: number, a2: number }

export type Orbit = { a1: number, a2: number, k: number }

export function OrbitControls(
  canvas: HTMLCanvasElement,
  a1 = -0.8,
  a2 = 1,
  k = 100,
  p: PointData | null = null,
) {
  const out = { a1, a2, k }

  canvas.addEventListener("wheel", (e) => {
    e.preventDefault()
    const dir = Math.sign((e as WheelEvent).deltaY)
    out.k *= 1 - dir * 0.1
  })
  canvas.addEventListener("mouseup", (e) => {
    e.preventDefault()
    p = null
  })
  canvas.addEventListener("mousedown", (e) => {
    e.preventDefault()
    p = {
      x: e.x,
      y: e.y,
      a1: out.a1,
      a2: out.a2,
    }
  })
  canvas.addEventListener("mousemove", (e) => {
    e.preventDefault()
    if (p) {
      out.a1 = p.a1 - (e.x - p.x) / 100
      out.a2 = p.a2 - (e.y - p.y) / 100
    }
  })

  canvas.addEventListener("touchend", (e) => {
    e.preventDefault()
    p = null
  })
  canvas.addEventListener("touchcancel", (e) => {
    e.preventDefault()
    p = null
  })
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault()
    p = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      a1: out.a1,
      a2: out.a2,
    }
  })
  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault()
    if (p) {
      out.a1 = p.a1 - (e.touches[0].clientX - p.x) / 100
      out.a2 = p.a2 - (e.touches[0].clientY - p.y) / 100
    }
  })

  return out
}