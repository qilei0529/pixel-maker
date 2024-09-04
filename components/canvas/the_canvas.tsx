"use client"

import { useEffect, useRef, useState } from "react"
import { useDataStore } from "@/client/stores/data"

import ColorPicker from "./color_panel"
import MiniMapPanel from "./mini_map_panel"
import SavePanel from "./save_button"
import BoardCanvas from "./board_canvas"
import HeadTool from "./head_tool"
import Layout from "./layout"
import { Input } from "../ui/input"

export const PixelCanvas = () => {
  const size = useDataStore((state) => state.size)
  const pixelSize = useDataStore((state) => state.pixelSize)
  const getData = useDataStore((state) => state.getData)
  const updatePixelAt = useDataStore((state) => state.updatePixelAt)
  const clearData = useDataStore((state) => state.clearData)
  const setSize = useDataStore((state) => state.setSize)
  const setPixelSize = useDataStore((state) => state.setPixelSize)

  const [pixels, setPixels] = useState<any[]>([])

  useEffect(() => {
    console.log("init Data")
    setPixels(getData())
  }, [pixelSize, size, getData])

  const clearAll = () => {
    setPixels(clearData())
  }

  let [curColor, setColor] = useState("black")
  let [tool, setTool] = useState<string>("Pen")

  const handleDraw = (index: number) => {
    let color = tool == "Pen" ? curColor : "clear"
    setPixels(updatePixelAt(index, color))
  }

  const updateSize = ({
    width,
    height,
  }: {
    width?: number
    height?: number
  }) => {
    // check
    const size = useDataStore.getState().size

    let d = Math.max(width ?? 0, height ?? 0)

    if (d > 40) {
      setPixelSize(8)
    } else if (d > 30) {
      setPixelSize(12)
    } else if (d > 20) {
      setPixelSize(16)
    } else {
      setPixelSize(20)
    }

    let limit = (v: number) => {
      return Math.max(0, Math.min(64, v))
    }

    setSize({
      width: width ? limit(width) : size.width,
      height: width ? limit(width) : size.width,
    })
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
      <div className="h-[100px]">
        <div className="h-2"></div>
        <div className="flex flex-row justify-center">
          <MiniInput
            value={size.width}
            className="w-[32px] text-center"
            onConfirm={(elm) => {
              let value = parseInt(elm.value, 10)
              updateSize({
                width: value,
              })
            }}
          />
          <span className="w-4 flex items-center justify-center">x</span>
          <MiniInput
            value={size.height}
            className="w-[32px] text-center"
            onConfirm={(elm) => {
              let value = parseInt(elm.value, 10)
              updateSize({
                width: value,
              })
            }}
          />
        </div>
      </div>
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

export function MiniInput({
  onConfirm,
  value,
  ...others
}: {
  onConfirm: (event: HTMLInputElement) => void
  value?: string | number
  className?: string
  placeholder?: string
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = `${value}`
    }
    setValue(value)
  }, [value])

  const [inputValue, setValue] = useState(value)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        // 回车键被按下
        console.log("Enter key pressed!", inputRef.current)
        // 在这里执行你想要触发的事件逻辑
        if (inputRef.current) {
          onConfirm(inputRef.current)
          inputRef.current.value = ""
        }
      }
    }
    const handleFocus = () => {
      document.addEventListener("keydown", handleKeyPress)
    }
    const handleBlur = () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
    const inputElement = inputRef.current
    if (inputElement) {
      inputElement.addEventListener("focus", handleFocus)
      inputElement.addEventListener("blur", handleBlur)
    }
    return () => {
      if (inputElement) {
        inputElement.removeEventListener("focus", handleFocus)
        inputElement.removeEventListener("blur", handleBlur)
      }
    }
  }, [])

  return (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={(e) => setValue(e.target.value)}
      {...others}
    />
  )
}
