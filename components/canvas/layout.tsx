import { FC, ReactNode, useMemo } from "react"

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
  //
  return (
    <div className="relative h-full w-full flex flex-col justify-center">
      <div className="h-[40px]"></div>
      <div className="flex-1">{content}</div>
      <div className="absolute top-[40px] left-0 right-0 z-50 flex flex-row items-center justify-center">
        {header}
      </div>
      <div className="absolute top-[120px] right-0 z-50">
        <div className="flex flex-row sm:flex-col mb-4 sm:mb-0 flex-1 sm:py-4">
          {rightPanel}
        </div>
      </div>
      <div className="absolute top-[120px] left-0 z-50">{sider}</div>
    </div>
  )
}
