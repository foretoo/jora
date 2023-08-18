declare module "*.glsl" {
  const shader: string
  export default shader
}

declare module "*.vs" {
  const shader: string
  export default shader
}

declare module "*.fs" {
  const shader: string
  export default shader
}

type Tuple<T, N extends number, R = []> = R["length"] extends N ? R : Tuple<T, N, [T, ...R]>
