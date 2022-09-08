import { IcosahedronBufferGeometry } from "three"

// const phi = (1 + Math.sqrt(5)) / 2

// export const icosahpoints = [
//   -1 * phi,       -1,        0,
//   -1 * phi,        1,        0,
//        phi,       -1,        0,
//        phi,        1,        0,
//          0, -1 * phi,       -1,
//          0, -1 * phi,        1,
//          0,  1 * phi,       -1,
//          0,  1 * phi,        1,
//         -1,        0, -1 * phi,
//          1,        0, -1 * phi,
//         -1,        0,  1 * phi,
//          1,        0,  1 * phi,
// ]



export const getIcoVertecies = (
  radius?: number,
  detail?: number,
) => {
  const ico = new IcosahedronBufferGeometry(radius, detail)

  const pos = ico.attributes.position.array
  const count = ico.attributes.position.count
  const size = ico.attributes.position.itemSize
  const amount = count * size

  const vertecies: number[] = []
  const vertexSet = new Set<string>()

  for (let i = 0; i < amount; i += size) {
    const p = [ pos[i], pos[i+1], pos[i+2] ]
    const pstr = JSON.stringify(p)
    if (!vertexSet.has(pstr)) {
      vertecies.push(...p)
      vertexSet.add(pstr)
    }
  }

  return vertecies
}
