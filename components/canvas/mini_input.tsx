import { useEffect, useRef, useState } from "react"
import { Input } from "../ui/input"

export function MiniInput({
  onConfirm,
  value,
  ...others
}: {
  onConfirm: (event: HTMLInputElement) => void
  value?: string | number
  className?: string
  placeholder?: string
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = `${value}`
    }
    setValue(value)
  }, [value])

  const [inputValue, setValue] = useState(value)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.keyCode === 13) {
        // 回车键被按下
        console.log("Enter key pressed!", inputRef.current)
        // 在这里执行你想要触发的事件逻辑
        if (inputRef.current) {
          onConfirm(inputRef.current)
          inputRef.current.value = ""
        }
      }
    }
    const handleFocus = () => {
      document.addEventListener("keydown", handleKeyPress)
    }
    const handleBlur = () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
    const inputElement = inputRef.current
    if (inputElement) {
      inputElement.addEventListener("focus", handleFocus)
      inputElement.addEventListener("blur", handleBlur)
    }
    return () => {
      if (inputElement) {
        inputElement.removeEventListener("focus", handleFocus)
        inputElement.removeEventListener("blur", handleBlur)
      }
    }
  }, [])

  return (
    <Input
      ref={inputRef}
      value={inputValue}
      onChange={(e) => setValue(e.target.value)}
      {...others}
    />
  )
}
