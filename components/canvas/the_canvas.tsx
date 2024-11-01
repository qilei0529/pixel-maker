"use client"

import { useEffect, useState } from "react"
import { useDataStore } from "@/client/stores/data"

import { cn } from "@/lib/utils"
import { Icons } from "@/shared/icons"

import ColorPanel from "./color_panel"
import MiniMapPanel from "./mini_map_panel"
import SavePanel from "./save_button"
import BoardCanvas from "./board_canvas"
import HeadTool from "./head_tool"
import Layout from "./layout"
import LayerPanel from "./layer_panel"
import { RectTouchEvent } from "./my_canvas"
import { SizeSwitcher } from "./size_switcher"
import { ColorPickerPanel } from "./color_picker"

export const PixelCanvas = () => {
  const tool = useDataStore((state) => state.tool)
  const setTool = useDataStore((state) => state.setTool)
  const size = useDataStore((state) => state.size)
  const pixelMap = useDataStore((state) => state.pixelMap)
  const pixelSize = useDataStore((state) => state.pixelSize)
  const getData = useDataStore((state) => state.getData)
  const updatePixelAt = useDataStore((state) => state.updatePixelAt)
  const clearData = useDataStore((state) => state.clearData)
  const setSize = useDataStore((state) => state.setSize)
  const setPixelSize = useDataStore((state) => state.setPixelSize)

  const movePixels = useDataStore((state) => state.movePixels)

  const [pixels, setPixels] = useState<any[]>([])

  const layers = useDataStore((state) => state.layers)

  const layer = useDataStore((state) => state.layer)
  const addLayer = useDataStore((state) => state.addLayer)
  const setLayer = useDataStore((state) => state.setLayer)
  const toggleHideLayer = useDataStore((state) => state.toggleHideLayer)
  const moveLayer = useDataStore((state) => state.moveLayer)
  const removeLayer = useDataStore((state) => state.removeLayer)

  const viewPixelSize = 16

  // MARK: init data
  useEffect(() => {
    const data = getData()
    setPixels(data)
    setPixelSize(16)
  }, [pixelSize, size, getData, setPixelSize])

  useEffect(() => {
    setPixels(
      Object.keys(pixelMap)
        .map((key) => pixelMap[key])
        .sort((a, b) => a.layer - b.layer)
    )
    if (window.innerWidth > 600) {
      setShowSide(true)
    }
  }, [pixelMap])
  const clearAll = () => {
    clearData()
  }

  const [curColor, setColor] = useState("black")
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 })
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 })

  const handleDraw = (event: Event, touch: RectTouchEvent) => {
    if (isDrawing(tool)) {
      let color = tool == "Pen" ? curColor : "clear"
      if (touch.type == "pen" && tool === "Pen") {
        // check if button is 5 , 5 is Eraser
        let touchTool = touch.button == 5 ? "Eraser" : "Pen"
        color = touchTool == "Pen" ? curColor : "clear"
      }
      updatePixelAt({ x: touch.x, y: touch.y }, color, layer)
    }
  }
  const handleDrawEnd = (event: Event, touch: RectTouchEvent) => {}

  const isDrawing = (tool: string | "Pen" | "Eraser" | "Move" | "Hand") => {
    return tool === "Pen" || tool == "Eraser"
  }

  const handleMove = (size: { width: number; height: number }) => {
    if (isDrawing(tool)) {
      return
    }
    let x = Math.floor(size.width / pixelSize)
    let y = Math.floor(size.height / pixelSize)
    if (tool == "Move") {
      setMoveOffset({ x, y })
    } else {
      setViewOffset({ x: x, y: y })
    }
  }

  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleMoveEnd = (size: { width: number; height: number }) => {
    if (isDrawing(tool)) {
      return
    }
    if (tool == "Move") {
      setPixels(movePixels({ x: moveOffset.x, y: moveOffset.y }, layer))
      setMoveOffset({ x: 0, y: 0 })
    } else {
      setOffset({ x: offset.x + viewOffset.x, y: viewOffset.y + offset.y })
      setViewOffset({ x: 0, y: 0 })
    }
  }

  const [viewSize, setViewSize] = useState({ width: 0, height: 0 })

  const [showSide, setShowSide] = useState(false)

  useEffect(() => {
    const width = window.innerWidth
    const height = window.innerHeight - 40
    const grid = viewPixelSize

    const w = Math.floor(width / grid)
    const h = Math.floor(height / grid)
    setViewSize({
      width: w,
      height: h,
    })
  }, [])

  const updateSize = ({
    width,
    height,
  }: {
    width?: number
    height?: number
  }) => {
    // check
    const size = useDataStore.getState().size
    setPixelSize(10)

    let limit = (v: number) => {
      return Math.max(0, Math.min(64, v))
    }

    setSize({
      width: width ? limit(width) : size.width,
      height: height ? limit(height) : size.height,
    })
  }

  const [showColorPicker, setShowColorPicker] = useState(false)

  let header = (
    <div className="relative flex flex-row space-x-2 p-3 pt-0 bg-white rounded-b-2xl shadow-black-200 shadow-lg">
      <HeadTool
        color={curColor}
        tool={tool}
        onToolChange={setTool}
        onAction={(type) => {
          if (type === "Clear") {
            clearAll()
          } else if (type === "Color") {
            setShowColorPicker(!showColorPicker)
            if (tool != "Pen") {
              setTool("Pen")
            }
          }
        }}
      />
      <div
        className={cn(
          "absolute top-[60px] left-[-30px]",
          showColorPicker ? "block" : "hidden"
        )}
      >
        <ColorPickerPanel
          color={curColor}
          onChange={(val) => {
            console.log(val)
            setColor(val.hex)
          }}
        />
      </div>
    </div>
  )

  let content = (
    <>
      <BoardCanvas
        size={size}
        moveOffset={moveOffset}
        viewSize={viewSize}
        viewPixelSize={viewPixelSize}
        viewOffset={{ x: viewOffset.x + offset.x, y: viewOffset.y + offset.y }}
        pixels={pixels}
        layer={layer}
        layers={layers}
        pixelSize={pixelSize}
        onDraw={handleDraw}
        onDrawEnd={handleDrawEnd}
        onMove={handleMove}
        onMoveEnd={handleMoveEnd}
      />
      {/* mask */}
      {showColorPicker ? (
        <div
          onClick={() => {
            setShowColorPicker(false)
          }}
          className="absolute top-[40px] left-0 right-0 bottom-0 bg-black opacity-20 z-10"
        ></div>
      ) : null}
    </>
  )

  let sider = (
    <>
      <div
        className={cn(
          "bg-gray-200 rounded-r-2xl h-[40px] flex flex-row items-center justify-center  shadow-black-200 shadow-lg",
          showSide ? "w-[60px] pl-[20px] text-black" : "w-[40px] text-black"
        )}
        onClick={() => {
          setShowSide(!showSide)
        }}
      >
        {showSide ? (
          <Icons.sideOpen className="w-5 h-5" />
        ) : (
          <Icons.sideFold className="w-5 h-5" />
        )}
      </div>
      <div
        className={cn(
          "flex flex-col flex-1 p-3 bg-white rounded-r-2xl shadow-black-200 shadow-lg",
          showSide ? "flex" : "hidden"
        )}
      >
        <div className="">
          <ColorPanel color={curColor} onColorChange={setColor} />
        </div>
        <div className="flex-1 h-4"></div>
        <div className="">
          <LayerPanel
            layer={layer}
            layers={layers}
            onCreateLayer={() => {
              addLayer()
            }}
            onSelectLayer={(layer) => {
              setLayer(layer)
            }}
            onRemoveLayer={(layer) => {
              //
              removeLayer(layer)
            }}
            onToggleHide={(layer) => {
              //
              toggleHideLayer(layer)
            }}
            onToggleLevel={(layer, index) => {
              //
              moveLayer(layer, index)
            }}
          />
        </div>
        <div className="h-[20px]"></div>
        <div className="bg-gray-200">
          <div className="flex flex-row justify-center items-center p-2">
            <SizeSwitcher size={size} onChange={updateSize} />
          </div>
          <div className=" p-2">
            <MiniMapPanel
              layers={layers}
              size={size}
              pixels={pixels}
              offset={offset}
            />
          </div>
          <div className="flex flex-row justify-center items-center p-2">
            <SavePanel
              layers={layers}
              size={size}
              pixels={pixels}
              offset={offset}
            />
          </div>
        </div>
      </div>
    </>
  )

  let rightPanel = <></>

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

function ParseCanvas() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      const clipboardItems = event.clipboardData?.items

      if (clipboardItems) {
        for (let i = 0; i < clipboardItems.length; i++) {
          const item = clipboardItems[i]

          // 如果剪贴板中的项目是图片
          if (item.type.startsWith("image/")) {
            const blob = item.getAsFile()
            if (blob) {
              const imageUrl = URL.createObjectURL(blob)

              // 设置图片 URL 到 state 以便展示图片
              setImageSrc(imageUrl)
            }
          }
        }
      }
    }

    window.addEventListener("paste", handlePaste)

    return () => {
      window.removeEventListener("paste", handlePaste)
    }
  }, [])
  return (
    <div>
      <h1>Paste an image here</h1>
      {imageSrc ? (
        <img src={imageSrc} alt="Pasted" style={{ maxWidth: "100%" }} />
      ) : (
        <p>No image pasted yet</p>
      )}
    </div>
  )
}
