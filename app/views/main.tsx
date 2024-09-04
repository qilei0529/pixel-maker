"use client"
import { PixelCanvas } from "@/components/canvas/the_canvas"

export default function MainView() {
  return (
    <div className="w-screen h-screen bg-gray-50 relative flex items-center justify-center">
      <PixelCanvas />
    </div>
  )
}
