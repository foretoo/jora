import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, PerspectiveCamera, Points, RawShaderMaterial, Scene, TextureLoader, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js"



// Setup

const gui = new GUI()

const scene = new Scene()

const camera = new PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100)
camera.position.set(0, 3, 2)

const canvas = document.querySelector("canvas")!

const renderer = new WebGLRenderer({ canvas })
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const orbit = new OrbitControls(camera, canvas)

const textureLoader = new TextureLoader()
const alphaMap = textureLoader.load("../../../public/textures/particles/8.png")



// Branch stars

const color = {
  inn: "#f40",
  out: "#a7f",
}
const ci = new Color(color.inn)
const co = new Color(color.out)

const galaxyMaterial = new RawShaderMaterial({

  uniforms: {
    uSize: { value: 2 },
    uBranches: { value: 2 },
    uRadius: { value: 1 },
    uSpin: { value: Math.round(Math.PI * 2 * 100) / 100 },
    uRandomness: { value: 0.38 },
    uAlphaMap: { value: alphaMap },
    uColorInn: { value: [ ci.r, ci.g, ci.b ] },
    uColorOut: { value: [ co.r, co.g, co.b ] },
  },

  vertexShader:
`
precision highp float;

attribute vec3 position;
attribute float size;
attribute vec3 seed;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float uSize;
uniform float uBranches;
uniform float uRadius;
uniform float uSpin;
uniform float uRandomness;

varying float vDistance;

#define PI  3.14159265359
#define PI2 6.28318530718

#include rough3D



void main() {

  vec3 p = position;
  float st = sqrt(p.x);
  float qt = p.x * p.x;
  float mt = mix(st, qt, p.x);

  float branchOffset = (PI2 / uBranches) * floor(seed.x * uBranches);
  float angle = qt * uSpin * (2.0 - sqrt(sqrt(1.0 - qt * qt)));
  vec3 temp = p;
  p.x = position.x * cos(angle + branchOffset) * uRadius;
  p.z = position.x * sin(angle + branchOffset) * uRadius;

  p += rough3D(seed) * random(seed.zx) * uRandomness * mt;
  p.y *= 0.333 + qt * 0.667;

  vDistance = mt;



  vec4 mvp = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvp;
  gl_PointSize = (10.0 * size * uSize) / -mvp.z;
}
`,

  fragmentShader:
`
precision highp float;

uniform vec3 uColorInn;
uniform vec3 uColorOut;
uniform sampler2D uAlphaMap;

varying float vDistance;

#define PI  3.14159265359



void main() {
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
  float a = texture2D(uAlphaMap, uv).g;
  if (a < 0.1) discard;

  vec3 color = mix(uColorInn, uColorOut, vDistance);
  float c = step(0.99, (sin(gl_PointCoord.x * PI) + sin(gl_PointCoord.y * PI)) * 0.5);
  color = max(color, vec3(c));

  gl_FragColor = vec4(color, a);
}
`,

  transparent: true,
  depthTest: false,
  depthWrite: false,
  blending: AdditiveBlending,
})

const coreMaterial = new RawShaderMaterial({

  uniforms: {
    uSize: { value: 2 },
    uRadius: { value: 1 },
    uAlphaMap: { value: alphaMap },
  },

  vertexShader:
`
precision highp float;

attribute vec3 position;
attribute vec3 seed;
attribute float size;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

uniform float uSize;
uniform float uRadius;

#define PI  3.14159265359
#define PI2 6.28318530718

#include rough3D

const float r = 13.0;



void main() {

  float q = random(seed.zx);
  for (int i = 0; i < 3; i++) q *= q;

  vec3 p = rough3D(seed) * q * vec3(2.1, 1.3, 2.1) * r;
  float l = length(p) / (2.1 * r);
  p = l < 0.001 ? (p / l) * uRadius : p;

  vec4 mvp = modelViewMatrix * vec4(p * uRadius, 1.0);
  gl_Position = projectionMatrix * mvp;
  
  gl_PointSize = (r * size * uSize) / -mvp.z;
}
`,

  fragmentShader:
`
precision highp float;

uniform sampler2D uAlphaMap;

#define PI 3.14159265359

void main() {
  vec2 uv = vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y);
  float a = texture2D(uAlphaMap, uv).g;
  if (a < 0.1) discard;

  float c = step(0.99, (sin(gl_PointCoord.x * PI) + sin(gl_PointCoord.y * PI)) * 0.5);

  gl_FragColor = vec4(a);
}
`,

  transparent: true,
  depthTest: false,
  depthWrite: false,
  blending: AdditiveBlending,
})



// Geometry

const count = 128 ** 2

const galaxyPositions = new Float32Array(count * 3)
const galaxySeeds = new Float32Array(count * 3)
const galaxySizes = new Float32Array(count)

for (let i = 0; i < count; i++) {
  galaxyPositions[i * 3] = i / count
  galaxySeeds[i * 3 + 0] = Math.random()
  galaxySeeds[i * 3 + 1] = Math.random()
  galaxySeeds[i * 3 + 2] = Math.random()
  galaxySizes[i] = Math.random() * 2 + 0.5
}

const galaxyGeometry = new BufferGeometry()
galaxyGeometry.setAttribute("position", new BufferAttribute(galaxyPositions, 3))
galaxyGeometry.setAttribute("size", new BufferAttribute(galaxySizes, 1))
galaxyGeometry.setAttribute("seed", new BufferAttribute(galaxySeeds, 3))



const corePositions = new Float32Array(count * 3 / 2)
const coreSeeds = new Float32Array(count * 3 / 2)
const coreSizes = new Float32Array(count / 2)

for (let i = 0; i < count / 2; i++) {
  coreSeeds[i * 3 + 0] = Math.random()
  coreSeeds[i * 3 + 1] = Math.random()
  coreSeeds[i * 3 + 2] = Math.random()
  coreSizes[i] = Math.random() * 2 + 0.5
}

const coreGeometry = new BufferGeometry()
coreGeometry.setAttribute("position", new BufferAttribute(corePositions, 3))
coreGeometry.setAttribute("seed", new BufferAttribute(coreSeeds, 3))
coreGeometry.setAttribute("size", new BufferAttribute(coreSizes, 1))



// Meshes

const branchStars = new Points(galaxyGeometry, galaxyMaterial)
branchStars.material.onBeforeCompile = (shader) => {
  shader.vertexShader = shader.vertexShader
  .replace("#include rough3D", shaderUtilRough3D)
}
scene.add(branchStars)

const coreStars = new Points(coreGeometry, coreMaterial)
coreStars.material.onBeforeCompile = (shader) => {
  shader.vertexShader = shader.vertexShader
  .replace("#include rough3D", shaderUtilRough3D)
}
scene.add(coreStars)



// GUI

gui.add(galaxyMaterial.uniforms.uSize, "value", 0.1, 4, 0.01).name("size")
.onChange((size: number) => coreMaterial.uniforms.uSize.value = size)
gui.add(galaxyMaterial.uniforms.uBranches, "value", 1, 5, 1).name("branches")
gui.add(galaxyMaterial.uniforms.uRadius, "value", 0.01, 5, 0.01).name("radius")
.onChange((radius: number) => coreMaterial.uniforms.uRadius.value = radius)
gui.add(galaxyMaterial.uniforms.uSpin, "value", -Math.PI * 4, Math.PI * 4, 0.01).name("spin")
gui.add(galaxyMaterial.uniforms.uRandomness, "value", 0, 1, 0.01).name("randomness")
gui.addColor(color, "inn").name("inn color")
.onChange((hex: string) => {
  const { r, g, b } = new Color(hex)
  galaxyMaterial.uniforms.uColorInn.value = [ r, g, b ]
})
gui.addColor(color, "out").name("out color")
.onChange((hex: string) => {
  const { r, g, b } = new Color(hex)
  galaxyMaterial.uniforms.uColorOut.value = [ r, g, b ]
})



// Looper

export const play = () => {
  orbit.update()
  renderer.render(scene, camera)
  requestAnimationFrame(play)
}



// Helpers

addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)  
})

const shaderUtilRough3D =
`
float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec3 rough3D (vec3 point) {
  float u = random(point.xy);
  float v = random(point.yz);
  float theta = u * 6.28318530718;
  float phi = acos(2.0 * v - 1.0);

  float sinTheta = sin(theta);
  float cosTheta = cos(theta);
  float sinPhi = sin(phi);
  float cosPhi = cos(phi);

  float x = sinPhi * cosTheta;
  float y = sinPhi * sinTheta;
  float z = cosPhi;

  return vec3(x, y, z);
}
`