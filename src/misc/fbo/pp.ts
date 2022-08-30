import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass.js"
import { camera, renderer, scene } from "./init"
import { IUniform } from "three"

const composer = new EffectComposer( renderer )
composer.addPass( new RenderPass( scene, camera ) )

const afterimagePass = new AfterimagePass()
interface IUniforms { [uniform: string]: IUniform<number> }
(afterimagePass.uniforms as IUniforms).damp.value = 0.618

afterimagePass.shaderMaterial.fragmentShader = `
uniform float damp;

uniform sampler2D tOld;
uniform sampler2D tNew;

varying vec2 vUv;

void main() {

  vec4 texelOld = texture2D( tOld, vUv );
  vec4 texelNew = texture2D( tNew, vUv );

  texelOld *= damp; // * max( texelOld - 0.01, 0.0 );

  gl_FragColor = max(texelNew, texelOld);

}`

afterimagePass.shaderMaterial.needsUpdate = true
composer.addPass( afterimagePass )

addEventListener("resize", () => {
  composer.setSize(innerWidth, innerHeight)  
})

export const renderComposer = () => {
  composer.render()
}