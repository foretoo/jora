import { camera, orbit, renderer, scene } from "init"

import { BufferGeometry, Clock, Color, CubeCamera, CubeTextureLoader, EquirectangularReflectionMapping, Group, HalfFloatType, Mesh, MeshBasicMaterial, MeshStandardMaterial, Scene, TextureLoader, TorusGeometry, TorusKnotGeometry, Vector3, WebGLCubeRenderTarget } from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { GroundProjectedSkybox } from "three/examples/jsm/objects/GroundProjectedSkybox.js"
import GUI from "lil-gui"

// import nx from "local/textures/environmentMaps/2/nx.png"
// import ny from "local/textures/environmentMaps/2/ny.png"
// import nz from "local/textures/environmentMaps/2/nz.png"
// import px from "local/textures/environmentMaps/2/px.png"
// import py from "local/textures/environmentMaps/2/py.png"
// import pz from "local/textures/environmentMaps/2/pz.png"



//////// SETUP

const global = {
  envMapIntensity: 2,
  envMapBlurriness: 0,
  envMapHeight: 10,
  envMapRadius: 50,
}

camera.position.set(2, 2, 8)

scene.backgroundIntensity = global.envMapIntensity / 2
scene.backgroundBlurriness = global.envMapBlurriness

orbit.maxDistance = 15
orbit.minDistance = 3
orbit.maxPolarAngle = Math.PI * 0.53
orbit.target = new Vector3(0, 1, 0)



//////// MODEL

const gltfLoader = new GLTFLoader()

gltfLoader.load(
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/FlightHelmet/glTF/FlightHelmet.gltf",
  (gltf) => {
    const model = gltf.scene as Group & {
      children: Mesh<BufferGeometry, MeshStandardMaterial>
    }
    model.scale.setScalar(4)
    model.position.set(1, 0, 0)
    scene.add(model)

    setEnvIntensity(global.envMapIntensity)
  },
)

//////// KNOT

const knot = new Mesh(
  new TorusKnotGeometry(0.5, 0.2, 144, 32),
  new MeshStandardMaterial({ roughness: 0.1, metalness: 1 }),
)
knot.position.set(-1, 1, 0)
scene.add(knot)



//////// ENV

// const cubeLoader = new CubeTextureLoader()

// const envMap = cubeLoader.load([ px, nx, py, ny, pz, nz ])

// const rgbeLoader = new RGBELoader()

// let skybox: GroundProjectedSkybox

// rgbeLoader.load(
//   "/.local/textures/environmentMaps/2/2k.hdr",
//   // "/.local/textures/environmentMaps/mine-env1.hdr",
//   (map) => {
//     map.mapping = EquirectangularReflectionMapping

//     scene.environment = map
//     // scene.background = map

//     skybox = new GroundProjectedSkybox(map, {
//       height: global.envMapHeight,
//       radius: global.envMapRadius,
//     })
//     skybox.scale.setScalar(10)
//     scene.add(skybox)
//   },
// )

const textureLoader = new TextureLoader()

textureLoader.load(
  "/.local/textures/environmentMaps/blockadesLabsSkybox/interior_views_cozy_wood_cabin_with_cauldron_and_p.jpg",
  (map) => {
    map.mapping = EquirectangularReflectionMapping
    scene.background = map
    scene.backgroundIntensity = global.envMapIntensity / 2
  },
)

const lamp = new Mesh(
  new TorusGeometry(3, 0.1, 24, 96),
  new MeshBasicMaterial({ color: new Color(10, 10, 10) }),
)
lamp.position.y = 1
lamp.rotation.set(
  Math.random() * Math.PI,
  Math.random() * Math.PI,
  Math.random() * Math.PI,
)
scene.add(lamp)


const cubeTarget = new WebGLCubeRenderTarget(256, { type: HalfFloatType })
scene.environment = cubeTarget.texture

const cubeCamera = new CubeCamera(0.1, 100, cubeTarget)
lamp.layers.enable(1)
cubeCamera.layers.set(1)



//////// GUI

const gui = new GUI()

gui.add(global, "envMapIntensity").min(0).max(10).step(0.1).onChange(setEnvIntensity)
gui.add(global, "envMapBlurriness").min(0).max(1).step(0.01).onChange(setEnvBlurriness)
// gui.add(global, "envMapRadius").min(0).max(100).step(0.1).onChange(setSkyboxRadius)
// gui.add(global, "envMapHeight").min(0).max(20).step(0.01).onChange(setSkyboxHeight)



//////// HELPERS

function setEnvIntensity(v: number) {
  scene.traverse((obj) => {
    if (obj instanceof Mesh && obj.material instanceof MeshStandardMaterial) {
      obj.material.envMapIntensity = v
    }
  })
  scene.backgroundIntensity = v / 2
}

function setEnvBlurriness(v: number) {
  scene.backgroundBlurriness = v
}

// function setSkyboxRadius(v: number) {
//   skybox && (skybox.radius = v)
// }

// function setSkyboxHeight(v: number) {
//   skybox && (skybox.height = v)
// }



//////// RENDER

const clock = new Clock(true)

export const play = () => {
  const dt = clock.getDelta()
  lamp.rotateX(dt + Math.sin(clock.elapsedTime * 0.5)   * 0.01)
  lamp.rotateY(dt + Math.cos(clock.elapsedTime * 0.333) * 0.01)
  cubeCamera.update(renderer, scene)
}

