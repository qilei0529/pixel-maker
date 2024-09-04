import { create } from "zustand"
import { persist } from "zustand/middleware"

type IConfigState = {
  panelColors: string[]
  customColors: string[]
}

type IConfigAction = {
  initColor: () => void
  appendColor: (colors: string[]) => void
  clearCustomColor: () => void
}

const sixteenColorPalette = [
  "#000000", // Black
  "#555555", // Dark Gray
  "#AAAAAA", // Light Gray
  "#FFFFFF", // White
  "#AA0000", // Red
  "#FF5555", // Light Red
  "#AA5500", // Brown
  "#FFFF55", // Yellow
  "#00AA00", // Green
  "#55FF55", // Light Green
  "#00AAAA", // Cyan
  "#55FFFF", // Light Cyan
  "#0000AA", // Blue
  "#5555FF", // Light Blue
  "#AA00AA", // Magenta
  "#FF55FF", // Light Magenta
]

export const useConfigStore = create<IConfigState & IConfigAction>()(
  persist(
    (set, get) => {
      return {
        panelColors: [],
        customColors: [],
        initColor() {
          const { panelColors } = get()
          if (panelColors.length === 0) {
            set({
              panelColors: sixteenColorPalette,
            })
          }
        },

        appendColor(colors) {
          const { customColors } = get()
          let newColors = [...customColors]
          colors.forEach((item) => {
            if (!newColors.includes(item)) {
              newColors.push(item)
            }
          })
          const len = newColors.length
          set({
            customColors: len > 6 ? newColors.slice(len - 6, len) : newColors,
          })
        },

        clearCustomColor() {
          set({
            customColors: [],
          })
        },
      }
    },
    {
      version: 1,
      name: "__DB__CONFIG_DATA",
    }
  )
)
