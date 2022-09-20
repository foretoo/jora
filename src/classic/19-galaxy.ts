import dat from "dat.gui"
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, IUniform, Points, PointsMaterial, RawShaderMaterial, TextureLoader } from "three"
import { camera, scene } from "../init"



camera.position.set(0, 2, 4)
const giu = new dat.GUI()

const tLoader = new TextureLoader()
const aTexture = tLoader.load("../../../public/textures/particles/8.png")
let t = 0



const parameters = {
  count: 50000,
  size: 0.15,
  branches: 2,
  length: 2,
  angle: Math.PI * 2,
  spread: 0.3,
  velocity: 1,
  innColor: "#f40",
  outColor: "#20f",
}

giu.add(parameters, "count", 1000, 100000, 10000)
  .onFinishChange(generateGalaxy)
giu.add(parameters, "size", 0.01, 0.2, 0.001)
  .onFinishChange(generateGalaxy)
giu.add(parameters, "branches", 2, 7, 1)
  .onFinishChange(generateGalaxy)
giu.add(parameters, "length", 1, 7, 0.1)
  .onFinishChange(generateGalaxy)
giu.add(parameters, "angle", 0, Math.PI * 4, 0.01)
  .onFinishChange(generateGalaxy)
giu.add(parameters, "spread", 0.01, 0.5, 0.01)
  .onFinishChange(generateGalaxy)
giu.add(parameters, "velocity", -10, 10, 0.01)

giu.addColor(parameters, "innColor")
  .onFinishChange(generateGalaxy)
giu.addColor(parameters, "outColor")
  .onFinishChange(generateGalaxy)



// Core

let coreGeometry: BufferGeometry
let coreMaterial: RawShaderMaterial
let core: Points<BufferGeometry, RawShaderMaterial>

// Stars

let starsGeometry: BufferGeometry
let starsMaterial: PointsMaterial
let stars: Points
const starsUniforms = {
  uTime: { value: t },
  uLength: { value: parameters.length },
  uVelocity: { value: parameters.velocity },
}

// generator

function generateGalaxy() {

  if (stars && core) {
    coreGeometry.dispose()
    coreMaterial.dispose()
    scene.remove(core)

    starsGeometry.dispose()
    starsMaterial.dispose()
    scene.remove(stars)

    t = 0
    starsUniforms.uLength.value = parameters.length
  }



  // CORE

  coreGeometry = new BufferGeometry()

  const coreCount = parameters.count / 5
  const corePositions = new Float32Array(coreCount * 3)
  const coreSizes = new Float32Array(coreCount)
  const coreSize = parameters.length

  for (let i = 0; i < coreCount; i += 3) {

    // Core positions

    let { x, y, z } = getRandomBallPoint(coreSize)
    length = Math.sqrt(x * x + y * y + z * z) / coreSize
    let logLength = length * length * length
    logLength = logLength < 0.1 ? Math.sqrt(logLength) : logLength
    const logRatio = logLength / length
    x *= logRatio
    y *= logRatio
    z *= logRatio

    corePositions[i + 0] = x
    corePositions[i + 1] = y * Math.random() * 0.382
    corePositions[i + 2] = z

    // Core sizes

    length = Math.sqrt(x * x + y * y + z * z) / coreSize
    coreSizes[i / 3] = (Math.random() + 1) * parameters.size * (1.5 - length)

  }

  coreGeometry.setAttribute("position", new BufferAttribute(corePositions, 3))
  coreGeometry.setAttribute("size", new BufferAttribute(coreSizes, 1))

  coreMaterial = new RawShaderMaterial({
    uniforms: {
      uAlphaMap: { value: aTexture },
      uColor: { value: new Color(parameters.innColor) },
      uTime: { value: 0 },
      uLength: { value: parameters.length },
    },
    vertexShader: `
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform float uTime;
    uniform float uLength;

    attribute vec3 position;
    attribute float size;

    void main()	{
      vec3 p = position;
      float len = sqrt(p.x * p.x + p.y * p.y + p.z * p.z) / uLength;
      len /= uLength * 1.382;
      len = 1.0 - sqrt(len);
      float t = -1.0 * uTime * len;
      vec3 rPos = p;
      rPos.x = p.x * cos(t) - p.z * sin(t);
      rPos.z = p.x * sin(t) + p.z * cos(t);

      vec4 mvPos = modelViewMatrix * vec4(rPos, 1.0);
      gl_Position = projectionMatrix * mvPos;
      gl_PointSize = size * (300.0 / -mvPos.z);
    }`,
    fragmentShader: `
    precision mediump float;
    uniform vec3 uColor;
    uniform sampler2D uAlphaMap;

    const float PI = 3.1415;

    void main()	{
      float a = texture2D(uAlphaMap, gl_PointCoord).x;
      if (a < 0.1) discard;
      float c = (sin(gl_PointCoord.x * PI) + sin(gl_PointCoord.y * PI)) * 0.5;
      c = step(0.99, c);
      gl_FragColor = vec4(uColor + c, a);
    }`,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  })

  core = new Points(coreGeometry, coreMaterial)
  scene.add(core)



  // STARS

  starsGeometry = new BufferGeometry()

  const starsPositions = new Float32Array(parameters.count * 3)
  const starsColors = new Float32Array(parameters.count * 3)
  const starsSizes = new Float32Array(parameters.count)

  const starsInnColor = new Color(parameters.innColor)
  const starsOutColor = new Color(parameters.outColor)

  for (let i = 0; i < parameters.count * 3; i += 3) {
    let step = Math.sqrt(i / (parameters.count * 3))

    // Sizes

    starsSizes[i / 3] = Math.random() * Math.sqrt(4 - step * 4) * parameters.size

    // Positions

    let xOffset = (0.02 * (Math.random() * 2 - 1)) + (Math.random() * 2 - 1) * step * parameters.spread
    let yOffset = (0.02 * (Math.random() * 2 - 1)) + (Math.random() * 2 - 1) * step * parameters.spread
    let zOffset = (0.02 * (Math.random() * 2 - 1)) + (Math.random() * 2 - 1) * step * parameters.spread

    const length = Math.sqrt(xOffset * xOffset + yOffset * yOffset + zOffset * zOffset)
    if (length > parameters.spread) {
      const normRatio = parameters.spread / length * Math.random()
      xOffset *= normRatio
      yOffset *= normRatio
      zOffset *= normRatio
    }
    xOffset *= 3 * Math.random()
    yOffset *= 2 * Math.random()
    zOffset *= 3 * Math.random()

    const angle = Math.pow(step, 1 + step * 2) * parameters.angle
    const angleOffset = (Math.PI * 2 / parameters.branches) * (i % (parameters.branches * 3)) / 3
    const cos = Math.cos(angle + angleOffset)
    const sin = Math.sin(angle + angleOffset)

    starsPositions[i + 0] = parameters.length * step * cos + xOffset
    starsPositions[i + 1] = yOffset
    starsPositions[i + 2] = parameters.length * step * sin + zOffset

    // Colors

    const mixColor = starsInnColor.clone()
    mixColor.lerp(starsOutColor, step)
    const rndColor = new Color(Math.random(), Math.random(), Math.random())
    mixColor.lerp(rndColor, 0.333)

    starsColors[i + 0] = mixColor.r
    starsColors[i + 1] = mixColor.g
    starsColors[i + 2] = mixColor.b
  }

  starsGeometry.setAttribute("position", new BufferAttribute(starsPositions, 3))
  starsGeometry.setAttribute("color", new BufferAttribute(starsColors, 3))
  starsGeometry.setAttribute("size", new BufferAttribute(starsSizes, 1))

  starsMaterial = new PointsMaterial({
    sizeAttenuation: true,
    vertexColors: true,
    alphaMap: aTexture,
    alphaTest: 0.1,
    blending: AdditiveBlending,
    transparent: true,
    depthWrite: false,
  })

  starsMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = starsUniforms.uTime
    shader.uniforms.uLength = starsUniforms.uLength

    shader.vertexShader = shader.vertexShader
      .replace("uniform float size;",
        `
        uniform float uTime;
        uniform float uLength;
        attribute float size;`,
      )
      .replace("#include <begin_vertex>",
        `
        #include <begin_vertex>
        vec3 p = position;
        float len = sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
        len /= uLength * 1.618;
        len = 1.0 - sqrt(len);
        float t = - uTime * len + cos(uTime) * len;
        transformed.x = p.x * cos(t) - p.z * sin(t);
        transformed.z = p.x * sin(t) + p.z * cos(t);
        `
      )

    shader.fragmentShader = shader.fragmentShader
      .replace("outgoingLight = diffuseColor.rgb;",
        `
        float c = (sin(gl_PointCoord.x * PI) + sin(gl_PointCoord.y * PI)) * 0.5;
        c = step(0.99, c);
        diffuseColor += c;
        outgoingLight = diffuseColor.rgb;
        `
      )
  }

  stars = new Points(starsGeometry, starsMaterial)
  scene.add(stars)

}
generateGalaxy()



export const play = () => {
  t += parameters.velocity / 5e3
  core.rotation.y = t
  stars.rotation.y = t
  core.material.uniforms.uTime.value = t
  starsUniforms.uTime.value = t
}



function getRandomBallPoint(
  radius: number
) {
  const u = Math.random()
  const v = Math.random()
  const theta = u * 2.0 * Math.PI
  const phi = Math.acos(2.0 * v - 1.0)
  const r = Math.random() * radius
  const sinTheta = Math.sin(theta)
  const cosTheta = Math.cos(theta)
  const sinPhi = Math.sin(phi)
  const cosPhi = Math.cos(phi)
  const x = r * sinPhi * cosTheta
  const y = r * sinPhi * sinTheta
  const z = r * cosPhi
  return { x, y, z }
}