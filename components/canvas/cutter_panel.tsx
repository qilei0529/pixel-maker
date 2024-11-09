import { cn } from "@/lib/utils"

export function CutterPanel({
  size,
  pixelSize,
  offset,
  tool,
}: {
  size: { width: number; height: number }
  pixelSize: number
  offset: { x: number; y: number }
  tool: string
}) {
  const isCutter = tool == "Cutter"
  return (
    <>
      {size.width > 0 ? (
        <div
          className={cn(
            "absolute z-10 pointer-events-none border-[2px] border-red-600",
            isCutter ? "" : "opacity-30"
          )}
          style={{
            width: size.width * pixelSize,
            height: size.height * pixelSize,
            top: 0,
            left: 0,
            transform: `translate(${offset.x * pixelSize}px, ${
              offset.y * pixelSize
            }px)`,
          }}
        >
          <div className="absolute top-[-16px] left-[-2px] px-1 text-[12px] text-white bg-red-600 h-[16px] flex items-center rounded-t-sm">{`${size.width}x${size.height}`}</div>
        </div>
      ) : null}
    </>
  )
}
