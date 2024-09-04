import { version } from "@/lib/utils"
import { create } from "zustand"
import { persist } from "zustand/middleware"

type IDataState = {
  pixels: IPixelData[]
  pixelMap: { [key: string]: IPixelData }
  layers: ILayerData[]
  layer: number
  pixelSize: number
  size: { width: number; height: number }
}

export type ILayerData = {
  name: string
  value: number
  hide?: boolean
}
export type IPixelData = {
  color: string
  x: number
  y: number
  layer: number
}

type IDataAction = {
  initData: () => void
  getData: () => IPixelData[]

  updatePixelAt: (
    pos: { x: number; y: number },
    color: string,
    layer?: number
  ) => IPixelData[]
  movePixels: (by: { x: number; y: number }, layer?: number) => IPixelData[]
  clearData: (layer?: number) => IPixelData[]
  saveData: (data: { [key: string]: IPixelData }) => void
  setSize: (size: { width: number; height: number }) => void
  setPixelSize: (size: number) => void

  addLayer: () => void
  removeLayer: (layer: number) => void
  moveLayer: (layer: number, index: number) => void
  toggleHideLayer: (layer: number) => void

  setLayer: (layer: number) => void
}

export const useDataStore = create<IDataState & IDataAction>()(
  persist(
    (set, get) => {
      return {
        pixels: [],
        layers: [
          {
            name: "layer-1",
            value: 1,
          },
        ],
        layer: 1,
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

        updatePixelAt(pos, color, layer) {
          const { saveData, pixelMap } = get()
          let l = layer || 1
          const key = `${l}_${pos.x}_${pos.y}`
          const newPixels: { [key: string]: IPixelData } = {
            ...pixelMap,
            [key]: {
              color,
              x: pos.x,
              y: pos.y,
              layer: l,
            },
          }
          saveData(newPixels)
          return Object.keys(newPixels).map((key) => newPixels[key])
        },

        saveData(data) {
          console.log("save data")
          useDataStore.setState({
            pixelMap: data,
          })
        },

        clearData() {
          const { pixels, saveData, getData, pixelMap } = get()
          saveData({})
          // reset layer
          set({
            layers: [
              {
                name: "layer-1",
                value: 1,
              },
            ],
          })
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

        movePixels(offset, layer) {
          const { pixelMap, saveData } = get()
          const newMap: any = {}
          Object.keys(pixelMap).forEach((key) => {
            const item = pixelMap[key]
            let x = item.x
            let y = item.y
            let l = layer || 1
            // move
            if (item.layer == l) {
              x = item.x + offset.x
              y = item.y + offset.y
            }
            const k = `${item.layer}_${x}_${y}`
            newMap[k] = {
              color: item.color,
              x,
              y,
              layer: item.layer,
            }
          })
          saveData(newMap)
          return Object.keys(newMap).map((key) => newMap[key])
        },

        addLayer() {
          const { layers } = get()
          let first = layers[0]
          let value = first.value + 1
          let layer = {
            name: `layer-${value}`,
            value: value,
          }

          set({
            layers: [layer, ...layers],
            layer: layer.value,
          })
          return
        },

        setLayer(layer) {
          set({
            layer,
          })
        },

        removeLayer(layer) {
          const { layers, pixelMap, saveData } = get()

          if (layers.length === 1) {
            return
          }

          let index = layers.findIndex((item) => item.value == layer)
          let newLayers = layers.filter((item) => item.value !== layer)
          set({
            layers: newLayers,
            layer: newLayers[Math.max(0, index - 1)]?.value || layers[0].value,
          })

          // remove pixel
          const newPixelMap: { [key: string]: IPixelData } = {}

          Object.keys(pixelMap).forEach((key) => {
            let item = pixelMap[key]
            if (item.layer !== layer) {
              newPixelMap[key] = item
            }
          })

          saveData(newPixelMap)
        },

        toggleHideLayer(layer) {
          const { layers } = get()
          const newLayers = [...layers]
          newLayers.forEach((item) => {
            if (item.value == layer) {
              item.hide = !item.hide
            }
          })
          set({
            layers: newLayers,
          })
        },

        moveLayer(layer, index) {
          const { layers, pixelMap, saveData } = get()
          let indexAt = layers.findIndex((item) => {
            return item.value == layer
          })

          if (indexAt < 0) {
            console.log("not find")
            return
          }
          const newLayers = [...layers]
          let indexTo = indexAt - index
          if (indexTo > newLayers.length - 1) {
            console.log("top")
            return
          } else if (indexTo < 0) {
            console.log("bottom")
            return
          }

          let valueAt = newLayers[indexAt].value
          let valueTo = newLayers[indexTo].value

          newLayers[indexAt].value = valueTo
          newLayers[indexTo].value = valueAt

          set({
            layers: newLayers.sort((a, b) => b.value - a.value),
            layer: valueTo,
          })

          // remove pixel
          const newPixelMap: { [key: string]: IPixelData } = {}

          Object.keys(pixelMap).forEach((key) => {
            let item = pixelMap[key]
            if (item.layer == valueAt) {
              item.layer = valueTo
            } else if (item.layer == valueTo) {
              item.layer = valueAt
            }
            newPixelMap[key] = item
          })

          saveData(newPixelMap)
        },
      }
    },
    {
      version: version,
      name: "__DB__PIXEL_DATA",
    }
  )
)
