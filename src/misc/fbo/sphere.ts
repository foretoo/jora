import { controls } from "./controls"
import { AddEquation, AdditiveBlending, BufferAttribute, BufferGeometry, CustomBlending, MaxEquation, Mesh, MinEquation, MultiplyBlending, NormalBlending, OneMinusSrcAlphaFactor, OneMinusSrcColorFactor, Points, ShaderMaterial, SphereBufferGeometry, SrcAlphaFactor, SrcColorFactor, SubtractiveBlending, Vector3 } from "three"
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

  void main() {
    gl_PointSize = 1.2;
    float t = time * 0.15 + seed * 10.0;


    vec3 cpos = cnoise(position * scale + t) * 1.0;

    // float n = snoise(position + t) * 0.5 + 0.5;
    // vec3 pos = mix(position, cpos, 0.5);


    // float n = snoise(position + t) * 0.5 + 0.5;
    // vec3 spos = position * n;

    // vec3 pos = cnoise(cpos * 0.6 + t);
    // pos = mix(position, cpos, 1.0 - n * 0.2);


    gl_Position = projectionMatrix * modelViewMatrix * vec4(cpos, 1.0);



    // float uCurlFreq = 0.7;
    // vec3 pos = position;
    // vec3 curlPos = position;
    // pos = cnoise(pos * uCurlFreq + t);
    // curlPos =  cnoise(curlPos * uCurlFreq + t);
    // curlPos += cnoise(curlPos * uCurlFreq * 2.0) * 0.5;
    // curlPos += cnoise(curlPos * uCurlFreq * 4.0) * 0.25;
    // curlPos += cnoise(curlPos * uCurlFreq * 8.0) * 0.125;
    // curlPos += cnoise(pos * uCurlFreq * 16.0) * 0.0625;

    // gl_Position = projectionMatrix * modelViewMatrix * vec4(mix(pos, curlPos, snoise(pos + t)), 1.0);
  }`
    .replace("#include cnoise;", cnoise),

  fragmentShader: `
  void main() {
    gl_FragColor = vec4(vec3(0.0), 1.0);
  }`,

  transparent: true,
  blending: NormalBlending,
  // blending: CustomBlending,
  // blendEquation: AddEquation,
  // blendSrc: SrcAlphaFactor,
  // blendDst:OneMinusSrcAlphaFactor,
  // depthWrite: true,
  // depthTest: true
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
  return (t: number) => {
    material.uniforms.time.value = t
  }
}