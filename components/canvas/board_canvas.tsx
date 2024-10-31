import { useMemo } from "react"
import { Stage, Layer, Rect, RectTouchEvent } from "./my_canvas"

export default function BoardCanvas({
  size,
  pixels,
  pixelSize,
  layer,
  layers,
  moveOffset,
  viewOffset,
  onDraw,
  onDrawEnd,
  onMove,
  onMoveEnd,
}: {
  size: { width: number; height: number }
  moveOffset: { x: number; y: number }
  viewOffset: { x: number; y: number }
  pixels: any[]
  layer: number
  layers: any[]
  pixelSize: number
  onDraw?: (event: any, touch: RectTouchEvent) => void
  onDrawEnd?: (event: any, touch: RectTouchEvent) => void
  onMove?: (size: { width: number; height: number }) => void
  onMoveEnd?: (size: { width: number; height: number }) => void
}) {
  const screenSize = useMemo(() => {
    return {
      width: size.width * 20,
      height: size.height * 20,
    }
  }, [size])

  const viewPixelSize = 20

  const viewSize = useMemo(() => {
    return {
      width: Math.floor(screenSize.width / viewPixelSize),
      height: Math.floor(screenSize.height / viewPixelSize),
    }
  }, [screenSize])

  const getGridColor = (color: string, index: number, x: number, y: number) => {
    // reduce clear color for grid shadow display
    let isGray = true
    isGray = (x + y) % 2 == 0
    if (isGray) {
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
    for (let y = 0; y < viewSize.height; y++) {
      for (let x = 0; x < viewSize.width; x++) {
        newPixels.push({
          x,
          y,
        })
      }
    }
    return newPixels
  }, [viewSize])

  const layerVos = useMemo(() => {
    let vos: any = {}
    layers.forEach((item) => {
      vos[item.value] = item
    })
    return vos
  }, [layers])

  return (
    <Stage
      className="board-canvas relative select-none flex items-center justify-center min-w-[320px] min-h-[320px]"
      width={screenSize.width}
      height={screenSize.height}
      onMouseMove={(e, size) => onMove?.(size)}
      onMouseMoveEnd={(e, size) => onMoveEnd?.(size)}
      onMouseDraw={(e, touch: RectTouchEvent) => {
        const pixel = {
          x: Math.floor(touch.x / pixelSize),
          y: Math.floor(touch.y / pixelSize),
        }
        onDraw?.(event, { ...touch, x: pixel.x, y: pixel.y })
      }}
    >
      <Layer>
        {boardPixels.map((pixel, index) => (
          <Rect
            key={index}
            x={pixel.x * viewPixelSize}
            y={pixel.y * viewPixelSize}
            width={viewPixelSize}
            height={viewPixelSize}
            fill={getGridColor("clear", index, pixel.x, pixel.y)}
            onMouseDown={(event, touch) =>
              onDraw?.(event, { ...touch, x: pixel.x, y: pixel.y })
            }
            onMouseUp={(event, touch) =>
              onDrawEnd?.(event, { ...touch, x: pixel.x, y: pixel.y })
            }
            onMouseMove={(event, touch) =>
              onDraw?.(event, { ...touch, x: pixel.x, y: pixel.y })
            }
            onClick={(event, touch) =>
              onDraw?.(event, { ...touch, x: pixel.x, y: pixel.y })
            }
          />
        ))}
      </Layer>
      <Layer>
        {pixels.map((pixel, index) => {
          let curLayer = layer === pixel.layer

          let x =
            (pixel.x + (curLayer ? moveOffset.x : 0) + viewOffset.x) * pixelSize
          let y =
            (pixel.y + (curLayer ? moveOffset.y : 0) + viewOffset.y) * pixelSize

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
