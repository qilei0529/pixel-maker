"use client"

import { cn } from "@/lib/utils"
import { Icons } from "@/shared/icons"
import { useEffect } from "react"

enum ToolType {}

export default function HeadTool({
  color: curColor,
  tool,
  onToolChange,
  onAction,
}: {
  color: string
  tool: string
  onToolChange: (tool: string) => void
  onAction: (type: "Clear") => void
}) {
  return (
    <>
      <div
        className={cn(
          "w-[40px] h-[40px] flex items-center justify-center",
          tool === "Pen" ? "bg-red-200" : "bg-gray-200 opacity-50"
        )}
        onClick={() => onToolChange("Pen")}
      >
        <div
          className="w-7 h-7"
          style={{
            backgroundColor: curColor,
          }}
        ></div>
      </div>
      <div
        className={cn(
          "relative w-[40px] h-[40px] flex items-center justify-center  cursor-pointer",
          tool === "Pen" ? "bg-red-200" : "bg-gray-200"
        )}
        onClick={() => onToolChange("Pen")}
      >
        <Icons.pencel strokeWidth={2.5} className="relative w-5 h-5" />
        <span className="absolute bottom-0 right-0 text-[10px] w-[10px]">
          B
        </span>
      </div>
      <div
        className={cn(
          "relative w-[40px] h-[40px] flex items-center justify-center  cursor-pointer",
          tool === "Eraser" ? "bg-red-200" : "bg-gray-200 hover:bg-red-200"
        )}
        onClick={() => onToolChange("Eraser")}
      >
        <Icons.eraser strokeWidth={2.5} className="relative w-5 h-5" />
        <span className="absolute bottom-0 right-0 text-[10px] w-[10px]">
          E
        </span>
      </div>
      <div
        className={cn(
          "relative w-[40px] h-[40px] flex items-center justify-center  cursor-pointer",
          tool === "Move" ? "bg-red-200" : "bg-gray-200"
        )}
        onClick={() => onToolChange("Move")}
      >
        <Icons.move strokeWidth={2.5} className="relative w-5 h-5" />
        <span className="absolute bottom-0 right-0 text-[10px] w-[10px]">
          V
        </span>
      </div>
      <div
        className={cn(
          "relative w-[40px] h-[40px] flex items-center justify-center  cursor-pointer",
          tool === "Hand" ? "bg-red-200" : "bg-gray-200"
        )}
        onClick={() => onToolChange("Hand")}
      >
        <Icons.hand strokeWidth={2.5} className="relative w-5 h-5" />
        <span className="absolute bottom-0 right-0 text-[10px] w-[10px]">
          H
        </span>
      </div>
      <div className="flex-1"></div>
      <div
        className={cn(
          "w-[40px] h-[40px] flex items-center justify-center bg-gray-200",
          tool === "Eraser"
            ? "bg-red-200 hover:bg-red-400 cursor-pointer"
            : "opacity-50 "
        )}
        onClick={() => {
          if (tool === "Eraser") {
            onAction("Clear")
            onToolChange("Pen")
          }
        }}
      >
        <Icons.brush strokeWidth={2.5} className="relative w-5 h-5" />
      </div>
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
      }
    }
    document.addEventListener("keydown", handleKeyPress)
    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  }, [])
  return null
}
