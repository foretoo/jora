const phi = (1 + Math.sqrt(5)) / 2

export const icosahpoints = [
  -1 * phi,       -1,        0,
  -1 * phi,        1,        0,
       phi,       -1,        0,
       phi,        1,        0,
         0, -1 * phi,       -1,
         0, -1 * phi,        1,
         0,  1 * phi,       -1,
         0,  1 * phi,        1,
        -1,        0, -1 * phi,
         1,        0, -1 * phi,
        -1,        0,  1 * phi,
         1,        0,  1 * phi,
]

export const icosah = new Float32Array(icosahpoints)