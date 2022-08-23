export const  createScreenProgram = (
  gl: WebGLRenderingContext,
  screenTriangle: Float32Array,
) => {
  const programId = gl.createProgram()!

  const vertexShaderId = gl.createShader(gl.VERTEX_SHADER)!
  let vertexSource = `
  attribute vec2 pt;

  void main() {
    gl_Position = vec4(pt, 0.0, 1.0);
  }`
  gl.shaderSource(vertexShaderId, vertexSource)
  gl.compileShader(vertexShaderId)
  gl.attachShader(programId, vertexShaderId)
  gl.deleteShader(vertexShaderId)

  const fragmentShaderId = gl.createShader(gl.FRAGMENT_SHADER)!
  let fragmentSource = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 0.05);
  }`
  gl.shaderSource(fragmentShaderId, fragmentSource)
  gl.compileShader(fragmentShaderId)
  gl.attachShader(programId, fragmentShaderId)
  gl.deleteShader(fragmentShaderId)

  gl.linkProgram(programId)
  gl.useProgram(programId)



  const bufferId = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
  gl.bufferData(gl.ARRAY_BUFFER, screenTriangle, gl.STATIC_DRAW)

  const loc = gl.getAttribLocation(programId, "pt")
  gl.enableVertexAttribArray(loc)



  return () => {
    gl.useProgram(programId)

    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }
}