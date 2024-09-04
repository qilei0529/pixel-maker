import { useDataStore } from "@/client/stores/data"
import { useRef, useState } from "react"
import { Layer, Rect, Stage } from "./my_canvas"

export default function SavePanel({
  size,
  pixels,
}: {
  size: { width: number; height: number }
  pixels: any[]
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

  return (
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
          width={exportRatio * size.width}
          height={exportRatio * size.height}
        >
          <Layer>
            {pixels.map((pixel, index) => (
              <Rect
                key={index}
                x={pixel.x * exportRatio}
                y={pixel.y * exportRatio}
                width={exportRatio}
                height={exportRatio}
                fill={pixel.color === "clear" ? "rgba(0,0,0,.0)" : pixel.color}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
