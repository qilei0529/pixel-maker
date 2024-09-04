"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ILayerData, useDataStore } from "@/client/stores/data"

import ColorPanel from "./color_panel"
import MiniMapPanel from "./mini_map_panel"
import SavePanel from "./save_button"
import BoardCanvas from "./board_canvas"
import HeadTool from "./head_tool"
import Layout from "./layout"
import { MiniInput } from "./mini_input"
import LayerPanel from "./layer_panel"

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

  const [layer, setLayer] = useState<number>(1)

  const addLayer = useDataStore((state) => state.addLayer)
  const toggleHideLayer = useDataStore((state) => state.toggleHideLayer)
  const moveLayer = useDataStore((state) => state.moveLayer)
  const removeLayer = useDataStore((state) => state.removeLayer)

  useEffect(() => {
    console.log("init Data")
    setPixels(getData())
  }, [pixelSize, size, getData])

  useEffect(() => {
    let index = layers.findIndex((item) => {
      return item.value == layer
    })
    if (index < 0) {
      let first = layers[0]
      setLayer(first.value)
    }
  }, [layers])

  useEffect(() => {
    setPixels(
      Object.keys(pixelMap)
        .map((key) => pixelMap[key])
        .sort((a, b) => a.layer - b.layer)
    )
  }, [pixelMap])

  const clearAll = () => {
    clearData()
    setLayer(1)
  }

  let [curColor, setColor] = useState("black")
  let [tool, setTool] = useState<string>("Pen")
  let [offset, setOffset] = useState({ x: 0, y: 0 })

  const handleDraw = (pos: { x: number; y: number }, index: number) => {
    if (tool === "Pen" || tool == "Eraser") {
      let color = tool == "Pen" ? curColor : "clear"
      updatePixelAt(pos, color, layer)
    }
  }

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
      offset={offset}
      pixels={pixels}
      layer={layer}
      layers={layers}
      pixelSize={pixelSize}
      onDraw={handleDraw}
      onMove={handleMove}
      onMoveEnd={handleMoveEnd}
    />
  )
  let sider = (
    <>
      <ColorPanel color={curColor} onColorChange={setColor} />
      <div className="h-4"></div>
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
      <MiniMapPanel layers={layers} size={size} pixels={pixels} />
      <div className="flex-1"></div>
      <SavePanel layers={layers} size={size} pixels={pixels} />
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
