"use client"

import { useState } from "react"

import { useDataStore } from "@/client/stores/data"

import ColorPicker from "./color_panel"
import MiniMapPanel from "./mini_map_panel"
import SavePanel from "./save_button"
import BoardCanvas from "./board_canvas"
import HeadTool from "./head_tool"
import Layout from "./layout"

export const PixelCanvas = () => {
  const pixelSize = 20
  const size = useDataStore((state) => state.size)

  const [pixels, setPixels] = useState(
    Array.from({ length: size.width * size.height }, () => ({ color: "clear" }))
  )

  const clearAll = () => {
    const newPixels = [...pixels]
    newPixels.forEach((item) => {
      item.color = "clear"
    })
    setPixels(newPixels)
  }

  let [curColor, setColor] = useState("black")
  let [tool, setTool] = useState<string>("Pen")

  const handleDraw = (index: number) => {
    const newPixels = [...pixels]
    let color = tool == "Pen" ? curColor : "clear"
    newPixels[index].color = color // 或者用户选择的颜色
    setPixels(newPixels)
  }

  let header = (
    <HeadTool
      color={curColor}
      tool={tool}
      onToolChange={setTool}
      onAction={(type) => {
        if (type === "Clear") {
          clearAll()
        }
      }}
    />
  )

  let content = (
    <BoardCanvas
      size={size}
      pixels={pixels}
      pixelSize={pixelSize}
      onDraw={handleDraw}
    />
  )
  let sider = (
    <>
      <div className="text-[13px] font-semibold">Colors</div>
      <ColorPicker color={curColor} onSelect={setColor} />
    </>
  )
  let rightPanel = (
    <>
      <div className="h-[100px]"></div>
      <div className="flex-1"></div>
      <MiniMapPanel size={size} pixels={pixels} />
      <div className="flex-1"></div>
      <SavePanel size={size} pixels={pixels} />
    </>
  )

  return (
    <Layout
      size={size}
      pixelSize={pixelSize}
      header={header}
      content={content}
      sider={sider}
      rightPanel={rightPanel}
    />
  )
}
