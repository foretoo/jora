const ctx: Worker = self as any

ctx.onmessage = (e) => {
  console.log(e.data)
}



export type {}