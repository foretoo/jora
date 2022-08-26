export const unitGRandom = () => {
  let rand = 0
  for (var i = 0; i < 8; i++) {
    rand += Math.random()
  }
  return rand / 8
}

export const gRandom = (
  min?: number, 
  max?: number,
) => {
  max ?? (max = min, min = 0)
  min ?? (min = 0, max = 1)
  return min + unitGRandom() * (max! - min)
}