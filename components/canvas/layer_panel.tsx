"use client"

import { Icons } from "@/shared/icons"
import { ILayerData } from "@/client/stores/data"
import { cn } from "@/lib/utils"

export default function LayerPanel({
  layer,
  layers,
  onCreateLayer,
  onSelectLayer,
}: {
  layers: ILayerData[]
  layer: number
  onCreateLayer: () => void
  onSelectLayer: (layer: number) => void
}) {
  let showTools = false
  return (
    <>
      <div className="flex flex-row h-[32px] items-center text-[13px] font-semibold px-1">
        <span>Layers</span>
        <div className="flex-1"></div>
        <div
          className="flex flex-row items-center justify-center cursor-pointer"
          onClick={() => onCreateLayer()}
        >
          <Icons.create className="w-4 h-4" />
        </div>
      </div>

      <div>
        {layers.map((item) => {
          const isSelected = layer === item.value
          return (
            <div
              key={item.value}
              className={cn("relative group", isSelected ? "bg-gray-300" : "")}
              onClick={() => {
                onSelectLayer(item.value)
              }}
            >
              <div className="flex flex-row  px-2 text-[12px] cursor-pointer items-center ">
                {item.name}
                <div className="flex-1"></div>
              </div>
              {showTools && isSelected && (
                <div className="absolute top-0 right-0 flex space-x-[2px] px-1">
                  <div
                    className="flex flex-row w-4 h-4 items-center justify-center cursor-pointer"
                    onClick={() => {
                      //
                    }}
                  >
                    <Icons.moveUp className="w-3 h-3" />
                  </div>
                  <div
                    className="flex flex-row w-4 h-4 items-center justify-center cursor-pointer"
                    onClick={() => {
                      //
                    }}
                  >
                    <Icons.moveUp className="w-3 h-3 rotate-180" />
                  </div>

                  <div
                    className="flex flex-row w-4 h-4 items-center justify-center cursor-pointer"
                    onClick={() => {
                      //
                    }}
                  >
                    <Icons.trash className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
