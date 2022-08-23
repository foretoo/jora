type MouseEventType = "wheel" | "mouseup" | "mousedown" | "mousemove"

type PointData = { x: number, y: number, a1: number, a2: number }

export type Controls = { a1: number, a2: number, k: number }

export function OrbitControls(
  a1 = Math.random() * 4 - 2,
  a2 = Math.random() * 4 - 2,
  k = 100,
  p: PointData | null = null
) {
  const out = { a1, a2, k }

  const listen = (type: MouseEventType, fn: (e: MouseEvent | WheelEvent) => void) => addEventListener(type, fn)

  listen("wheel", (e) => {
    const dir = Math.sign((e as WheelEvent).deltaY)
    out.k *= 1 - dir * 0.1
  })
  
  listen("mouseup", () => {
    p = null
  })
  
  listen("mousedown", (e) => {
    p = {
      x: e.x,
      y: e.y,
      a1: out.a1,
      a2: out.a2
    }
  })
  
  listen("mousemove", (e) => {
    if (p) {
      out.a1 = p.a1 - (e.x - p.x) / 100
      out.a2 = p.a2 - (e.y - p.y) / 100
    }
  })

  return out
}