import { Stage, Layer, Rect } from "./my_canvas"

export default function BoardCanvas({
  size,
  pixels,
  pixelSize,
  onDraw,
}: {
  size: { width: number; height: number }
  pixels: any[]
  pixelSize: number
  onDraw: (index: number) => void
}) {
  const canvasWidth = size.width * pixelSize
  const canvasHeight = size.height * pixelSize

  const getColor = (color: String, index: number) => {
    // reduce clear color for grid shadow display
    if (color == "clear") {
      const d = Math.floor(index / size.width)
      if ((index + d) % 2 === 1) {
        return "rgba(0,0,0,.1)"
      }
      return "rgba(255,255,255,0.5)"
    }
    return color as any
  }

  return (
    <Stage width={canvasWidth} height={canvasHeight}>
      <Layer>
        {pixels.map((pixel, index) => (
          <Rect
            key={index}
            x={(index % size.width) * pixelSize}
            y={Math.floor(index / size.width) * pixelSize}
            width={pixelSize}
            height={pixelSize}
            fill={getColor(pixel.color, index)}
            onMouseMove={(event) => onDraw(index)}
          />
        ))}
      </Layer>
    </Stage>
  )
}
