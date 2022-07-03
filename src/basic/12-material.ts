import { Mesh, BoxGeometry, MeshBasicMaterial, Texture, TextureLoader, LoadingManager, DoubleSide, SphereGeometry, PlaneGeometry, TorusGeometry, MeshNormalMaterial, MeshMatcapMaterial, AmbientLight, PointLight, MeshLambertMaterial, MeshPhongMaterial, Color, MeshToonMaterial, NearestFilter, MeshStandardMaterial, BufferAttribute, CubeTextureLoader } from "three"
import { scene, camera } from "../init"
import * as dat from "dat.gui"



camera.translateY(-1)
camera.updateMatrix()
const vel = 0.01

const textureLoader = new TextureLoader()

const colorTexture = textureLoader.load("textures/door/color.jpg")
const alphaTexture = textureLoader.load("textures/door/alpha.jpg")
const heightTexture = textureLoader.load("textures/door/height.jpg")
const normalTexture = textureLoader.load("textures/door/normal.jpg")
const metalnessTexture = textureLoader.load("textures/door/metalness.jpg")
const roughnessTexture = textureLoader.load("textures/door/roughness.jpg")
const ambientOcclusionTexture = textureLoader.load("textures/door/ambientOcclusion.jpg")
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')



const material = new MeshStandardMaterial()
material.metalness = 0.7
material.roughness = 0.2
// const material = new MeshStandardMaterial()
// material.map = colorTexture
// material.metalnessMap = metalnessTexture
// material.roughnessMap = roughnessTexture
// material.aoMap = ambientOcclusionTexture
// material.aoMapIntensity = 1
// material.displacementMap = heightTexture
// material.displacementScale = 0.03
// material.normalMap = normalTexture
// material.transparent = true
// material.alphaMap = alphaTexture



const sphere = new Mesh(new SphereGeometry(0.5, 64, 64), material)
sphere.position.y = -1.25

const plane = new Mesh(new PlaneGeometry(1, 1, 100, 100), material)
plane.material.side = DoubleSide

const torus = new Mesh(new TorusGeometry(0.3, 0.2, 64, 128), material)
torus.position.y = 1.25

// sphere.geometry.setAttribute('uv2', new BufferAttribute(sphere.geometry.attributes.uv.array, 2))
// plane.geometry.setAttribute('uv2', new BufferAttribute(plane.geometry.attributes.uv.array, 2))
// torus.geometry.setAttribute('uv2', new BufferAttribute(torus.geometry.attributes.uv.array, 2))

scene.add(sphere, plane, torus)



// const ambientLight = new AmbientLight(0xffffff, 0.5)
// scene.add(ambientLight)

// const pointLight = new PointLight(0xffffff, 0.5)
// pointLight.position.set(2, 3, 4)
// scene.add(pointLight)



const cubeTextureLoader = new CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/3/px.jpg',
    '/textures/environmentMaps/3/nx.jpg',
    '/textures/environmentMaps/3/py.jpg',
    '/textures/environmentMaps/3/ny.jpg',
    '/textures/environmentMaps/3/pz.jpg',
    '/textures/environmentMaps/3/nz.jpg'
])

material.envMap = environmentMapTexture
material.envMapIntensity = 1.5



const gui = new dat.GUI
gui.add(material, "metalness", 0, 1, 0.01)
gui.add(material, "roughness", 0, 1, 0.01)
// gui.add(material, "aoMapIntensity", 0, 1, 0.01)
// gui.add(material, "displacementScale", -0.1, 0.1, 0.01)
gui.add(material, "envMapIntensity", 0, 10, 0.01)



const play = () => {
  sphere.rotateZ(vel)
  plane.rotateY(vel)
  torus.rotateX(vel)
}
export { play }