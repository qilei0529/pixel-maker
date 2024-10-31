import { useEffect, useMemo, useState } from "react"
import { Stage, Layer, Rect, RectTouchEvent } from "./my_canvas"

export default function BoardCanvas({
  size,
  viewSize: vSize,
  pixels,
  pixelSize,
  layer,
  layers,
  moveOffset,
  viewOffset,
  viewPixelSize,
  onDraw,
  onMove,
  onMoveEnd,
}: {
  size: { width: number; height: number }
  moveOffset: { x: number; y: number }
  viewSize: { width: number; height: number }
  viewOffset: { x: number; y: number }
  viewPixelSize: number
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
      width: vSize.width * viewPixelSize,
      height: vSize.height * viewPixelSize,
    }
  }, [vSize, viewPixelSize])

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

  const layerVos = useMemo(() => {
    let vos: any = {}
    layers.forEach((item) => {
      vos[item.value] = item
    })
    return vos
  }, [layers])

  const board = useMemo(() => {
    return <DashBoard size={size} viewSize={vSize} pixelSize={pixelSize} />
  }, [size, vSize, pixelSize])

  const [offset, setOffset] = useState({ x: 0, y: 0 })
  useEffect(() => {
    let ratio = pixelSize / viewPixelSize
    setOffset({
      x: Math.floor((vSize.width / ratio - size.width) / 2),
      y: Math.floor((vSize.height / ratio - size.height) / 2),
    })
  }, [size, vSize, pixelSize, viewPixelSize])

  return (
    <div
      className="relative"
      style={{
        width: screenSize.width,
        height: screenSize.height,
      }}
    >
      <Stage
        className="board-canvas z-10 relative select-none flex items-center justify-center min-w-[320px] min-h-[320px]"
        width={screenSize.width}
        height={screenSize.height}
        onMouseMove={(e, size) => onMove?.(size)}
        onMouseMoveEnd={(e, size) => onMoveEnd?.(size)}
        onMouseDraw={(e, touch: RectTouchEvent) => {
          const pixel = {
            x: Math.floor(touch.x / pixelSize - viewOffset.x),
            y: Math.floor(touch.y / pixelSize - viewOffset.y),
          }
          onDraw?.(event, { ...touch, x: pixel.x, y: pixel.y })
        }}
      >
        <Layer>
          {pixels.map((pixel, index) => {
            let curLayer = layer === pixel.layer

            let x =
              (pixel.x + (curLayer ? moveOffset.x : 0) + viewOffset.x) *
              pixelSize
            let y =
              (pixel.y + (curLayer ? moveOffset.y : 0) + viewOffset.y) *
              pixelSize

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
      {board}

      <div
        className="absolute z-40 pointer-events-none border-[2px] border-red-600"
        style={{
          width: size.width * pixelSize,
          height: size.height * pixelSize,
          top: 0,
          left: 0,
          transform: `translate(${offset.x * pixelSize}px, ${
            offset.y * pixelSize
          }px)`,
        }}
      ></div>
    </div>
  )
}

function DashBoard({
  size,
  viewSize: vSize,
  pixelSize,
}: {
  size: { width: number; height: number }
  viewSize: { width: number; height: number }
  pixelSize: number
}) {
  const viewPixelSize = pixelSize

  const screenSize = useMemo(() => {
    return {
      width: vSize.width * viewPixelSize,
      height: vSize.height * viewPixelSize,
    }
  }, [size])

  const viewSize = useMemo(() => {
    return {
      width: Math.floor(screenSize.width / viewPixelSize),
      height: Math.floor(screenSize.height / viewPixelSize),
    }
  }, [screenSize])

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

  const getGridColor = (color: string, index: number, x: number, y: number) => {
    // reduce clear color for grid shadow display
    let isGray = true
    isGray = (x + y) % 2 == 0
    let size = {
      width: vSize.width - 8,
      height: vSize.height - 8,
    }
    // if in export range
    let pixelRadio = 1
    let startX = (vSize.width - size.width * pixelRadio) / 2
    let endX = startX + size.width * pixelRadio

    let startY = (vSize.height - size.height * pixelRadio) / 2
    let endY = startY + size.height * pixelRadio
    let isInShade = false
    if (x > startX && x < endX && y > startY && y < endY) {
      isInShade = true
    }
    if (!isInShade) {
      if (isGray) {
        return "rgba(125,125,125,0.5)"
      }
      return "rgba(0,0,0,.2)"
    }

    if (isGray) {
      return "rgba(0,0,0,.05)"
    }
    return "rgba(255,255,255,0.5)"
  }
  return (
    <Stage
      className="board-canvas absolute z-0 top-0 left-0 select-none flex items-center justify-center min-w-[320px] min-h-[320px]"
      width={screenSize.width}
      height={screenSize.height}
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
          />
        ))}
      </Layer>
    </Stage>
  )
}
