import { Controls } from "."

export const createThomasProgram = (
  gl: WebGLRenderingContext,
  thomasPoints: Float32Array,
) => {
  const programId = gl.createProgram()!

  const vertexShaderId = gl.createShader(gl.VERTEX_SHADER)!
  let vertexSource = `
  attribute vec3 pt;

  uniform vec2 resolution;
  uniform float time;
  uniform float a1;
  uniform float a2;
  uniform float k;

  void main() {
    float far = 1000.0;
    float x = pt.x * cos(a1) + pt.z * sin(a1);
    float z = pt.z * cos(a1) - pt.x * sin(a1);
    float y = pt.y * cos(a2) +    z * sin(a2);
    float d =    z * cos(a2) - pt.y * sin(a2) + far;
    
    vec2 pos = vec2((k/d) * x, (k/d) * y);
    pos.y *= resolution.x / resolution.y;
    gl_Position = vec4(pos, 0.0, 1.0);
    gl_PointSize = 2.0;
  }`
  gl.shaderSource(vertexShaderId, vertexSource)
  gl.compileShader(vertexShaderId)

  gl.attachShader(programId, vertexShaderId)
  gl.deleteShader(vertexShaderId)

  const fragmentShaderId = gl.createShader(gl.FRAGMENT_SHADER)!
  let fragmentSource = `
  void main() {
    gl_FragColor = vec4(vec3(0.0), 1.0);
  }`
  gl.shaderSource(fragmentShaderId, fragmentSource)
  gl.compileShader(fragmentShaderId)
  gl.attachShader(programId, fragmentShaderId)
  gl.deleteShader(fragmentShaderId)

  gl.linkProgram(programId)
  gl.useProgram(programId)



  const bufferId = gl.createBuffer()
  const ptLoc = gl.getAttribLocation(programId, "pt")

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
  gl.bufferData(gl.ARRAY_BUFFER, thomasPoints, gl.STATIC_DRAW)

  gl.enableVertexAttribArray(ptLoc)
  gl.vertexAttribPointer(ptLoc, 3, gl.FLOAT, false, 0, 0)



  const resolutionLoc = gl.getUniformLocation(programId, "resolution")
  const timeLoc = gl.getUniformLocation(programId, "time")
  const a1Loc = gl.getUniformLocation(programId, "a1")
  const a2Loc = gl.getUniformLocation(programId, "a2")
  const kLoc = gl.getUniformLocation(programId, "k")



  return (
    thomasPoints: Float32Array,
    width: number,
    height: number,
    time: number,
    controls: Controls,
  ) => {
    gl.useProgram(programId)

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
    gl.bufferData(gl.ARRAY_BUFFER, thomasPoints, gl.STATIC_DRAW)
    gl.vertexAttribPointer(ptLoc, 3, gl.FLOAT, false, 0, 0)

    gl.uniform2f(resolutionLoc, width, height)
    gl.uniform1f(timeLoc, time)
    gl.uniform1f(a1Loc, controls.a1)
    gl.uniform1f(a2Loc, controls.a2)
    gl.uniform1f(kLoc, controls.k)

    gl.drawArrays(gl.POINTS, 0, thomasPoints.length / 3)
  }
}