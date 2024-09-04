"use client"

import { useEffect, useMemo, useRef } from "react"

import { Stage, Layer, Rect } from "./my_canvas"
import { useConfigStore } from "@/client/stores/config"
import { Icons } from "@/shared/icons"

export default function ColorPanel({
  color,
  onColorChange,
}: {
  color: string
  onColorChange: (color: string) => void
}) {
  const panelColors = useConfigStore((state) => state.panelColors)
  const customColors = useConfigStore((state) => state.customColors)

  const initColor = useConfigStore((state) => state.initColor)
  const addColor = useConfigStore((state) => state.appendColor)
  const clearColor = useConfigStore((state) => state.clearCustomColor)

  const colors = useMemo(() => {
    return panelColors.concat(customColors)
  }, [panelColors, customColors])

  useEffect(() => {
    initColor()
  })
  return (
    <>
      <div className="flex flex-row h-[32px] items-center text-[13px] font-semibold px-1">
        <span>Colors</span>
        <div className="flex-1"></div>
        <ColorAppender onCreate={(color) => addColor([color])} />
      </div>
      <ColorPicker
        color={color}
        colors={panelColors}
        onSelect={onColorChange}
      />
      {customColors.length > 0 && (
        <>
          <div className="flex flex-row h-[32px] items-center text-[13px] font-semibold px-1">
            <span>My Colors</span>
            <div className="flex-1"></div>
            <div
              className="w-6 h-6 flex items-center justify-center"
              onClick={() => clearColor()}
            >
              <Icons.trash className="w-4 h-4" />
            </div>
          </div>
          <ColorPicker
            color={color}
            colors={customColors}
            onSelect={onColorChange}
          />
        </>
      )}
    </>
  )
}

export function ColorAppender({
  onCreate,
}: {
  onCreate: (color: string) => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleColorCreate = () => {
    if (!inputRef.current) {
      return
    }
    // MARK: GEN
    // 处理 inputRef 的 value
    // 匹配 颜色信息 格式是 #FF0099
    // 如果 是 6位的话，前面加上 #
    // 另外 也有可能 是 类似 rgba(0,0,0,0) 的格式 帮我处理一下
    const inputValue = inputRef.current.value.trim()
    const colorRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    const rgbaRegex = /^rgba?\((\d{1,3}),(\d{1,3}),(\d{1,3}),([01]|0?\.\d+)\)$/

    let output = ""
    if (colorRegex.test(inputValue)) {
      const color = inputValue.length === 6 ? `#${inputValue}` : inputValue
      console.log(color) // 输出处理后的颜色值
      output = color
    } else if (rgbaRegex.test(inputValue)) {
      const match: RegExpMatchArray | null = rgbaRegex.exec(inputValue)
      if (match) {
        const r = parseInt(match[1], 10)
        const g = parseInt(match[2], 10)
        const b = parseInt(match[3], 10)
        const a = parseFloat(match[4])
        const color = `rgba(${r},${g},${b},${a})`
        console.log(color) // 输出处理后的 rgba 值
        output = color
      }
    }

    if (output) {
      onCreate(output)
      inputRef.current.value = ""
    } else {
      console.log("格式不正确")
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        // 回车键被按下
        console.log("Enter key pressed!", inputRef.current)
        // 在这里执行你想要触发的事件逻辑
        if (inputRef.current) {
          handleColorCreate()
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
    <div className="options">
      <input ref={inputRef} placeholder="#000000" className="w-[68px] px-1" />
    </div>
  )
}

export function ColorPicker({
  color: curColor,
  colors,
  onSelect,
}: {
  color: string
  colors: string[]
  onSelect: (color: string) => void
}) {
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
