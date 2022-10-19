const nd = 3
export const unitGRandom = () => {
  let rand = 0
  for (let i = 0; i < nd; i++) {
    rand += Math.random()
  }
  return rand / nd
}

export const gRandom = (
  min?: number, 
  max?: number,
) => {
  max ?? (max = min, min = 0)
  min ?? (min = 0, max = 1)
  return min + unitGRandom() * (max! - min)
}