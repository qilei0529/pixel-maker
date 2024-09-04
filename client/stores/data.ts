import { create } from "zustand"
import { persist } from "zustand/middleware"

type IDataState = {
  pixels: IPixelData[]
  pixelMap: { [key: string]: IPixelData }
  pixelSize: number
  size: { width: number; height: number }
}

type IPixelData = {
  color: string
  x: number
  y: number
}

type IDataAction = {
  initData: () => void
  getData: () => IPixelData[]

  updatePixelAt: (pos: { x: number; y: number }, color: string) => IPixelData[]
  movePixels: (by: { x: number; y: number }) => IPixelData[]
  clearData: () => IPixelData[]

  saveData: (data: { [key: string]: IPixelData }) => void

  setSize: (size: { width: number; height: number }) => void
  setPixelSize: (size: number) => void
}

export const useDataStore = create<IDataState & IDataAction>()(
  persist(
    (set, get) => {
      return {
        pixels: [],
        pixelMap: {},
        pixelSize: 20,
        size: { width: 0, height: 0 },

        initData() {
          let { size, pixels } = get()
          if (size.width == 0) {
            size.width = 16
            size.height = 16
          }

          set({
            size: size,
          })
        },

        getData() {
          const { size, pixels, initData, pixelMap } = get()
          if (size.width === 0) {
            initData()
          }
          return Object.keys(pixelMap).map((key) => pixelMap[key])
        },

        updatePixelAt(pos: { x: number; y: number }, color: string) {
          const { saveData, pixelMap, getData } = get()
          const key = `${pos.x}_${pos.y}`
          const newPixels: { [key: string]: IPixelData } = {
            ...pixelMap,
            [key]: {
              color,
              x: pos.x,
              y: pos.y,
            },
          }
          saveData(newPixels)
          return Object.keys(newPixels).map((key) => newPixels[key])
        },

        saveData(data: { [key: string]: IPixelData }) {
          console.log("save data")
          useDataStore.setState({
            pixelMap: data,
          })
        },

        clearData() {
          const { pixels, saveData, getData, pixelMap } = get()
          saveData({})
          return []
        },

        setSize(size) {
          set({
            size,
          })
        },

        setPixelSize(size) {
          set({
            pixelSize: size,
          })
        },

        movePixels(offset) {
          const { pixelMap, saveData } = get()
          const newMap: any = {}
          Object.keys(pixelMap).forEach((key) => {
            const item = pixelMap[key]
            let x = item.x + offset.x
            let y = item.y + offset.y
            const k = `${x}_${y}`
            newMap[k] = {
              color: item.color,
              x,
              y,
            }
          })
          saveData(newMap)
          return Object.keys(newMap).map((key) => newMap[key])
        },
      }
    },
    {
      version: 1,
      name: "__DB__PIXEL_DATA",
    }
  )
)
