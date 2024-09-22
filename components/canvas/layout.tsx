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
  //
  return (
    <div className="relative overflow-auto">
      <div className="flex flex-row">
        <div className="sm:w-[180px]"></div>
        <div className="sm:w-[24px]"></div>
        <div className="">
          <div className="flex flex-row space-x-2">{header}</div>
          <div className="h-4 sm:h-6"></div>
          <div className="p-4 bg-gray-100">{content}</div>
        </div>
        <div className="sm:w-[24px]"></div>
        <div className="sm:w-[120px]"></div>
      </div>
      <div className="relative sm:absolute flex flex-col top-0 right-0 bottom-0 bg-gray-100 sm:w-[120px]">
        <div className="sm:h-[40px]"></div>
        <div className="flex flex-row sm:flex-col mb-4 sm:mb-0 flex-1 sm:py-4">
          {rightPanel}
        </div>
      </div>
      <div className="relative sm:absolute flex flex-col top-0 left-0 bottom-0 bg-gray-100 sm:w-[180px]">
        <div className="sm:h-[40px]"></div>
        <div className="flex flex-row sm:flex-col flex-1">{sider}</div>
      </div>
    </div>
  )
}
