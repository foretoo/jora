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
const particles = createPSProgram(gl, positionData)
const controls = OrbitControls()



const gui = new dat.GUI()
const attractor = {
  attractor: "thomas",
  list: [ "thomas", "aizawa", "sprott", "halvorsen" ],
  current: thomasAttractorTick,
}

gui
.add(attractor, "attractor", attractor.list)
.onChange((curr: "thomas" | "aizawa" | "sprott" | "halvorsen") => {
  if (curr === attractor.list[0])      attractor.current = thomasAttractorTick
  else if (curr === attractor.list[1]) attractor.current = aizawaAttractorTick
  else if (curr === attractor.list[2]) attractor.current = sprottAttractorTick
  else if (curr === attractor.list[3]) attractor.current = halvorsenAttractorTick
})



export const play = createPlayer((t: number) => {
  gl.clear(gl.COLOR_BUFFER_BIT)

  attractor.current(positionData, t)
  particles(positionData, innerWidth, innerHeight, t, controls)
})