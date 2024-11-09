"use client"

import { useEffect, useMemo, useState } from "react"
import { useDataStore } from "@/client/stores/data"

import { cn } from "@/lib/utils"
import { Icons } from "@/shared/icons"

import ColorPanel from "./color_panel"
import MiniMapPanel from "./mini_map_panel"
import SavePanel from "./save_button"
import BoardCanvas from "./board_canvas"
import HeadTool, { ToolIcon } from "./head_tool"
import Layout from "./layout"
import LayerPanel from "./layer_panel"
import { RectTouchEvent } from "./my_canvas"
import { SizeSwitcher } from "./size_switcher"
import { ColorPickerPanel } from "./color_picker"
import { CutterPanel } from "./cutter_panel"

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

  // MARK: init data
  useEffect(() => {
    const data = getData()
    setPixels(data)
    setPixelSize(16)
  }, [getData, setPixelSize])

  const viewPixelSize = useMemo(() => {
    if (pixelSize <= 8) {
      return 8
    }
    return 16
  }, [pixelSize])

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
    clearData(layer)
  }

  const togglePixelSize = (flag: number) => {
    const pixelMap = [2, 4, 8, 16, 32]
    const index = pixelMap.indexOf(pixelSize)

    let targetIndex = Math.min(Math.max(index + flag, 0), pixelMap.length - 1)
    let targetVal = pixelMap[targetIndex]
    console.log(targetIndex, targetVal)
    setPixelSize(targetVal)
  }

  const [curColor, setColor] = useState("black")

  const [viewSize, setViewSize] = useState({ width: 0, height: 0 })
  // total layer offset
  // const [offset, setOffset] = useState({ x: 0, y: 0 })
  const offset = useDataStore((state) => state.offset)
  const setOffset = useDataStore((state) => state.setOffset)
  // move offset
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 })

  // 居中偏移
  const [midOffset, setMidOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    let ratio = pixelSize / viewPixelSize
    setMidOffset({
      x: Math.floor((viewSize.width / ratio - size.width) / 2),
      y: Math.floor((viewSize.height / ratio - size.height) / 2),
    })
  }, [size, viewSize, pixelSize, viewPixelSize])

  // 切片偏移位置
  const [cutOffset, setCutOffset] = useState({ x: 0, y: 0 })

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
    setMoveOffset({ x, y })
  }

  const handleMoveEnd = (size: { width: number; height: number }) => {
    if (isDrawing(tool)) {
      return
    }
    if (tool == "Move") {
      setPixels(movePixels({ x: moveOffset.x, y: moveOffset.y }, layer))
      setMoveOffset({ x: 0, y: 0 })
    } else if (tool == "Cutter") {
      setCutOffset({
        x: cutOffset.x + moveOffset.x,
        y: cutOffset.y + moveOffset.y,
      })
    } else {
      setOffset({ x: offset.x + moveOffset.x, y: offset.y + moveOffset.y })
    }
    setMoveOffset({ x: 0, y: 0 })
  }

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
  }, [viewPixelSize])

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
      <div
        className={cn(
          "absolute top-[52px] left-[136px]",
          tool === "Hand" ? "block" : "hidden"
        )}
      >
        <div className="px-3 pb-3 flex flex-row items-center justify-center bg-white rounded-b-2xl shadow-black-200 shadow-lg">
          <ToolIcon
            icon={
              <Icons.zoomOut strokeWidth={2.5} className="relative w-5 h-5" />
            }
            onClick={() => togglePixelSize(-1)}
            selected={false}
            label=""
          />
          <div className="w-[56px] text-center text-[12px]">{pixelSize}px</div>
          <ToolIcon
            icon={
              <Icons.zoomIn strokeWidth={2.5} className="relative w-5 h-5" />
            }
            onClick={() => togglePixelSize(1)}
            selected={false}
            label=""
          />
        </div>
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
        viewOffset={{
          x: offset.x + midOffset.x,
          y: offset.y + midOffset.y,
        }}
        pixels={pixels}
        layer={layer}
        layers={layers}
        pixelSize={pixelSize}
        onDraw={handleDraw}
        onDrawEnd={handleDrawEnd}
        onMove={handleMove}
        onMoveEnd={handleMoveEnd}
        tool={tool}
      >
        <CutterPanel
          tool={tool}
          size={size}
          pixelSize={pixelSize}
          offset={{
            x:
              cutOffset.x + midOffset.x + (tool == "Cutter" ? moveOffset.x : 0),
            y:
              cutOffset.y + midOffset.y + (tool == "Cutter" ? moveOffset.y : 0),
          }}
        />
      </BoardCanvas>
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
              offset={{
                x: offset.x - cutOffset.x,
                y: offset.y - cutOffset.y,
              }}
            />
          </div>
          <div className="flex flex-row justify-center items-center p-2">
            <SavePanel
              layers={layers}
              size={size}
              pixels={pixels}
              offset={{
                x: offset.x - cutOffset.x,
                y: offset.y - cutOffset.y,
              }}
            />
          </div>
        </div>
      </div>
    </>
  )

  let rightPanel = <></>

  return (
    <Layout
      header={header}
      content={content}
      sider={sider}
      rightPanel={rightPanel}
    />
  )
}
