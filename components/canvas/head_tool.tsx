"use client"

import { cn } from "@/lib/utils"
import { Icons } from "@/shared/icons"
import { ReactNode, useEffect } from "react"

export default function HeadTool({
  color: curColor,
  tool,
  onToolChange,
  onAction,
}: {
  color: string
  tool: string
  onToolChange: (tool: string) => void
  onAction: (type: "Clear" | "Color") => void
}) {
  return (
    <>
      <div
        className={cn(
          "w-[40px] h-[40px] flex items-center justify-center",
          tool === "Pen" ? "bg-red-200" : "bg-gray-200 opacity-50"
        )}
        onClick={() => onAction("Color")}
      >
        <div
          className="w-7 h-7"
          style={{
            backgroundColor: curColor,
          }}
        ></div>
      </div>
      <ToolIcon
        icon={<Icons.pencel strokeWidth={2.5} className="relative w-5 h-5" />}
        onClick={() => onToolChange("Pen")}
        selected={tool === "Pen"}
        label="B"
      />
      <ToolIcon
        icon={<Icons.eraser strokeWidth={2.5} className="relative w-5 h-5" />}
        onClick={() => onToolChange("Eraser")}
        selected={tool === "Eraser"}
        label="E"
      />
      <ToolIcon
        icon={<Icons.move strokeWidth={2.5} className="relative w-5 h-5" />}
        onClick={() => onToolChange("Move")}
        selected={tool === "Move"}
        label="V"
      />
      <ToolIcon
        icon={<Icons.hand strokeWidth={2.5} className="relative w-5 h-5" />}
        onClick={() => onToolChange("Hand")}
        selected={tool === "Hand"}
        label="H"
      />
      <ToolIcon
        icon={<Icons.square strokeWidth={2.5} className="relative w-5 h-5" />}
        onClick={() => onToolChange("Cutter")}
        selected={tool === "Cutter"}
        label="S"
      />

      <KeyBindBox
        onEvent={(type) => {
          // key
          if (type === "e") {
            onToolChange("Eraser")
          } else if (type === "b") {
            onToolChange("Pen")
          } else if (type === "v") {
            onToolChange("Move")
          } else if (type === "h") {
            onToolChange("Hand")
          } else if (type === "s") {
            onToolChange("Cutter")
          }
        }}
      />
    </>
  )
}

const KeyBindBox = ({ onEvent }: { onEvent: (key: string) => void }) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      let key = event.key.toLowerCase()
      if (key === "e") {
        onEvent(key)
      } else if (key === "b") {
        onEvent(key)
      } else if (key === "v") {
        onEvent(key)
      } else if (key === "h") {
        onEvent(key)
      } else if (key === "s") {
        onEvent(key)
      }
    }
    document.addEventListener("keydown", handleKeyPress)
    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  }, [])
  return null
}

/**
 * ToolIcon
 */
export function ToolIcon({
  icon,
  label,
  selected,
  onClick,
  className,
  disable,
}: {
  icon: ReactNode
  label: string
  selected: boolean
  className?: string
  disable?: boolean
  onClick: () => void
}) {
  return (
    <div
      className={cn(
        "relative w-[40px] h-[40px] flex items-center justify-center  cursor-pointer",
        selected ? "bg-red-200" : "bg-gray-200",
        disable ? " opacity-50" : "",
        className
      )}
      onClick={onClick}
    >
      {icon}
      <span className="absolute bottom-0 right-0 text-[10px] w-[10px]">
        {label}
      </span>
    </div>
  )
}
