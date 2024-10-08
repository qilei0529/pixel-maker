"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ILayerData, useDataStore } from "@/client/stores/data"

import ColorPanel from "./color_panel"
import MiniMapPanel from "./mini_map_panel"
import SavePanel from "./save_button"
import BoardCanvas from "./board_canvas"
import HeadTool from "./head_tool"
import Layout from "./layout"
import LayerPanel from "./layer_panel"
import { RectTouchEvent } from "./my_canvas"
import { SizeSwitcher } from "./size_switcher"

export const PixelCanvas = () => {
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

  useEffect(() => {
    console.log("init Data")
    const data = getData()
    setPixels(data)
  }, [pixelSize, size, getData])

  useEffect(() => {
    setPixels(
      Object.keys(pixelMap)
        .map((key) => pixelMap[key])
        .sort((a, b) => a.layer - b.layer)
    )
  }, [pixelMap])

  const clearAll = () => {
    clearData()
  }

  let [curColor, setColor] = useState("black")
  let [tool, setTool] = useState<string>("Pen")
  let [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleDraw = (event: Event, touch: RectTouchEvent) => {
    if (tool === "Pen" || tool == "Eraser") {
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

  const handleMove = (size: { width: number; height: number }) => {
    if (tool !== "Move") {
      return
    }
    let x = Math.floor(size.width / pixelSize)
    let y = Math.floor(size.height / pixelSize)
    setOffset({ x, y })
  }

  const handleMoveEnd = (size: { width: number; height: number }) => {
    if (tool !== "Move") {
      return
    }
    setPixels(movePixels({ x: offset.x, y: offset.y }, layer))
    setOffset({ x: 0, y: 0 })
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
      setPixelSize(6)
    } else if (d > 24) {
      setPixelSize(10)
    } else if (d > 20) {
      setPixelSize(14)
    } else if (d > 15) {
      setPixelSize(20)
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
      offset={offset}
      pixels={pixels}
      layer={layer}
      layers={layers}
      pixelSize={pixelSize}
      onDraw={handleDraw}
      onDrawEnd={handleDrawEnd}
      onMove={handleMove}
      onMoveEnd={handleMoveEnd}
    />
  )
  let sider = (
    <>
      <div className="">
        <ColorPanel color={curColor} onColorChange={setColor} />
      </div>
      <div className="flex-1 h-4"></div>
      <div className="w-[132px] sm:w-auto">
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
    </>
  )
  let rightPanel = (
    <>
      <div className="w-[120px] sm:w-auto flex flex-row justify-center items-center">
        <SizeSwitcher size={size} onChange={updateSize} />
      </div>
      <div className="flex-1"></div>
      <div>
        <MiniMapPanel layers={layers} size={size} pixels={pixels} />
      </div>
      <div className="flex-1"></div>
      <div className="w-[120px] sm:w-auto flex flex-row justify-center items-center">
        <SavePanel layers={layers} size={size} pixels={pixels} />
      </div>
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

              // const img = new Image()
              // img.onload = () => {
              //   // 图片加载后获取像素信息
              //   const canvas = document.createElement("canvas")
              //   const context = canvas.getContext("2d")

              //   if (context) {
              //     canvas.width = img.width
              //     canvas.height = img.height
              //     context.drawImage(img, 0, 0)

              //     // 提取像素信息
              //     const imageData = context.getImageData(
              //       0,
              //       0,
              //       img.width,
              //       img.height
              //     )
              //     console.log("have imageData.data")
              //     console.log(imageData.data) // 包含 RGBA 像素信息的数组
              //   }
              // }
              // img.src = imageUrl
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
