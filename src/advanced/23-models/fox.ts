import { camera, orbit, renderer, scene } from "init"
import { AmbientLight, AnimationClip, AnimationMixer, BoxGeometry, BufferGeometry, CameraHelper, Clock, Color, DirectionalLight, Fog, Group, InstancedMesh, Mesh, MeshLambertMaterial, Object3D, PCFSoftShadowMap, PlaneGeometry, ShadowMaterial } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { gRandom } from "utils"



const [ SX, SY, SZ, PX, PY, PZ ] = [ 0, 5, 10, 12, 13, 14 ]
const FAR = 20

camera.position.set(3, 1, 5)

scene.background = new Color(0x668844)
scene.position.y = -1
scene.fog = new Fog(scene.background, FAR / 2, FAR)

renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap
renderer.physicallyCorrectLights = true

// orbit.maxAzimuthAngle = Math.PI / 3 * 2
// orbit.minAzimuthAngle = -Math.PI / 3 * 2
orbit.maxPolarAngle = Math.PI / 2
orbit.maxDistance = 10
orbit.minDistance = 3
orbit.enablePan = false

const clock = new Clock()
let delta = 0



type IAnimationName = "survey" | "walk" | "run"

interface IFox extends Group {
  name: "foxGroup"
  children: [
    Object3D,
    Mesh<BufferGeometry, MeshLambertMaterial>
  ]
  userData: {
    mixer: AnimationMixer,
    animations: Record<IAnimationName, AnimationClip>
  }
}

let fox: IFox
let updateFox: (delta: number) => void = () => {}



const gltfLoader = new GLTFLoader()
const path = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Fox/glTF/Fox.gltf"

gltfLoader.load(
  path,
  (gltf) => {
    fox = gltf.scene as IFox
    fox.name = "foxGroup"

    const foxRoot = fox.children[0]
    foxRoot.scale.multiplyScalar(0.02)

    const foxMesh = fox.children[1]
    foxMesh.geometry.computeVertexNormals()
    foxMesh.material = new MeshLambertMaterial({ map: foxMesh.material.map })
    foxMesh.castShadow = true

    fox.userData.mixer = new AnimationMixer(fox)
    fox.userData.animations = {} as IFox["userData"]["animations"]
    gltf.animations.forEach((clip) => {
      const name = clip.name.toLowerCase() as IAnimationName
      fox.userData.animations[name] = clip
    })
    fox.userData.mixer.clipAction(fox.userData.animations.walk).play()

    scene.add(fox)

    updateFox = (delta: number) => fox.userData.mixer.update(delta)
  },
)



const groundShadow = new Mesh(
  new PlaneGeometry(FAR, FAR * 2),
  new ShadowMaterial({ opacity: 0.25, toneMapped: false }),
)
groundShadow.receiveShadow = true
groundShadow.rotation.x = -Math.PI / 2
scene.add(groundShadow)



const gizmo = new Object3D()
const boxes = new InstancedMesh(
  new BoxGeometry(0.5, 0.5, 0.5),
  new MeshLambertMaterial({ color: scene.background }),
  1000,
)

for (let i = 0; i < boxes.count; i++) {
  gizmo.matrix.elements[PZ] = (Math.random() - 0.5) * FAR * 3
  setMatrix()

  boxes.setMatrixAt(i, gizmo.matrix)
}

gizmo.matrix.identity()
boxes.instanceMatrix.needsUpdate = true
boxes.receiveShadow = true
boxes.castShadow = true
scene.add(boxes)



const ambientLight = new AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const directLight = new DirectionalLight(0xffffff, 3)
directLight.position.set(7, 15, 5)
directLight.castShadow = true
directLight.shadow.camera.left = -FAR
directLight.shadow.camera.right = FAR
directLight.shadow.camera.top = FAR
directLight.shadow.camera.bottom = -FAR
directLight.shadow.camera.far = FAR * 1.5
directLight.shadow.mapSize.set(2048, 2048)
scene.add(directLight)

// const directLightShadowCamera = new CameraHelper(directLight.shadow.camera)
// scene.add(directLightShadowCamera)



export const play = () => {
  delta = clock.getDelta()
  updateFox(delta)

  for (let i = 0; i < boxes.count; i++) {
    boxes.getMatrixAt(i, gizmo.matrix)
    gizmo.matrix.elements[PZ] -= delta * 2
    if (gizmo.matrix.elements[PZ] < -FAR * 1.5) {
      gizmo.matrix.elements[PZ] = FAR * 1.5
      setMatrix()
    }
    boxes.setMatrixAt(i, gizmo.matrix)
  }
  boxes.instanceMatrix.needsUpdate = true
}



function setMatrix() {
  const px = gRandom(-FAR * 2, FAR * 2)
  const apx = Math.abs(px) / 2

  gizmo.matrix.elements[SX] = Math.random() * (apx + Math.random())
  gizmo.matrix.elements[SY] = 0.02 + Math.random() * 0.25 * apx ** 2
  gizmo.matrix.elements[SZ] = Math.random() * (apx + Math.random())

  gizmo.matrix.elements[PY] = gizmo.matrix.elements[SY] * 0.25
  gizmo.matrix.elements[PX] = px
}