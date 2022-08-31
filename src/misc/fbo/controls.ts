import aizawaShader from "./shaders/aizawa.glsl"
import thomasShader from "./shaders/thomas.glsl"

type IThomas = {
  b: number
}
type IAizawa = {
  a: number
  b: number
  c: number
  d: number
  e: number
  f: number
}
type nCall = ((v: number) => void)[]
interface IControls {
  listen: {
    attractor: ((shader: string) => void)[]
    noiseScale: nCall
    noiseStrength: nCall
    roughness: nCall
    vel: nCall
    thomas: {
      b: nCall
    }
    aizawa: {
      a: nCall
      b: nCall
      c: nCall
      d: nCall
      e: nCall
      f: nCall
    }
  }
  shader: string
  list: [ "thomas", "aizawa" ]
  attractor: "thomas" | "aizawa"
  noiseScale: number
  noiseStrength: number
  roughness: number
  vel: number
  thomas: IThomas
  aizawa: IAizawa
}

const _controls: Omit<IControls, "listen" | "shader" | "list"> = {
  attractor: "aizawa",
  noiseScale: 5,
  noiseStrength: 1.0,
  roughness: 1.0,
  vel: 1.0,
  thomas: {
    b: 0.208186
  },
  aizawa: {
    a: 1.1,
    b: 0.0,
    c: 1.3, // inner radius
    d: 0.0,
    e: 0.2,
    f: 0.0,
  }
}

export const controls: IControls = {
  listen: {
    attractor: [],
    noiseScale: [],
    noiseStrength: [],
    roughness: [],
    vel: [],
    thomas: {
      b: []
    },
    aizawa: {
      a: [],
      b: [],
      c: [],
      d: [],
      e: [],
      f: [],
    }
  },

  shader: aizawaShader,

  list: [ "thomas", "aizawa" ],

  get attractor() { return _controls.attractor },
  set attractor(v) {
    _controls.attractor = v
    if (v === "aizawa") controls.shader = aizawaShader
    else controls.shader = thomasShader
    controls.listen.attractor.forEach((callback) => callback(controls.shader))
  },

  get noiseScale() { return _controls.noiseScale },
  set noiseScale(v) {
    _controls.noiseScale = v
    controls.listen.noiseScale.forEach((callback) => callback(1 / _controls.noiseScale))
  },

  get noiseStrength() { return _controls.noiseStrength },
  set noiseStrength(v) {
    _controls.noiseStrength = v
    controls.listen.noiseStrength.forEach((callback) => callback(v))
  },
  
  get roughness() { return _controls.roughness },
  set roughness(v) {
    _controls.roughness = v
    controls.listen.roughness.forEach((callback) => callback(v))
  },

  get vel() { return _controls.vel },
  set vel(v) {
    _controls.vel = v
    controls.listen.vel.forEach((callback) => callback(v))
  },

  thomas: {
    get b() { return _controls.thomas.b },
    set b(v) {
      _controls.thomas.b = v
      controls.listen.thomas.b.forEach((callback) => callback(v))
    },
  },

  aizawa: {

    get a() { return _controls.aizawa.a },
    get b() { return _controls.aizawa.b },
    get c() { return _controls.aizawa.c },
    get d() { return _controls.aizawa.d },
    get e() { return _controls.aizawa.e },
    get f() { return _controls.aizawa.f },

    set a(v) {
      _controls.aizawa.a = v
      controls.listen.aizawa.a.forEach((callback) => callback(v))
    },
    set b(v) {
      _controls.aizawa.b = v
      controls.listen.aizawa.b.forEach((callback) => callback(v))
    },
    set c(v) {
      _controls.aizawa.c = v
      controls.listen.aizawa.c.forEach((callback) => callback(v))
    },
    set d(v) {
      _controls.aizawa.d = v
      controls.listen.aizawa.d.forEach((callback) => callback(v))
    },
    set e(v) {
      _controls.aizawa.e = v
      controls.listen.aizawa.e.forEach((callback) => callback(v))
    },
    set f(v) {
      _controls.aizawa.f = v
      controls.listen.aizawa.f.forEach((callback) => callback(v))
    },
  },
}