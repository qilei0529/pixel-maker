"use client"
import { Stage, Layer, Rect } from "./my_canvas"

export default function MiniMapPanel({
  size,
  pixels,
}: {
  size: number[]
  pixels: any[]
}) {
  const miniSize = 4
  const miniCanvasWidth = size[0] * miniSize
  const miniCanvasHeight = size[0] * miniSize

  return (
    <div className="minimapflex flex flex-col items-center ">
      <div className="h-[20px] text-[14px]">
        {size[0]} x {size[1]}
      </div>
      <Stage
        className=" bg-white"
        width={miniCanvasWidth}
        height={miniCanvasHeight}
      >
        <Layer>
          {pixels.map((pixel, index) => (
            <Rect
              key={index}
              x={(index % size[0]) * miniSize}
              y={Math.floor(index / size[1]) * miniSize}
              width={miniSize}
              height={miniSize}
              fill={pixel.color === "clear" ? "rgba(0,0,0,.0)" : pixel.color}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  )
}
