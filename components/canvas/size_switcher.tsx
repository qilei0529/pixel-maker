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
    <div className="relative">
      <select
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
      </select>
    </div>
  )
}
