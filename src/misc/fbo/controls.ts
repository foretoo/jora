import { material } from "."
import { positionVar } from "./gpgpu"
import aizawaShader from "./shaders/aizawa.glsl"
import thomasShader from "./shaders/thomas.glsl"

export const controls = {
  shader: aizawaShader,

  list: [ "thomas", "aizawa" ],

  _attractor: "aizawa",
  get attractor() { return controls._attractor },
  set attractor(v) {
    controls._attractor = v
    if (v === "aizawa") {
      controls.shader = aizawaShader
      positionVar.material.fragmentShader = aizawaShader
    }
    else {
      controls.shader = thomasShader
      positionVar.material.fragmentShader = thomasShader
    }
    positionVar.material.needsUpdate = true
  },

  _noiseScale: 1,
  get noiseScale() { return controls._noiseScale },
  set noiseScale(v) {
    controls._noiseScale = v
    material.uniforms.noiseScale.value = 1 / v
  },

  _noiseStrength: 0.1,
  get noiseStrength() { return controls._noiseStrength },
  set noiseStrength(v) {
    controls._noiseStrength = v
    material.uniforms.noiseStrength.value = v
  },
  
  _roughness: 0.0,
  get roughness() { return controls._roughness },
  set roughness(v) {
    controls._roughness = v
    positionVar.material.uniforms.roughness.value = v
  },

  _vel: 2.0,
  get vel() { return controls._vel },
  set vel(v) {
    controls._vel = v
    positionVar.material.uniforms.vel.value = v
  },

  thomas: {
    _b: 0.208186,
    get b() { return controls.thomas._b },
    set b(v) {
      controls.thomas._b = v
      positionVar.material.uniforms.tb.value = v
    },
  },

  aizawa: {
    _a: 1.0,
    _b: 0.5,
    _c: 1.5,
    _d: 0.0,
    _e: 0.2,
    _f: 0.0,

    get a() { return controls.aizawa._a },
    get b() { return controls.aizawa._b },
    get c() { return controls.aizawa._c },
    get d() { return controls.aizawa._d },
    get e() { return controls.aizawa._e },
    get f() { return controls.aizawa._f },

    set a(v) {
      controls.aizawa._a = v
      positionVar.material.uniforms.aa.value = v
    },
    set b(v) {
      controls.aizawa._b = v
      positionVar.material.uniforms.ab.value = v
    },
    set c(v) {
      controls.aizawa._c = v
      positionVar.material.uniforms.ac.value = v
    },
    set d(v) {
      controls.aizawa._d = v
      positionVar.material.uniforms.ad.value = v
    },
    set e(v) {
      controls.aizawa._e = v
      positionVar.material.uniforms.ae.value = v
    },
    set f(v) {
      controls.aizawa._f = v
      positionVar.material.uniforms.af.value = v
    },
  },
}