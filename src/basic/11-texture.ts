import { Mesh, BoxGeometry, MeshBasicMaterial, Texture, TextureLoader, LoadingManager, DoubleSide, NearestFilter, LinearFilter, NearestMipmapNearestFilter, NearestMipMapLinearFilter, LinearMipMapLinearFilter, LinearMipmapNearestFilter } from "three"
import { scene } from "../init"



// const image = new Image()
// const texture = new Texture(image)
// image.src = "textures/door/color.jpg"
// image.onload = () => texture.needsUpdate = true

const loadManager = new LoadingManager()
loadManager.onStart = () => {
  console.log("start")
}
loadManager.onProgress = () => {
  console.log("progress")
}
loadManager.onLoad = () => {
  console.log("load")
}
loadManager.onError = () => {
  console.log("error")
}

const textureLoader = new TextureLoader(loadManager)

const colorTexture = textureLoader.load("textures/door/color.jpg")
const alphaTexture = textureLoader.load("textures/door/alpha.jpg")
const heightTexture = textureLoader.load("textures/door/height.jpg")
const normalTexture = textureLoader.load("textures/door/normal.jpg")
const metalnessTexture = textureLoader.load("textures/door/metalness.jpg")
const roughnessTexture = textureLoader.load("textures/door/roughness.jpg")
const ambientOcclusionTexture = textureLoader.load("textures/door/ambientOcclusion.jpg")

colorTexture.center.set(0.5, 0.5)
colorTexture.rotation = Math.PI / 4
colorTexture.repeat.set(2, 2)

alphaTexture.generateMipmaps = false



const geometry = new BoxGeometry(1, 1, 1)
const material = new MeshBasicMaterial({
  map: colorTexture,
  alphaMap: alphaTexture,
  transparent: true,
  side: DoubleSide,
})
const mesh = new Mesh(geometry, material)
scene.add(mesh)



const play = () => {}
export { play }