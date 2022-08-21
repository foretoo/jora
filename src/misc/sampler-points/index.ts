import { BufferAttribute, BufferGeometry, DodecahedronBufferGeometry, Mesh, Points, ShaderMaterial, Vector2, Vector3 } from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js"

import { camera, scene, orbit, renderer } from "../../init"
import vertexShader from "./vertex.glsl"
import fragmentShader from "./fragment.glsl"



orbit.enableDamping = true

// ------------------------ //
// Geometry sampler

const dodecahedron = new DodecahedronBufferGeometry(1, 0)
dodecahedron.rotateX(Math.random() * Math.PI)
dodecahedron.rotateY(Math.random() * Math.PI)
dodecahedron.rotateZ(Math.random() * Math.PI)

const sampler = new MeshSurfaceSampler(new Mesh(dodecahedron))
  .setWeightAttribute(null)
  .build()



// ------------------------ //
// Points position

const count = 55000
const position = new Float32Array(count * 3)
const pos = new Vector3()

for (let i = 0; i < count; i++) {
  sampler.sample(pos)
  position[i * 3 + 0] = pos.x
  position[i * 3 + 1] = pos.y
  position[i * 3 + 2] = pos.z
}



// ------------------------ //
// Points mesh

const points_geometry = new BufferGeometry()
points_geometry.setAttribute("position", new BufferAttribute(position, 3))

const points_material = new ShaderMaterial({
  uniforms: { time: { value: 0.0 }},
  vertexShader,
  fragmentShader,
})

const points = new Points(points_geometry, points_material)
scene.add(points)



// ------------------------ //
// Bloom effect

const renderScene = new RenderPass(scene, camera)

const bloomPass = new UnrealBloomPass(
  { x: innerWidth, y: innerHeight } as Vector2,
  1.77, // strength
  1.13, // radius
  0.99, // threshold
)

const composer = new EffectComposer(renderer)
composer.addPass(renderScene)
composer.addPass(bloomPass)



// ------------------------ //
// Helpers

onresize = () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  composer.setSize(innerWidth, innerHeight)
  renderer.setSize(innerWidth, innerHeight)
}



// ------------------------ //
// Player

export const play = () => {
  points.rotateY(0.002)
  points_material.uniforms.time.value += 0.05
  
  orbit.update()
  composer.render()
  requestAnimationFrame(play)
}