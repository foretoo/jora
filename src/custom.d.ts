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

type _TupleOf<T, N extends number, R extends unknown[]> = R['length'] extends N ? R : _TupleOf<T, N, [T, ...R]>;
type Tuple<T, N extends number> = N extends N ? (number extends N ? T[] : _TupleOf<T, N, []>) : never;