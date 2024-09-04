"use client"
import { Stage, Layer, Rect } from "./my_canvas"

export default function MiniMapPanel({
  size,
  pixels,
}: {
  size: { width: number; height: number }
  pixels: any[]
}) {
  const miniSize = 4
  const miniCanvasWidth = size.width * miniSize
  const miniCanvasHeight = size.height * miniSize

  return (
    <div className="minimapflex flex flex-col items-center ">
      <div className="h-[20px] text-[14px]">
        {size.width} x {size.height}
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
              x={(index % size.width) * miniSize}
              y={Math.floor(index / size.height) * miniSize}
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
