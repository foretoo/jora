import { BufferAttribute, Camera, CapsuleBufferGeometry, DoubleSide, Group, InstancedMesh, Mesh, MeshBasicMaterial, MeshNormalMaterial, Object3D, SphereBufferGeometry, StreamDrawUsage, TetrahedronBufferGeometry, TorusBufferGeometry, TorusKnotBufferGeometry, Vector2 } from "three"
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js"
import { scene, loop, camera, orbit } from "../../init"



//// SETUP

let distanceY = -10
let distanceX = innerWidth / innerHeight
let pointerDamp = 0.062
let meshRotation = Math.PI / 4

orbit.domElement = null!
orbit.object = new Object3D() as Camera

const amount = 256
const gizmo = new Object3D()

const cameraPivot = new Group()
cameraPivot.add(camera)
camera.position.z = 5
scene.add(cameraPivot)

const wireframeMaterial = new MeshBasicMaterial({ wireframe: true })
const normalMaterial = new MeshNormalMaterial()

const meshes = new Group()
scene.add(meshes)



//// TORUS

const torusNormGeometry = new TorusBufferGeometry(0.4, 0.2, 32, 128)
const torusWireGeometry = new TorusBufferGeometry(0.6, 0.3, 3, 256)

{
  const n = torusWireGeometry.parameters.tubularSegments * 6
  const a = torusWireGeometry.index!.array as Float32Array
  const w = new Float32Array(a.length / 6)

  for (let i = 0; i < w.length; i += 3) {
    const i6 = i * 2
    w[i + 0] = a[i6 + 0]
    w[i + 1] = a[i6 + 1]
    w[i + 2] = a[(i6 + n) % a.length]
  }

  torusWireGeometry.setIndex(new BufferAttribute(w, 1))
}

const torus = new Group()
torus.add(
  new Mesh(torusWireGeometry, wireframeMaterial),
  new Mesh(torusNormGeometry, normalMaterial)
)
torus.position.set(distanceX, 0, 0)

torus.children[1].rotateX(Math.PI / 2)
torus.children[0].scale.set(1.5, 1.5, 0.333)
torus.rotation.x = torus.rotation.y = -meshRotation
meshes.add(torus)



//// CROSS

const capsuleGeometry = new CapsuleBufferGeometry(0.5, 1.5, 6, 36)
const capGeometry = new SphereBufferGeometry(0.62, 3, 48, 0,Math.PI * 2, 0,Math.PI / 2)

{
  let a = capGeometry.index!.array as Float32Array
  a = a.subarray(9, a.length)

  const w = new Float32Array(a.length / 6 + 3)

  for (let i = 0; i < w.length; i += 3) {
    const i6 = i * 6
    w[i + 0] = a[i6 + 0]
    w[i + 1] = a[i6 + 3]
    w[i + 2] = a[i6 + 6]
  }

  w[w.length - 3] = a[a.length - 1]
  w[w.length - 2] = a[a.length - 2]
  w[w.length - 1] = a[a.length - 8]

  capGeometry.setIndex(new BufferAttribute(w, 1))
}

const cross = new Group()
const crossCaps = new Group()
crossCaps.add(
  new Mesh(capGeometry, wireframeMaterial),
  new Mesh(capGeometry, wireframeMaterial),
)
cross.add(
  new Mesh(capsuleGeometry, normalMaterial),
  crossCaps,
)
cross.position.set(-distanceX, distanceY, 0)
crossCaps.children[0].position.y = 0.75
crossCaps.children[1].position.y = -0.75
crossCaps.children[1].rotation.x = Math.PI

cross.children[1].rotation.z = Math.PI / 2
cross.rotation.z = cross.rotation.x = meshRotation
meshes.add(cross)



//// KNOT

const p = 3, q = 1

const knotNormGeometry = new TorusKnotBufferGeometry(1, 0.125, 256, 24, p, q)
const knotWireGeometry = new TorusKnotBufferGeometry(1, 0.1875, 768, 3, p, q)

{
  let a = knotNormGeometry.index!.array as Float32Array
  knotNormGeometry.setIndex(new BufferAttribute(a.subarray(a.length / 2, a.length), 1))

  a = knotWireGeometry.index!.array as Float32Array
  const w = new Float32Array(a.length / 6)
  for (let i = 0; i < w.length; i += 3) {
    const i6 = i * 6
    w[i + 0] = a[i6 + 0]
    w[i + 1] = a[i6 + 6]
    w[i + 2] = a[i6 + 12]
  }
  knotWireGeometry.setIndex(new BufferAttribute(w.subarray(0, w.length / 2), 1))
}

const knot = new Group()
knot.add(
  new Mesh(knotNormGeometry, normalMaterial),
  new Mesh(knotWireGeometry, wireframeMaterial),
);
((knot.children[0] as Mesh).material as MeshNormalMaterial).side = DoubleSide
knot.position.set(distanceX, distanceY * 2, 0)

knot.rotation.x = knot.rotation.z = meshRotation
meshes.add(knot)

setMeshesPosition()



//// PARTICLES

const particleGeometry = new TetrahedronBufferGeometry(0.01)
const particles = new InstancedMesh(particleGeometry, wireframeMaterial, amount)

{
  const d = camera.position.distanceTo(scene.position)
  const f = (camera.fov * Math.PI) / 360
  const v = 2 * Math.tan(f) * d

  for (let i = 0; i < amount; i++) {
    gizmo.position.x = (Math.random() - 0.5) * v * camera.aspect
    gizmo.position.y = (1 - Math.random() * (meshes.children.length + 3)) * v
    gizmo.position.z = (Math.random() * 2 - 1) * v * camera.aspect
    gizmo.rotation.set(Math.random(), Math.random(), Math.random())
    let s = 1 + Math.random() * 4
    s = s > 4.8 ? s * s : s
    gizmo.scale.set(s, s, s)
    gizmo.updateMatrix()
    particles.setMatrixAt(i, gizmo.matrix)
  }
}

meshes.add(particles)




//// POINTER

const pointer = new Vector2()
const pointerTarget = new Vector2()

addEventListener("pointermove", (e) => {
  pointer.x =  e.clientX / innerWidth  * 2 - 1
  pointer.y = -e.clientY / innerHeight * 2 + 1
  pointer.multiplyScalar(0.382)
})



//// LOOPER

let t = 0, dt = 0
loop((time) => {
  const dx = (pointer.x - pointerTarget.x) * pointerDamp
  const dy = (pointer.y - pointerTarget.y) * pointerDamp
  pointerTarget.x += dx
  pointerTarget.y += dy

  cameraPivot.rotation.y += dx
  cameraPivot.rotation.x += dy

  cameraPivot.position.x += dx
  cameraPivot.position.y += dy

  time *= 0.0001
  dt = time - t
  t = time

  torus.rotation.x -= dt
  torus.rotation.z += dt / 2

  cross.rotation.y -= dt
  cross.rotation.z += dt / 2

  knot.rotation.x -= dt
  knot.rotation.y += dt / 2

  particles.rotation.y -= dt / 4

  TWEEN.update()
})



//// UTILS

function setMeshesPosition() {
  const y = -scrollY / innerHeight
  meshes.position.y = y * distanceY
  meshes.rotation.y = y * Math.PI * 2
}

let currentSection = Math.round(scrollY / innerHeight)
addEventListener("scroll", () => {
  setMeshesPosition()

  const newSection = Math.round(scrollY / innerHeight)
  if (currentSection === newSection) return
  currentSection = newSection



  if (currentSection === 0 && !torusTween.isPlaying()) {
    torusTween
    .to({ y: torus.children[1].rotation.y + Math.PI * 3 })
    .start()
  }
  else if (currentSection === 1 && !crossTween.isPlaying()) {
    crossTween.start()
  }
  else if (currentSection === 2 && !knotTween.isPlaying()) {
    knotTween
    .to({ z: knot.rotation.z + Math.PI * 4 })
    .start()
  }
})

addEventListener("resize", () => {
  distanceX = innerWidth / innerHeight
  torus.position.x = distanceX
  cross.position.x = distanceX
  knot.position.x = distanceX
})

//// TORUS ANIMATION

const torusTween = new TWEEN
.Tween(torus.children[1].rotation)
.duration(2000)
.easing(TWEEN.Easing.Cubic.InOut)
.onUpdate(({ y }) => {
  torus.children[0].rotation.y = y / 2
})

//// CROSS ANIMATION

const crossTween = {
  capsuleScale: new TWEEN
  .Tween(cross.children[0].scale)
  .duration(500)
  .easing(TWEEN.Easing.Cubic.InOut)
  .yoyo(true)
  .repeatDelay(1000),

  capScale: new TWEEN
  .Tween(cross.children[1].scale)
  .duration(500)
  .easing(TWEEN.Easing.Cubic.InOut)
  .yoyo(true)
  .repeatDelay(1000),

  capsuleRotation: new TWEEN
  .Tween(cross.children[0].rotation)
  .duration(1500)
  .easing(TWEEN.Easing.Cubic.InOut)
  .delay(250),

  capRotation: new TWEEN
  .Tween(cross.children[1].rotation)
  .duration(1500)
  .easing(TWEEN.Easing.Cubic.InOut)
  .delay(250),

  start: () => {
    crossTween.capsuleScale
      .to({ x: 0.75, y: 0.75, z: 0.75 })
      .repeat(1)
      .start()
    crossTween.capScale
      .to({ x: 1.333, y: 1.333, z: 1.333 })
      .repeat(1)
      .start()
    crossTween.capsuleRotation
      .to({ x: cross.children[0].rotation.x + Math.PI * 2 })
      .start()
    crossTween.capRotation
      .to({ y: cross.children[1].rotation.y + Math.PI * 2 })
      .start()
  },

  isPlaying: () => {
    return (
      crossTween.capsuleScale.isPlaying() ||
      crossTween.capScale.isPlaying() ||
      crossTween.capsuleRotation.isPlaying() ||
      crossTween.capRotation.isPlaying()
    )
  }
}

//// KNOT ANIMATION

const knotTween = new TWEEN
.Tween(knot.rotation)
.duration(2000)
.easing(TWEEN.Easing.Cubic.InOut)