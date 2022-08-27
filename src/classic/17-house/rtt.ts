import { Mesh, NearestFilter, OrthographicCamera, PlaneBufferGeometry, Scene, ShaderMaterial, WebGLRenderer, WebGLRenderTarget } from "three";
import snoise2D from "./snoise2D.glsl"

const scene = new Scene()
const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
camera.position.z = 1

scene.add(
  new Mesh(
    new PlaneBufferGeometry(2, 2),
    new ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }`,
      fragmentShader: `
        varying vec2 vUv;
        const float PI = 3.14159265;

        #include snoise2D;

        void main() {
          float noise = snoise2D(vUv * 2.0 + ${Math.random() * 10}) * 0.5 + 0.5;
          noise *= noise * noise;
          float center = abs(sin(vUv.y * PI)) * abs(sin(vUv.x * PI)) * 0.96;
          float color = 1.0 - center - noise;
          gl_FragColor = vec4(vec3(color), 1.0);
        }`
        .replace("#include snoise2D;", snoise2D),
    })
  )
)

const size = 64

const offscreen = new WebGLRenderTarget(size, size, {
  magFilter: NearestFilter,
  minFilter: NearestFilter,
  depthBuffer: false,
})



export const getRTTData = (
  renderer: WebGLRenderer
) => {
  renderer.setRenderTarget(offscreen)
  renderer.render(scene, camera)
  renderer.setRenderTarget(null)

  const buffer = new Uint8Array(size * size * 4)
  renderer.readRenderTargetPixels(offscreen, 0, 0, size, size, buffer)
  const texture = offscreen.texture
  
  return { texture, buffer }
}