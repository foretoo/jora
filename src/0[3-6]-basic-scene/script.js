const {
  Scene, Group, BoxGeometry, MeshBasicMaterial, Mesh, Color, PerspectiveCamera, WebGLRenderer, AxesHelper
} = THREE

// Sizes
const sizes = {
  width: 800,
  height: 600
}

// Scene
const scene = new Scene()

// Red cube
const group = new Group()
for (let x = 0; x < 3; x++) {
  for (let z = 0; z < 3; z++) {
    for (let y = 0; y < 3; y++) {
      const cube = new Mesh(
        new BoxGeometry(0.5, 0.5, 0.5),
        new MeshBasicMaterial({ color: new Color(x/2, z/2, y/2) })
      )
      cube.position.set(x - 1, z - 1, y - 1)
      group.add(cube)
    }
  }
}
group.scale.set(0.5, 0.5, 0.5)
scene.add(group)

// Axes
const axes = new AxesHelper(100)
scene.add(axes)

// Camera
const camera = new PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(1,1,2)
camera.lookAt(axes.position)
scene.add(camera)

// Renderer
const canvas = document.querySelector("canvas")
const renderer = new WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)



const loop = () => {
  group.rotateX(0.01)
  group.rotateY(0.0135)
  group.rotateZ(-0.0051)
  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)