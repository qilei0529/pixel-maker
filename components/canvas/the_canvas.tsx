"use client"

import { useEffect, useState } from "react"

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
  const getData = useDataStore((state) => state.getData)
  const updatePixelAt = useDataStore((state) => state.updatePixelAt)
  const clearData = useDataStore((state) => state.clearData)

  const [pixels, setPixels] = useState<any[]>([])
  const initData = () => {
    setPixels(getData())
  }

  useEffect(() => {
    console.log("init Data")
    initData()
  }, [])

  const clearAll = () => {
    setPixels(clearData())
  }

  let [curColor, setColor] = useState("black")
  let [tool, setTool] = useState<string>("Pen")

  const handleDraw = (index: number) => {
    let color = tool == "Pen" ? curColor : "clear"
    setPixels(updatePixelAt(index, color))
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
      <ColorPicker color={curColor} onColorChange={setColor} />
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
