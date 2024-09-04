"use client"

import { cn } from "@/lib/utils"
import { Icons } from "@/shared/icons"
import { useEffect } from "react"

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
          E
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
          R
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
            onToolChange("Pen")
          } else if (type === "r") {
            onToolChange("Eraser")
          } else if (type === "v") {
            onToolChange("Move")
          }
        }}
      />
    </>
  )
}

const KeyBindBox = ({ onEvent }: { onEvent: (key: string) => void }) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      console.log(1)
      let key = event.key.toLowerCase()
      if (key === "e") {
        onEvent(key)
      } else if (key === "r") {
        onEvent(key)
      } else if (key === "v") {
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
