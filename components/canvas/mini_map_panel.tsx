"use client"
import { useMemo } from "react"
import { Stage, Layer, Rect } from "./my_canvas"

export default function MiniMapPanel({
  size,
  pixels,
  layers,
}: {
  size: { width: number; height: number }
  pixels: any[]
  layers: any[]
}) {
  const miniSize = size.width > 30 ? 2 : 4
  const miniCanvasWidth = size.width * miniSize
  const miniCanvasHeight = size.height * miniSize

  const layerVos = useMemo(() => {
    let vos: any = {}
    layers.forEach((item) => {
      vos[item.value] = item
    })
    return vos
  }, [layers])

  return (
    <div className="minimapflex flex flex-col items-center ">
      <Stage
        className=" bg-white"
        width={miniCanvasWidth}
        height={miniCanvasHeight}
      >
        <Layer>
          {pixels.map((pixel, index) => {
            // check curLayer ishide
            let layerItem = layerVos[pixel.layer]
            let hide = layerItem?.hide
            return (
              <Rect
                key={index}
                x={pixel.x * miniSize}
                y={pixel.y * miniSize}
                width={miniSize}
                height={miniSize}
                fill={
                  pixel.color === "clear" || hide
                    ? "rgba(0,0,0,.0)"
                    : pixel.color
                }
              />
            )
          })}
        </Layer>
      </Stage>
    </div>
  )
}
