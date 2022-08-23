import { createPSProgram } from "./createPSProgram"
import { OrbitControls } from "./orbitControls"
import { aizawaAttractorTick, halvorsenAttractorTick, sprottAttractorTick, thomasAttractorTick } from "./attractors"
import { fArray } from "./utils"
import { createPlayer } from "./createPlayer"
import * as dat from "dat.gui"



const canvas = document.querySelector("canvas")!
const pr = Math.min(devicePixelRatio, 2)
canvas.width = innerWidth * pr
canvas.height = innerHeight * pr

const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true })!
gl.clearColor(1.0, 1.0, 1.0, 1.0)



const positionData = fArray(100000, () => Math.random() * 6 - 3)
const particles = createPSProgram(gl)
const orbit = OrbitControls()



const gui = new dat.GUI()
const attractor = {
  attractor: "thomas",
  list: [ "thomas", "aizawa", "halvorsen" ],
  current: thomasAttractorTick,
}

gui
.add(attractor, "attractor", attractor.list)
.onChange((curr: "thomas" | "aizawa" | "halvorsen") => {
  if (curr === attractor.list[0]) {
    attractor.current = thomasAttractorTick
    orbit.a1 = -0.8
    orbit.a2 = 1
    orbit.k = 100
  }
  else if (curr === attractor.list[1]) {
    attractor.current = aizawaAttractorTick
    orbit.a1 = 0
    orbit.a2 = 0 // 1.5
    orbit.k = 271
  }
  else if (curr === attractor.list[2]) {
    attractor.current = halvorsenAttractorTick
    orbit.a1 = -0.7
    orbit.a2 = -0.7
    orbit.k = 80
  }
})



export const play = createPlayer((t: number) => {
  gl.clear(gl.COLOR_BUFFER_BIT)

  attractor.current(positionData, t)
  particles(positionData, innerWidth, innerHeight, t, orbit)
})