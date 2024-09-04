import { create } from "zustand"
import { persist } from "zustand/middleware"

type IDataState = {
  pixels: any[]
  pixelSize: number
  size: { width: number; height: number }
}

type IPixelData = {
  color: string
}

type IDataAction = {
  initData: () => void
  getData: () => IPixelData[]
  updatePixelAt: (index: number, color: string) => IPixelData[]
  clearData: () => IPixelData[]

  saveData: (data: IPixelData[]) => void

  setSize: (size: { width: number; height: number }) => void

  setPixelSize: (size: number) => void
}

let _timer: any = null

export const useDataStore = create<IDataState & IDataAction>()(
  persist(
    (set, get) => {
      return {
        pixels: [],
        pixelSize: 20,
        size: { width: 0, height: 0 },

        initData() {
          let { size, pixels } = get()
          if (size.width == 0) {
            size.width = 16
            size.height = 16
          }

          // let count = 0
          let newPixels = Array.from(
            { length: size.width * size.height },
            () => {
              let color = "clear"
              // count++
              return {
                color: color,
              }
            }
          )

          console.log(1111, size)
          set({
            size: size,
            pixels: newPixels,
          })
        },

        getData() {
          const { size, pixels, initData } = get()
          if (size.width == 0 || pixels.length != size.width * size.height) {
            initData()
          }
          return get().pixels
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

        setSize(size) {
          set({
            size,
          })
          const { initData } = get()
          initData()
        },

        setPixelSize(size) {
          set({
            pixelSize: size,
          })
        },
      }
    },
    {
      version: 1,
      name: "__DB__PIXEL_DATA",
    }
  )
)
