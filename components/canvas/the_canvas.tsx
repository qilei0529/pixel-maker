"use client"

import { cn } from "@/lib/utils"
import { Icons } from "@/shared/icons"
import { useMemo, useRef, useState } from "react"

import { Stage, Layer, Rect } from "./my_canvas"
import ColorPicker from "./color_panel"
import MiniMapPanel from "./mini_map_panel"

const PixelCanvas = () => {
  const pixelSize = 20

  const [size, setSize] = useState([16, 16])

  const canvasWidth = size[0] * pixelSize
  const canvasHeight = size[1] * pixelSize

  const boardSize = useMemo(() => {
    let width = Math.max(size[0], size[1]) * pixelSize
    if (width > 640) {
      return 640
    }
    if (width < 400) {
      return 400
    }
    return width
  }, [size])

  const [pixels, setPixels] = useState(
    Array.from({ length: size[0] * size[1] }, () => ({ color: "clear" }))
  )

  const [isDrawing, setIsDrawing] = useState(false)
  const handleMouseDown = () => {
    setIsDrawing(true)
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const handleMouseMove = (event: any, index: number) => {
    if (!isDrawing) return
    const newPixels = [...pixels]
    let color = tool == "Pen" ? curColor : "clear"
    newPixels[index].color = color // 或者用户选择的颜色
    setPixels(newPixels)
  }
  const stageRef = useRef<any>(null) // 使用 useRef 来获取 Stage 的引用

  const clearAll = () => {
    const newPixels = [...pixels]
    newPixels.forEach((item) => {
      item.color = "clear"
    })
    setPixels(newPixels)
  }

  const handleSave = () => {
    const uri = stageRef.current.toDataURL() // 导出为 data URL
    downloadURI(
      uri,
      `pixel-${exportRatio * size[0]}x${exportRatio * size[1]}.png`
    ) // 调用下载函数
  }
  const downloadURI = (uri: string, name: string) => {
    const link = document.createElement("a")
    link.download = name
    link.href = uri
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  let [curColor, setColor] = useState("black")
  let [tool, setTool] = useState<string>("Pen")

  const getColor = (color: String, index: number) => {
    // reduce clear color for grid shadow display
    if (color == "clear") {
      const d = Math.floor(index / size[0])
      if ((index + d) % 2 === 1) {
        return "rgba(0,0,0,.1)"
      }
      return "rgba(255,255,255,0.5)"
    }
    return color as any
  }

  let sizeBarWidth = 180

  let [exportRatio, setExportRatio] = useState(2)

  return (
    <div className="flex flex-col space-y-2">
      <div className="tool-bar h-[60px] flex flex-row">
        <div
          style={{
            width: sizeBarWidth + 40,
          }}
        ></div>
        <div
          className="flex flex-row space-x-2"
          style={{
            width: boardSize,
          }}
        >
          <div
            className={cn(
              "w-[40px] h-[40px] flex items-center justify-center",
              tool === "Pen" ? "bg-red-200" : "bg-gray-200 opacity-50"
            )}
            onClick={() => setTool("Pen")}
          >
            <div
              className="w-7 h-7"
              style={{
                backgroundColor: curColor,
              }}
            ></div>
          </div>
          <div
            className={cn(
              "w-[40px] h-[40px] flex items-center justify-center  cursor-pointer",
              tool === "Pen" ? "bg-red-200" : "bg-gray-200"
            )}
            onClick={() => setTool("Pen")}
          >
            <Icons.pencel strokeWidth={2.5} className="relative w-5 h-5" />
          </div>
          <div
            className={cn(
              "w-[40px] h-[40px] flex items-center justify-center  cursor-pointer",
              tool === "Eraser" ? "bg-red-200" : "bg-gray-200 hover:bg-red-200"
            )}
            onClick={() => setTool("Eraser")}
          >
            <Icons.eraser strokeWidth={2.5} className="relative w-5 h-5" />
          </div>
          <div className="flex-1"></div>
          <div
            className={cn(
              "w-[40px] h-[40px] flex items-center justify-center bg-gray-200",
              tool === "Eraser"
                ? "bg-red-200 hover:bg-red-400 cursor-pointer"
                : "opacity-50 "
            )}
            onClick={() => {
              if (tool === "Eraser") {
                clearAll()
                setTool("Pen")
              }
            }}
          >
            <Icons.brush strokeWidth={2.5} className="relative w-5 h-5" />
          </div>
        </div>
      </div>
      <div className="relative bg-gray-100 flex flex-row">
        <div
          style={{
            width: sizeBarWidth,
          }}
        >
          <div className="text-[13px] font-semibold">Colors</div>
          <ColorPicker
            color={curColor}
            onSelect={(color: string) => {
              //
              setColor(color)
            }}
          />
        </div>
        <div
          className="w-[40px] bg-gray-50"
          style={{
            height: boardSize,
          }}
        ></div>
        <div
          className="board flex items-center justify-center"
          style={{
            width: boardSize,
            height: boardSize,
          }}
        >
          <Stage width={canvasWidth} height={canvasHeight}>
            <Layer>
              {pixels.map((pixel, index) => (
                <Rect
                  key={index}
                  x={(index % size[0]) * pixelSize}
                  y={Math.floor(index / size[0]) * pixelSize}
                  width={pixelSize}
                  height={pixelSize}
                  fill={getColor(pixel.color, index)}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseMove={(event) => handleMouseMove(event, index)}
                />
              ))}
            </Layer>
          </Stage>
        </div>
        <div
          className="w-[40px] bg-gray-50"
          style={{
            height: boardSize,
          }}
        ></div>
        <div className="flex flex-col items-center justify-center px-4 space-y-2">
          <div className="h-[100px]"></div>
          <div className="flex-1"></div>
          <MiniMapPanel size={size} pixels={pixels} />
          <div className="flex-1"></div>
          <div className="relative h-[120px] flex flex-col space-y-2 pb-4">
            <div className="flex-1"></div>
            <select
              className="p-1 px-2 rounded-lg text-[12px]"
              value={exportRatio}
              onChange={(e) => setExportRatio(parseInt(e.target.value, 10))}
            >
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
              <option value={4}>4x</option>
              <option value={8}>8x</option>
              <option value={16}>16x</option>
            </select>
            <button
              className="p-1 px-2 bg-black hover:bg-blue-600 rounded-xl text-white text-[14px] font-semibold"
              onClick={handleSave}
            >
              Save <span className="text-[10px]">.png</span>
            </button>
            <div className="absolute top-0 left-0 hidden">
              <Stage
                ref={stageRef}
                className=" bg-white"
                width={exportRatio * size[0]}
                height={exportRatio * size[1]}
              >
                <Layer>
                  {pixels.map((pixel, index) => (
                    <Rect
                      key={index}
                      x={(index % size[0]) * exportRatio}
                      y={Math.floor(index / size[1]) * exportRatio}
                      width={exportRatio}
                      height={exportRatio}
                      fill={
                        pixel.color === "clear" ? "rgba(0,0,0,.0)" : pixel.color
                      }
                    />
                  ))}
                </Layer>
              </Stage>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TheCanvas() {
  return (
    <div className="w-screen h-screen bg-gray-50 relative flex items-center justify-center">
      <PixelCanvas />
    </div>
  )
}
