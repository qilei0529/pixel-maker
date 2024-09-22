import { useDataStore } from "@/client/stores/data"
import { useMemo, useRef, useState } from "react"
import { Layer, Rect, Stage } from "./my_canvas"

export default function SavePanel({
  size,
  pixels,
  layers,
}: {
  size: { width: number; height: number }
  pixels: any[]
  layers: any[]
}) {
  const stageRef = useRef<any>(null) // 使用 useRef 来获取 Stage 的引用

  let [exportRatio, setExportRatio] = useState(2)

  const handleSave = () => {
    const uri = stageRef.current.toDataURL() // 导出为 data URL
    downloadURI(
      uri,
      `pixel-${exportRatio * size.width}x${exportRatio * size.height}.png`
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

  const layerVos = useMemo(() => {
    let vos: any = {}
    layers.forEach((item) => {
      vos[item.value] = item
    })
    return vos
  }, [layers])

  return (
    <div className="relative flex flex-row sm:flex-col space-x-1">
      <select
        className="p-1 px-2 rounded-lg text-[14px]"
        value={exportRatio}
        onChange={(e) => setExportRatio(parseInt(e.target.value, 10))}
      >
        <option value={1}>1x</option>
        <option value={2}>2x</option>
        <option value={3}>3x</option>
        <option value={4}>4x</option>
      </select>
      <button
        className="p-1 px-2 bg-black hover:bg-blue-600 rounded-xl text-white text-[14px] font-semibold"
        onClick={handleSave}
      >
        Save
      </button>
      <div className="absolute top-0 left-0 hidden">
        <Stage
          ref={stageRef}
          className=" bg-white"
          width={exportRatio * size.width}
          height={exportRatio * size.height}
        >
          <Layer>
            {pixels.map((pixel, index) => {
              // check curLayer ishide
              let layerItem = layerVos[pixel.layer]
              let hide = layerItem?.hide
              return (
                <Rect
                  key={index}
                  x={pixel.x * exportRatio}
                  y={pixel.y * exportRatio}
                  width={exportRatio}
                  height={exportRatio}
                  fill={
                    pixel.color === "clear" || hide
                      ? "rgba(0,0,0,.0)"
                      : pixel.color
                  }
                />
              )
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
