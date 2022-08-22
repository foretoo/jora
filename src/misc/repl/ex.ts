declare global {
  interface Window {
    t: number
    thomasAttractor: Float32Array & { t0: number }
    controls: { a1: number, a2: number, k: number }
    fullScreenTriangle: Float32Array
  }
}



const canvas = document.querySelector("canvas")!

let b = 0.208186
addEventListener("mousemove", (e) => {
  (b = e.y / innerHeight * 0.1 +  e.x / innerWidth * 0.1 + 0.1)
})

const gl = canvas.getContext("webgl", { preserveDrawingBuffer: true })!
gl.enable(gl.BLEND)
window.controls = OrbitControls()
window.fullScreenTriangle = new Float32Array([ -1, 3, -1, -1, 3, -1 ])
window.thomasAttractor = new Float32Array(
  Array(15000).fill(0).map(() => Math.random() * 6 - 3)
) as Window["thomasAttractor"]



const clearPass = program(gl, `
attribute vec2 pt = () => window.fullScreenTriangle;
void main() {
    gl_Position = vec4(pt, 0.0, 1.0);
}`, `
void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);
}`)

const particles = program(gl, `
attribute vec3 pt = () => window.thomasAttractor;
uniform vec2 resolution = () => [innerWidth, innerHeight];
uniform float time = () => [window.t];
uniform float a1 = () => [window.controls.a1];
uniform float a2 = () => [window.controls.a2];
uniform float k = () => [window.controls.k];
void main() {
    float far = 1000.0;
    float x = pt.x*cos(a1) + pt.z*sin(a1);
    float z = pt.z*cos(a1) - pt.x*sin(a1);
    float y = pt.y*cos(a2) + z*sin(a2);
    float d = z*cos(a2) - pt.y*sin(a2) + far;
    vec2 pos = vec2( (k/d)*x, (k/d)*y );
    pos.y *= resolution.x/resolution.y;
    gl_Position = vec4(pos, 0.0, 1.0);
    gl_PointSize = 2.0;
}`, `
void main() {
    gl_FragColor = vec4(1.0);
}`)



export function play(t: number) {
  window.t = t
  thomasAttractorTick(window.thomasAttractor, t)

  if (canvas.width != innerWidth || canvas.height !== innerHeight)
    gl.viewport(0, 0, canvas.width = innerWidth, canvas.height = innerHeight)

  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  clearPass(3, gl.TRIANGLES)


  gl.blendFunc(gl.ONE, gl.ONE)
  particles(window.thomasAttractor.length / 3, gl.POINTS)

  requestAnimationFrame(play)
}



function thomasAttractorTick(
  pts: Window["thomasAttractor"],
  t: number
) {

  const dt = pts.t0 ? (t - pts.t0) / 1000 : 3
  const max = pts.length / 3
  for (let i = 0; i < max; i++) {
    const x = pts[i * 3]
    const y = pts[i * 3 + 1]
    const z = pts[i * 3 + 2]
    pts[i * 3]   = x + dt * (Math.sin(y) - b * x)
    pts[i * 3 + 1] = y + dt * (Math.sin(z) - b * y)
    pts[i * 3 + 2] = z + dt * (Math.sin(x) - b * z)
    if (Math.random() > 0.9995) {
      pts[i * 3] *= 3
      pts[i * 3 + 1] *= 3
      pts[i * 3 + 2] *= 3
    }

  }
  pts.t0 = t
}



type MouseEventType = "wheel" | "mouseup" | "mousedown" | "mousemove"
function OrbitControls(
  a1 = Math.random() * 2 - 1,
  a2 = Math.random() * 2 - 1,
  k = 150,
  p: { x: number, y: number, a1: number, a2: number } | null = null
) {  
  const out = { a1, a2, k }
  const evt = (type: MouseEventType, fn: (e: MouseEvent | WheelEvent) => void) => addEventListener(type, fn)
  evt("wheel", (e) => out.k *= 1 - Math.sign((e as WheelEvent).deltaY) * 0.1)
  evt("mouseup", () => p = null)
  evt("mousedown", (e) => p = { x: e.x, y: e.y, a1: out.a1, a2: out.a2 })
  evt("mousemove", (e) => p && (out.a1 = p.a1 - (e.x - p.x) / 100) + (out.a2 = p.a2 - (e.y - p.y) / 100))
  return out
}



function program(
  gl: WebGLRenderingContext,
  vs: string,
  fs: string,
) {
  const uniforms: (() => void)[] = []
  const attributes: (() => void)[] = []
  const pid = gl.createProgram()!
  shader(vs, gl.VERTEX_SHADER)
  shader(fs, gl.FRAGMENT_SHADER)
  gl.linkProgram(pid)
  gl.useProgram(pid)

  return (
    count: number,
    type: number
  ) => {
    gl.useProgram(pid)
    uniforms.forEach((uf) => uf())
    attributes.forEach((attr) => attr())
    gl.drawArrays(type, 0, count)
  }

  function shader(src: string, type: number) {
    const id = gl.createShader(type)!
    src = prepare(src)
    console.log(src)
    gl.shaderSource(id, "precision highp float;\n" + src)
    gl.compileShader(id)
    gl.attachShader(pid, id)
  }

  function prepare(src: string) {
    return src.split("\n").map((line) => {
      if (~line.indexOf("attribute"))
        line = attr(line)
      else if (~line.indexOf("uniform"))
        line = uf(line)
      return line
    }).join("\n")
  }

  type UniformNfSetter = (loc: WebGLUniformLocation | null, ...v: number[]) => void
  function uf(line: string) {

    const l = line.split(/\s+/)
    const size = +l[1].split("vec")[1] || 1
    const f = gl[ `uniform${size}f` as keyof WebGLRenderingContext ] as UniformNfSetter
    const code = "return () =" + line.split("=")[2]
    const uniformValue = (new Function("", code))()

    let loc: WebGLUniformLocation | null


    uniforms.push(() => {
      if (!loc) loc = gl.getUniformLocation(pid, l[2])
      const v = uniformValue()
      f.call(gl, loc, ...v)
    })

    return line.split("=")[0].trim() + ";"
  }

  function attr(line: string) {

    const l = line.split(/\s+/)
    const size = +l[1].split("vec")[1] || 1
    const bufferId = gl.createBuffer()
    const code = "return () =" + line.split("=")[2]
    const arrtibuteValue = (new Function("", code))()

    let type: number
    let loc: number


    attributes.push(() => {
      gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
      if (!loc) {
        loc = gl.getAttribLocation(pid, l[2])
        gl.enableVertexAttribArray(loc)
      }
      type = type ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW
      const data = arrtibuteValue()
      gl.bufferData(gl.ARRAY_BUFFER, data, type)
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0)
    })

    return line.split("=")[0].trim() + ";"
  }
}
