import "./style.css"
import { BufferAttribute, Camera, DoubleSide, Group, InstancedMesh, Mesh, MeshBasicMaterial, MeshMatcapMaterial, Object3D, SphereBufferGeometry, TetrahedronBufferGeometry, Texture, TextureLoader, TorusBufferGeometry, TorusKnotBufferGeometry, Vector2 } from "three"
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js"
import { scene, loop, camera, orbit } from "../../init"



//// SETUP

const main = document.querySelector("main")!

orbit.domElement = null!
orbit.object = new Object3D() as Camera

const cameraPivot = new Group()
cameraPivot.add(camera)
camera.position.z = 5
scene.add(cameraPivot)

let distanceY = -10
let distanceX = innerWidth / innerHeight
let pointerDamp = 0.062
let meshRotation = Math.PI / 4

const amount = 256
const gizmo = new Object3D()

const loader = new TextureLoader()

const wireframeMaterial = new MeshBasicMaterial({ wireframe: true })

const meshes = new Group()
scene.add(meshes)



//// TORUS

const torusCoreGeometry = new TorusBufferGeometry(0.5, 0.033, 18, 96)

const torusCore = new InstancedMesh(torusCoreGeometry, new MeshMatcapMaterial(), 16)

const a = Math.PI * 2 / torusCore.count
for (let i = 0; i < torusCore.count; i++) {
  const angle = i * a
  const x = 0.2 * Math.cos(angle)
  const z = 0.2 * Math.sin(angle)
  gizmo.position.set(x, 0, z)
  gizmo.rotation.set(0, 0, 0)
  gizmo.rotateY(-angle)
  gizmo.rotateX(Math.PI / 3)
  gizmo.updateMatrix()
  torusCore.setMatrixAt(i, gizmo.matrix)
}

loadTexture("mythril", torusCore.material)
torusCore.rotateY(Math.PI / 2)

const torusOrbitGeometry = new TorusBufferGeometry(0.75, 0.3, 3, 256)

{
  const n = torusOrbitGeometry.parameters.tubularSegments * 6
  const a = torusOrbitGeometry.index!.array as Float32Array
  const w = new Float32Array(a.length / 6)

  for (let i = 0; i < w.length; i += 3) {
    const i6 = i * 2
    w[i + 0] = a[i6 + 0]
    w[i + 1] = a[i6 + 1]
    w[i + 2] = a[(i6 + n) % a.length]
  }

  torusOrbitGeometry.setIndex(new BufferAttribute(w, 1))
}

const torusOrbit = new Mesh(torusOrbitGeometry, wireframeMaterial)
torusOrbit.scale.set(1.5, 1.5, 0.333)

const torus = new Group()
torus.add(torusCore, torusOrbit)
torus.position.set(distanceX, 0, 0)
torus.rotation.x = torus.rotation.y = -meshRotation
meshes.add(torus)



//// CROSS

const capsuleGeometry = new SphereBufferGeometry(0.667, 144, 2)
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
const crossCapsGroup = new Group()

crossCapsGroup.add(
  new Mesh(capGeometry, wireframeMaterial),
  new Mesh(capGeometry, wireframeMaterial),
)
crossCapsGroup.children[0].position.y = 0.75
crossCapsGroup.children[1].position.y = -0.75
crossCapsGroup.children[1].rotation.x = Math.PI

const crossCapsule = new Mesh(capsuleGeometry, new MeshMatcapMaterial())
crossCapsule.scale.y = 2
crossCapsule.material.flatShading = true
loadTexture("redstone", crossCapsule.material)

cross.add(crossCapsule, crossCapsGroup)
cross.position.set(-distanceX, distanceY, 0)

cross.children[1].rotation.z = Math.PI / 2
cross.rotation.z = cross.rotation.x = meshRotation
meshes.add(cross)



//// KNOT

const p = 3, q = 1

const knotNormGeometry = new TorusKnotBufferGeometry(1, 0.125, 256, 18, p, q)
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
const knotBody = new Mesh(knotNormGeometry, new MeshMatcapMaterial())
knotBody.material.side = DoubleSide
knotBody.material.flatShading = true
loadTexture("nanite", knotBody.material)

const knotFrame = new Mesh(knotWireGeometry, wireframeMaterial)
knot.add(knotBody, knotFrame)
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
  const y = -main.scrollTop / innerHeight
  meshes.position.y = y * distanceY
  meshes.rotation.y = y * Math.PI * 2
}

function loadTexture(
  name: string,
  material: MeshMatcapMaterial,
) {
  const load = () => loader.load(
    "https://raw.githubusercontent.com/foretoo/jora/main/src/assets/" + name + ".png",
    (texture: Texture) => {
      material.matcap = texture
      material.needsUpdate = true
    },
    undefined,
    load
  )
  load()
}



//// LISTENERS

let currentSection: number | null = Math.round(main.scrollTop / innerHeight)
main.addEventListener("scroll", (e) => {
  e.preventDefault()
  setMeshesPosition()

  const newSection =
    (main.scrollTop / innerHeight <= 0.2) ? 0 :
    (main.scrollTop / innerHeight <= 1.2 &&
     main.scrollTop / innerHeight >= 0.8) ? 1 :
    (main.scrollTop / innerHeight >= 1.8) ? 2 :
    null
  
  if (newSection === null || currentSection === newSection) return
  currentSection = newSection

  if (currentSection === 0 && !torusTween.isPlaying()) {
    torusTween
    .to({ x: torusCore.rotation.x + Math.PI * 3 })
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
  setMeshesPosition()
})




//// TORUS ANIMATION

const torusTween = new TWEEN
.Tween(torusCore.rotation)
.duration(2000)
.easing(TWEEN.Easing.Cubic.InOut)
.onUpdate(({ x }) => {
  torusOrbit.rotation.y = x / 2
})

//// CROSS ANIMATION

const crossTween = {

  scale: new TWEEN
    .Tween({ v: 0 })
    .duration(500)
    .easing(TWEEN.Easing.Cubic.InOut)
    .yoyo(true)
    .repeatDelay(1000)
    .onUpdate(({ v }) => {
      const sv0 = 2 - v
      const sh0 = 1 - v * 0.5
      crossCapsule.scale.set(sh0, sv0, sh0)
      const s1 = 1 + v
      crossCapsGroup.scale.set(s1, s1, s1)
      crossCapsGroup.children[0].position.y =  0.75 - 0.75 * v
      crossCapsGroup.children[1].position.y = -0.75 + 0.75 * v
    }),

  rv: 0,
  rotation: new TWEEN
    .Tween({ v: 0 })
    .duration(1800)
    .easing(TWEEN.Easing.Cubic.InOut)
    .delay(100)
    .onUpdate(({ v }) => {
      const dr = (v - crossTween.rv) * Math.PI * 2
      crossCapsule.rotation.x += dr
      crossCapsGroup.rotation.y += dr
      crossTween.rv = v
    })
    .onComplete((tween) => tween.v = 0),

  start: () => {
    crossTween.scale.to({ v: 1 }).repeat(1).start()
    crossTween.rotation.to({ v: 1 }).start()
  },

  isPlaying: () => (
    crossTween.scale.isPlaying() ||
    crossTween.rotation.isPlaying()
  )
}

//// KNOT ANIMATION

const knotTween = new TWEEN
.Tween(knot.rotation)
.duration(2000)
.easing(TWEEN.Easing.Cubic.InOut)