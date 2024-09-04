"use client"

import { useState } from "react"

import { Stage, Layer, Rect } from "./my_canvas"

const sixteenColorPalette = [
  "#000000", // Black
  "#555555", // Dark Gray
  "#AAAAAA", // Light Gray
  "#FFFFFF", // White
  "#AA0000", // Red
  "#FF5555", // Light Red
  "#AA5500", // Brown
  "#FFFF55", // Yellow
  "#00AA00", // Green
  "#55FF55", // Light Green
  "#00AAAA", // Cyan
  "#55FFFF", // Light Cyan
  "#0000AA", // Blue
  "#5555FF", // Light Blue
  "#AA00AA", // Magenta
  "#FF55FF", // Light Magenta
]

export default function ColorPicker({
  color: curColor,
  onSelect,
}: {
  color: string
  onSelect: (color: string) => void
}) {
  let [colors, setColors] = useState<string[]>(sixteenColorPalette)

  let curIndex = colors.indexOf(curColor)
  let colorSize = 30
  let panelWidth = 180
  let cols = panelWidth / colorSize
  let rows = Math.floor(colors.length / cols) + 1
  let panelHeight = rows * colorSize
  return (
    <div
      className="flex flex-row flex-wrap bg-white"
      style={{
        height: panelHeight,
      }}
    >
      <Stage width={panelWidth} height={panelHeight}>
        <Layer>
          {colors.map((color, index) => (
            <Rect
              key={index}
              x={(index % cols) * colorSize}
              y={Math.floor(index / cols) * colorSize}
              width={colorSize}
              height={colorSize}
              fill={color}
              onClick={() => onSelect(color)}
              onMouseMove={() => onSelect(color)}
            />
          ))}

          {curIndex > -1 ? (
            <Rect
              x={(curIndex % cols) * colorSize + 1}
              y={Math.floor(curIndex / cols) * colorSize + 1}
              width={colorSize - 2}
              height={colorSize - 2}
              fill={curColor}
              stroke="black"
              strokeWidth={2}
            />
          ) : null}
        </Layer>
      </Stage>
    </div>
  )
}
