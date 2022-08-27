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
          float noise = snoise2D(vUv * 2.0) * 0.5 + 0.5;
          noise *= noise;
          float center = abs(sin(vUv.y * PI)) * abs(sin(vUv.x * PI));
          float color = 1.0 - center - noise;
          gl_FragColor = vec4(vec3(color), 1.0);
        }`
        .replace("#include snoise2D;", snoise2D),
    })
  )
)

const w = 256

const texture = new WebGLRenderTarget(w, w, {
  magFilter: NearestFilter,
  minFilter: NearestFilter,
  depthBuffer: false,
})



export const getTexture = (
  renderer: WebGLRenderer
) => {
  renderer.setRenderTarget(texture)
  renderer.render(scene, camera)
  renderer.setRenderTarget(null)
  return texture.texture
}