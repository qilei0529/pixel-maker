import { create } from "zustand"
import { persist } from "zustand/middleware"

type IDataState = {
  pixels: any[]
  size: { width: number; height: number }
}

type IDataAction = {}

export const useDataStore = create<IDataState & IDataAction>()(
  persist(
    (set, get) => {
      return {
        pixels: [],
        size: { width: 16, height: 16 },
      }
    },
    {
      version: 1,
      name: "__DB__PIXEL_DATA",
    }
  )
)
