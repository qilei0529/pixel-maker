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
              className={cn(
                "px-2 text-[12px] cursor-pointer",
                isSelected ? "bg-gray-300" : ""
              )}
              onClick={() => {
                onSelectLayer(item.value)
              }}
            >
              {item.name}
            </div>
          )
        })}
      </div>
    </>
  )
}
