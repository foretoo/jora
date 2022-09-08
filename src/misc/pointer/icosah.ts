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



const ico = new IcosahedronBufferGeometry(1, 2)

const icoP = ico.attributes.position.array
const icoN = ico.attributes.position.count
const icoS = ico.attributes.position.itemSize
const icoA = icoN * icoS

const icoarr: number[] = []
const icoSet = new Set<string>()

for (let i = 0; i < icoA; i += icoS) {
  const p = [ icoP[i], icoP[i+1], icoP[i+2] ]
  const pstr = JSON.stringify(p)
  if (!icoSet.has(pstr)) {
    icoarr.push(...p)
    icoSet.add(pstr)
  }
}

export const icosahpoints = new Float32Array(icoarr)
