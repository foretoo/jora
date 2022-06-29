import "./style.sass"

const PI = Math.PI, TAU = PI * 2

const canvas = document.querySelector("canvas")!
const { width, height } = canvas.getBoundingClientRect()
canvas.width = width
canvas.height = height

const ctx = canvas.getContext("2d")!

ctx.font = "32px serif"
ctx.textAlign = "center"
ctx.textBaseline = "middle"
ctx.fillText("Jora, privet!", width / 2, height / 2)

ctx.arc(width / 2, height / 2, 100, 0, TAU)
ctx.stroke()