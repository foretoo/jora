import { controls } from "./controls"
import { AddEquation, AdditiveBlending, BufferAttribute, BufferGeometry, CustomBlending, DstColorFactor, MaxEquation, Mesh, MinEquation, MultiplyBlending, MultiplyOperation, NormalBlending, OneMinusSrcAlphaFactor, OneMinusSrcColorFactor, Points, ShaderMaterial, SphereBufferGeometry, SrcAlphaFactor, SrcColorFactor, SubtractEquation, SubtractiveBlending, Vector3 } from "three"
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js"
import { scene } from "./init"

import cnoise from "./shaders/cnoise.glsl"

const amount = 128 ** 2

const sphereSurface = new SphereBufferGeometry(1, 72, 48)
sphereSurface.scale(1, 1, 1)
const sampler = new MeshSurfaceSampler(new Mesh(sphereSurface))
.setWeightAttribute(null)
.build()

const position = new Float32Array(amount * 3)
const p = new Vector3()

for (let i = 0; i < amount; i++) {
  sampler.sample(p)
  position[i * 3 + 0] = p.x
  position[i * 3 + 1] = p.y
  position[i * 3 + 2] = p.z
}



const geometry = new BufferGeometry()
geometry.setAttribute("position", new BufferAttribute(position, 3))



const getSphereMaterial = (
  seed: number,
  scale: number,
) => new ShaderMaterial({
  uniforms: {
    seed: { value: seed },
    scale: { value: scale },
    time: { value: 0 },
    noiseScale: { value: 1 / controls.noiseScale },
    noiseStrength: { value: controls.noiseStrength },
    roughness: { value: controls.roughness }
  },

  vertexShader: `
  uniform float seed;
  uniform float scale;
  uniform float time;
  uniform float noiseScale;
  uniform float noiseStrength;
  uniform float roughness;

  #include cnoise;

  const float PI = 3.14159265;

  void main() {
    float t = time * 0.15 + seed * 10.0;


    vec3 cpos = cnoise(position * scale + t) * 1.0;

    float n = snoise(position + t) * 0.5 + 0.5;
    vec3 pos = mix(position, cpos, 1.0 - n * 0.1);

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);

    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = cos(abs(mvPos.z * PI / 2.0)) * 2.0;
  }`
    .replace("#include cnoise;", cnoise),

  fragmentShader: `
  void main() {
    gl_FragColor = vec4(vec3(0.0), 0.4);
  }`,

  transparent: true,
})

export const sphere = new Points(geometry, getSphereMaterial(0, 1))

export const initSphere = (
  seed: number,
  scale: number,
) => {
  const material = getSphereMaterial(seed, scale)
  controls.listen.noiseScale.push((v) => material.uniforms.noiseScale.value = v)
  controls.listen.noiseStrength.push((v) => material.uniforms.noiseStrength.value = v)
  const sphere = new Points(geometry, material)
  scene.add(sphere)

  return (
    t: number,
  ) => {
    material.uniforms.time.value = t
  }
}