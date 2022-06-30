import { Scene, Group, Mesh, BoxGeometry, MeshBasicMaterial, Color, AxesHelper, OrthographicCamera, PerspectiveCamera, WebGLRenderer } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"

// Canvas
const canvas = document.querySelector("canvas")!

// Sizes
const sizes = {
  width: 800,
  height: 600,
}

// Scene
const scene = new Scene()

// Red cube
const csn = 10, off = (csn / 2) - 0.5
const group = new Group()
for (let x = 0; x < csn; x++) {
  for (let z = 0; z < csn; z++) {
    for (let y = 0; y < csn; y++) {
      const cube = new Mesh(
        new BoxGeometry(0.25, 0.25, 0.25),
        new MeshBasicMaterial({
          color: new Color(x / (csn - 1), z / (csn - 1), y / (csn - 1))
        }),
      )
      cube.position.set(x - off, z - off, y - off)
      group.add(cube)
    }
  }
}
group.scale.multiplyScalar(2 / csn)
scene.add(group)

// Axes
const axes = new AxesHelper(100)
scene.add(axes)

// Camera
// const cursor = { x: 0, y: 0 }
// canvas.onmousemove = (e: MouseEvent) => {
//   cursor.x =  e.offsetX / sizes.width  - 0.5
//   cursor.y = -e.offsetY / sizes.height + 0.5
// }
const aspect = sizes.width / sizes.height
const camera = new PerspectiveCamera(75, aspect, 0.1, 100)
// const camera = new OrthographicCamera(
//     -1 * aspect, 1 * aspect, 1, -1, 0.1, 100
//   )
camera.position.set(0, 0, 3)
scene.add(camera)
const controls = new OrbitControls(camera, canvas)

// Renderer
const renderer = new WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)

let looping = true
window.onkeydown = (e: KeyboardEvent) => {
  if (e.code === "Space") {
    if (looping) looping = false
    else {
      looping = true
      loop()
    }
  }
}



export const loop = () => {
  group.rotation.x += 0.0091
  group.rotation.y += 0.0133
  group.rotation.z += 0.0157

  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
  // camera.position.y = cursor.y * 3

  camera.lookAt(axes.position)
  controls.update()

  renderer.render(scene, camera)
  looping && requestAnimationFrame(loop)
}