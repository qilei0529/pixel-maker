import { create } from "zustand"
import { persist } from "zustand/middleware"

type IConfigState = {
  colors: string[]
}

type IConfigAction = {}

export const useConfigStore = create<IConfigState & IConfigAction>()(
  persist(
    (set, get) => {
      return {
        colors: [],
      }
    },
    {
      version: 1,
      name: "__DB__CONFIG_DATA",
    }
  )
)
