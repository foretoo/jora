import * as dat from "dat.gui"
import { controls } from "./controls"

const gui = new dat.GUI()
console.log(controls);

export const initGUI = () => {
  gui.add(controls, "attractor", controls.list)
  .onChange((curr: string) => {
    if (curr === "thomas") {
      aizawaFolder.hide()
      thomasFolder.show()
    }
    else if (curr === "aizawa") {
      aizawaFolder.show()
      thomasFolder.hide()
    }
  })

  gui.add(controls, "roughness", 0, 1, 0.01)
  gui.add(controls, "vel", 0, 4, 0.05)
  gui.add(controls, "noiseFactor", 0, 1, 0.05).name("noise")

  const thomasFolder = gui.addFolder("thomas props")
  thomasFolder.open()
  thomasFolder.hide()

  thomasFolder.add(controls.thomas, "b", 0.1, 0.3, 0.01)

  const aizawaFolder = gui.addFolder("aizawa props")
  aizawaFolder.open()

  aizawaFolder.add(controls.aizawa, "a", -4, 4, 0.05)
  aizawaFolder.add(controls.aizawa, "b", -4, 4, 0.05)
  aizawaFolder.add(controls.aizawa, "c", -4, 4, 0.05)
  aizawaFolder.add(controls.aizawa, "e", 0, 1, 0.05)
  aizawaFolder.add(controls.aizawa, "f", -0.5, 0.5, 0.01)
}