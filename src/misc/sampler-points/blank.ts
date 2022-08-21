import { BufferAttribute, BufferGeometry, DodecahedronBufferGeometry, Mesh, Points, ShaderMaterial, Vector3 } from "three"
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js"
import { scene } from "../../init"
import vertexShader from "./vertex.glsl"
import fragmentShader from "./fragment.glsl"



const dodecahedron = new DodecahedronBufferGeometry(1, 0)
dodecahedron.rotateX(Math.random() * Math.PI)
dodecahedron.rotateY(Math.random() * Math.PI)
dodecahedron.rotateZ(Math.random() * Math.PI)

const sampler = new MeshSurfaceSampler(new Mesh(dodecahedron))
  .setWeightAttribute(null)
  .build()



const count = 10000
const pospoints = new Float32Array(count * 3)

const pos = new Vector3()
for ( let i = 0; i < count; i++ ) {
  sampler.sample( pos )
  pospoints[i * 3 + 0] = pos.x
  pospoints[i * 3 + 1] = pos.y
  pospoints[i * 3 + 2] = pos.z
}



const geompoints = new BufferGeometry()
geompoints.setAttribute("position", new BufferAttribute(pospoints, 3))
const shadmatpoints = new ShaderMaterial({
  uniforms: { time: { value: 0.0 }},
  vertexShader,
  fragmentShader,
})

const points = new Points(geompoints, shadmatpoints)
scene.add(points)



export const play = () => {
  shadmatpoints.uniforms.time.value += 0.05
}