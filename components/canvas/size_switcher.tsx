import { useRef } from "react"
import { MiniInput } from "./mini_input"

export const SizeSwitcher = ({
  size,
  onChange,
}: {
  size: { width: number; height: number }
  onChange: (size: { width?: number; height?: number }) => void
}) => {
  const target = useRef<any>()

  return (
    <div className="relative" key={`${size.width}_${size.height}`}>
      <div className="flex flex-row space-x-1">
        <MiniInput
          className="w-8 text-center rounded-md"
          value={size.width}
          onConfirm={(e) => {
            onChange({
              width: parseInt(e.value, 10),
              height: size.height,
            })
          }}
        />
        <span>x</span>
        <MiniInput
          className="w-8 text-center rounded-md"
          value={size.height}
          onConfirm={(e) => {
            onChange({
              width: size.width,
              height: parseInt(e.value, 10),
            })
            console.log("ok")
          }}
        />
      </div>
      {/* <select
        ref={target}
        className="p-1 px-2 rounded-lg text-[16px]"
        value={size.width}
        onChange={(e) => {
          const val = parseInt(e.target.value)
          onChange({ width: val, height: val })
        }}
      >
        <option value={8}>8x8</option>
        <option value={16}>16x16</option>
        <option value={24}>24x24</option>
        <option value={32}>32x32</option>
        <option value={48}>48x48</option>
      </select> */}
    </div>
  )
}
