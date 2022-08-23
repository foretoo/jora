import { createPSProgram } from "./createPSProgram"
import { OrbitControls } from "./orbitControls"
import { aizawaAttractorTick, halvorsenAttractorTick, sprottAttractorTick, thomasAttractorTick } from "./attractors"
import { fArray } from "./utils"
import { createPlayer } from "./createPlayer"

const canvas = document.querySelector("canvas")!
const pr = Math.min(devicePixelRatio, 2)
canvas.width = innerWidth * pr
canvas.height = innerHeight * pr

const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true })!
gl.clearColor(1.0, 1.0, 1.0, 1.0)



const positionData = fArray(100000, () => Math.random() * 6 - 3)
const particles = createPSProgram(gl, positionData)
const controls = OrbitControls()



export const play = createPlayer((t: number) => {
  gl.clear(gl.COLOR_BUFFER_BIT)

  thomasAttractorTick(positionData, t)
  particles(positionData, innerWidth, innerHeight, t, controls)
})