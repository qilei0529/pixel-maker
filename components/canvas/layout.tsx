import { useMemo } from "react"

export default function Layout({
  size,
  pixelSize,

  header,
  content,
  sider,
  rightPanel,
}: {
  size: { width: number; height: number }
  pixelSize: number

  header?: any
  content?: any
  sider?: any
  rightPanel?: any
}) {
  let sizeBarWidth = 180
  const boardSize = useMemo(() => {
    let width = Math.max(size.width, size.height) * pixelSize
    if (width > 640) {
      return 640
    }
    if (width < 400) {
      return 400
    }
    return width
  }, [size])
  return (
    <div className="flex flex-col space-y-2">
      <div className="tool-bar h-[60px] flex flex-row">
        <div
          style={{
            width: sizeBarWidth + 40,
          }}
        ></div>
        <div
          className="flex flex-row space-x-2"
          style={{
            width: boardSize,
          }}
        >
          {header}
        </div>
      </div>
      <div className="relative bg-gray-100 flex flex-row">
        <div
          style={{
            width: sizeBarWidth,
          }}
        >
          {sider}
        </div>
        <div
          className="w-[40px] bg-gray-50"
          style={{
            height: boardSize,
          }}
        ></div>
        <div
          className="board flex items-center justify-center"
          style={{
            width: boardSize,
            height: boardSize,
          }}
        >
          {content}
        </div>
        <div
          className="w-[40px] bg-gray-50"
          style={{
            height: boardSize,
          }}
        ></div>
        <div className="flex flex-col items-center justify-center px-4 space-y-2">
          {rightPanel}
        </div>
      </div>
    </div>
  )
}
