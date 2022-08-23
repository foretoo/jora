let looping = true
let t = 0
let startt = 0
let toRestart = false
let play = () => {}

export function createPlayer(
  callback: (t: number) => void
) {

  play = () => {
    if (toRestart) {
      toRestart = false
      startt = performance.now() - t
    }
    t = performance.now() - startt

    callback(t)
    
    looping && requestAnimationFrame(play)
  }

  return play
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    looping = true
    requestAnimationFrame(play)
  }
  else {
    looping = false
    toRestart = true
  }
})