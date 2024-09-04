"use client"

import { Icons } from "@/shared/icons"
import { ILayerData } from "@/client/stores/data"
import { cn } from "@/lib/utils"

export default function LayerPanel({
  layer,
  layers,
  onCreateLayer,
  onSelectLayer,
  onRemoveLayer,
  onToggleHide,
  onToggleLevel,
}: {
  layers: ILayerData[]
  layer: number
  onToggleHide: (layer: number) => void
  onToggleLevel: (layer: number, index: number) => void
  onCreateLayer: () => void
  onRemoveLayer: (layer: number) => void
  onSelectLayer: (layer: number) => void
}) {
  let showTools = true
  let len = layers.length
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
        {layers.map((item, index) => {
          const isSelected = layer === item.value
          return (
            <div
              key={item.value}
              className={cn("relative group", isSelected ? "bg-gray-300" : "")}
              onClick={() => {
                onSelectLayer(item.value)
              }}
            >
              <div
                className={cn(
                  "flex flex-row h-[20px] pl-1 text-[12px] cursor-pointer items-center ",
                  isSelected ? "" : "hover:bg-gray-200"
                )}
              >
                <div
                  className="flex flex-row w-4 h-4 items-center justify-center cursor-pointer"
                  onClick={() => {
                    onToggleHide(item.value)
                  }}
                >
                  {item.hide ? (
                    <Icons.eye className="w-3 h-3 opacity-20" />
                  ) : (
                    <Icons.eye className="w-3 h-3" />
                  )}
                </div>
                <span className="px-1">{item.name}</span>
                <div className="flex-1"></div>
              </div>
              {showTools && isSelected && (
                <div className="absolute h-[20px] top-0 right-0 flex flex-row items-center space-x-[2px] px-1">
                  <div
                    className={cn(
                      "flex flex-row w-4 h-4 items-center justify-center cursor-pointer",
                      index == 0 ? "opacity-0" : ""
                    )}
                    onClick={() => {
                      onToggleLevel(item.value, 1)
                    }}
                  >
                    <Icons.moveUp className={"w-3 h-3"} />
                  </div>
                  <div
                    className={cn(
                      "flex flex-row w-4 h-4 items-center justify-center cursor-pointer",
                      index == len - 1 ? "opacity-0" : ""
                    )}
                    onClick={() => {
                      //
                      onToggleLevel(item.value, -1)
                    }}
                  >
                    <Icons.moveUp className="w-3 h-3 rotate-180" />
                  </div>

                  <div
                    className="flex flex-row w-4 h-4 items-center justify-center cursor-pointer"
                    onClick={() => {
                      //
                      onRemoveLayer(item.value)
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
