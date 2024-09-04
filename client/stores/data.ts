import { create } from "zustand"
import { persist } from "zustand/middleware"

type IDataState = {
  pixels: any[]
  size: { width: number; height: number }
}

type IPixelData = {
  color: string
}

type IDataAction = {
  getData: () => IPixelData[]
  updatePixelAt: (index: number, color: string) => IPixelData[]
  clearData: () => IPixelData[]

  saveData: (data: IPixelData[]) => void
}

let _timer: any = null

export const useDataStore = create<IDataState & IDataAction>()(
  persist(
    (set, get) => {
      return {
        pixels: [],
        size: { width: 16, height: 16 },
        getData() {
          const { size, pixels } = get()
          if (pixels.length == 0) {
            let newPixels = Array.from(
              { length: size.width * size.height },
              () => ({
                color: "clear",
              })
            )
            set({
              pixels: newPixels,
            })
          }
          return pixels
        },

        updatePixelAt(index: number, color: string) {
          const { pixels, saveData } = get()
          const newPixels = [...pixels]
          newPixels[index].color = color // 或者用户选择的颜色
          saveData(newPixels)
          return newPixels
        },

        saveData(data: IPixelData[]) {
          if (_timer) {
            clearTimeout(_timer)
            _timer = null
          }
          // debonce
          _timer = setTimeout(() => {
            console.log("save data")
            useDataStore.setState({
              pixels: data,
            })
          }, 200)
        },

        clearData() {
          const { pixels, saveData } = get()

          const newPixels = [...pixels]
          newPixels.forEach((item) => {
            item.color = "clear"
          })
          saveData(newPixels)

          return newPixels
        },
      }
    },
    {
      version: 1,
      name: "__DB__PIXEL_DATA",
    }
  )
)
