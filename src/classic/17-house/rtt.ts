import { Mesh, NearestFilter, OrthographicCamera, PlaneBufferGeometry, Scene, ShaderMaterial, WebGLRenderTarget } from "three"
import { renderer } from "../../init"
import snoise2D from "./snoise2D.glsl"

const scene = new Scene()
const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
camera.position.z = 1

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}`

const seed = Math.random() * 10
let getFragmentShader = (bw = false) => `
varying vec2 vUv;
const float PI = 3.14159265;

#include snoise2D;

void main() {
  float noise = snoise2D(vUv * 3.0 + ${seed}) * 0.5 + 0.5;
  noise *= noise * noise;
  float center = abs(sin(vUv.y * PI)) * abs(sin(vUv.x * PI));
  center *= center;
  float bottom = cos(vUv.y * PI * 0.5 + PI * 0.333);

  float value = 1.0 - center * 2.0 - bottom * 1.0 - noise * 1.6;
  value = clamp(value, 0.0, 1.0);
${bw ? "" : `
  float red = 0.7 + 0.3 * value;
  float blue = 0.3 + 0.7 * value;
  float green = 0.2 + 0.8 * smoothstep(0.0, 1.0, value);
`}
  vec3 color = vec3(${bw ? "value" : "red, green, blue"});
  gl_FragColor = vec4(color, 1.0);
}`
.replace("#include snoise2D;", snoise2D)

const plane = new Mesh(
  new PlaneBufferGeometry(2, 2),
  new ShaderMaterial({
    vertexShader,
    fragmentShader: getFragmentShader(),
  })
)

scene.add(plane)

const size = 256

const diffuseTarget = new WebGLRenderTarget(size, size, {
  magFilter: NearestFilter,
  minFilter: NearestFilter,
  depthBuffer: false,
})
const alphaTarget = new WebGLRenderTarget(size, size, {
  magFilter: NearestFilter,
  minFilter: NearestFilter,
  depthBuffer: false,
})



renderer.setRenderTarget(diffuseTarget)
renderer.render(scene, camera)

renderer.setRenderTarget(alphaTarget)
plane.material.fragmentShader = getFragmentShader(true)
plane.material.needsUpdate = true
renderer.render(scene, camera)

renderer.setRenderTarget(null)

const rttBuffer = new Uint8Array(size * size * 4)
renderer.readRenderTargetPixels(alphaTarget, 0, 0, size, size, rttBuffer)
const rttColor = diffuseTarget.texture
const rttAlpha = alphaTarget.texture

export { rttColor, rttAlpha, rttBuffer }