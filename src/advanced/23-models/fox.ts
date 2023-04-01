import { camera, renderer, scene } from "init"
import { AmbientLight, AnimationClip, AnimationMixer, BufferGeometry, Clock, Color, DirectionalLight, Group, Mesh, MeshLambertMaterial, Object3D, PCFSoftShadowMap, PlaneGeometry, ShadowMaterial } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"



camera.position.set(-3, 1, 5)
scene.background = new Color(0x668844)
scene.position.y = -1
renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap

const clock = new Clock()



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
let updateFox = () => {}



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

    updateFox = () => fox.userData.mixer.update(clock.getDelta())
  },
)



const ground = new Mesh(
  new PlaneGeometry(5, 5),
  new ShadowMaterial({ opacity: 0.25, toneMapped: false }),
)
ground.receiveShadow = true
ground.rotation.x = -Math.PI / 2
scene.add(ground)



const ambientLight = new AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directLight = new DirectionalLight()
directLight.position.set(3, 5, -1)
directLight.castShadow = true
directLight.shadow.mapSize.set(1024, 1024)
scene.add(directLight)



export const play = () => {
  updateFox()
}