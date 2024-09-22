import { useMemo } from "react"
import { Stage, Layer, Rect } from "./my_canvas"

export default function BoardCanvas({
  size,
  pixels,
  pixelSize,
  layer,
  layers,
  offset,
  onDraw,
  onMove,
  onMoveEnd,
}: {
  size: { width: number; height: number }
  offset: { x: number; y: number }
  pixels: any[]
  layer: number
  layers: any[]
  pixelSize: number
  onDraw?: (pos: { x: number; y: number }, index: number) => void
  onMove?: (size: { width: number; height: number }) => void
  onMoveEnd?: (size: { width: number; height: number }) => void
}) {
  const canvasWidth = size.width * pixelSize
  const canvasHeight = size.height * pixelSize

  const getGridColor = (color: string, index: number) => {
    // reduce clear color for grid shadow display
    const d = Math.floor(index / size.width)
    if ((index + d) % 2 === 1) {
      return "rgba(0,0,0,.1)"
    }
    return "rgba(255,255,255,0.5)"
  }

  const getColor = (color: string, index: number, isHide?: boolean) => {
    // reduce clear color for grid shadow display
    if (isHide) {
      return "transparent"
    }
    if (color === "clear") {
      return "transparent"
    }
    return color
  }

  const boardPixels = useMemo(() => {
    let newPixels: { x: number; y: number }[] = []
    for (let y = 0; y < size.height; y++) {
      for (let x = 0; x < size.width; x++) {
        newPixels.push({
          x,
          y,
        })
      }
    }
    return newPixels
  }, [size, pixels])

  const layerVos = useMemo(() => {
    let vos: any = {}
    layers.forEach((item) => {
      vos[item.value] = item
    })
    return vos
  }, [layers])

  return (
    <Stage
      className="select-none"
      width={canvasWidth}
      height={canvasHeight}
      onMouseMove={(e, size) => onMove?.(size)}
      onMouseMoveEnd={(e, size) => onMoveEnd?.(size)}
    >
      <Layer>
        {boardPixels.map((pixel, index) => (
          <Rect
            key={index}
            x={pixel.x * pixelSize}
            y={pixel.y * pixelSize}
            width={pixelSize}
            height={pixelSize}
            fill={getGridColor("clear", index)}
            onMouseDown={(event) => onDraw?.({ x: pixel.x, y: pixel.y }, index)}
            onMouseMove={(event) => onDraw?.({ x: pixel.x, y: pixel.y }, index)}
            onClick={(event) => onDraw?.({ x: pixel.x, y: pixel.y }, index)}
          />
        ))}
      </Layer>
      <Layer>
        {pixels.map((pixel, index) => {
          let curLayer = layer === pixel.layer

          let x = (pixel.x + (curLayer ? offset.x : 0)) * pixelSize
          let y = (pixel.y + (curLayer ? offset.y : 0)) * pixelSize

          // check curLayer ishide
          let layerItem = layerVos[pixel.layer]
          let hide = layerItem?.hide
          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={pixelSize}
              height={pixelSize}
              fill={getColor(pixel.color, index, hide)}
            />
          )
        })}
      </Layer>
    </Stage>
  )
}
