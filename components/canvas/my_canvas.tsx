/* eslint-disable react/display-name */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react"

export const Stage = forwardRef(
  (
    {
      width,
      height,
      children,
      className,
    }: {
      width: number
      height: number
      className?: string
      children?: any
    },
    ref: any
  ) => {
    const canvasRef = useRef(null)

    useImperativeHandle(ref, () => canvasRef.current)

    const isInsideRect = (
      x: number,
      y: number,
      rectX: number,
      rectY: number,
      rectWidth: number,
      rectHeight: number
    ) => {
      return (
        x >= rectX &&
        x < rectX + rectWidth &&
        y >= rectY &&
        y < rectY + rectHeight
      )
    }

    const eventRef = useRef<{
      [key: string | "onMouseDown" | "onMouseUp" | "onMouseMove"]: any
    }>([])

    const touchRef = useRef(false)

    const touchTimerRef = useRef(null)

    useEffect(() => {
      const canvas: any = canvasRef.current
      const ctx = canvas.getContext("2d")
      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // clear eventRef
      eventRef.current = {
        onMouseDown: [],
        onMouseMove: [],
        onMouseUp: [],
        onMouseLeave: [],
        onClick: [],
      }
      // loop children
      const loop = (list: any[]) => {
        // 渲染子元素
        React.Children.forEach(list, (child) => {
          if (child && child.type) {
            if (child.type === Rect) {
              const {
                x,
                y,
                width,
                height,
                fill,
                stroke,
                strokeWidth = 1,
                onMouseDown,
                onMouseMove,
                onMouseLeave,
                onMouseUp,
                onClick,
              } = child.props
              ctx.fillStyle = fill
              ctx.fillRect(x, y, width, height)

              // 绘制边框
              if (stroke) {
                ctx.strokeStyle = stroke
                ctx.lineWidth = strokeWidth
                ctx.strokeRect(x, y, width, height)
              }

              eventRef.current["onMouseDown"].push({
                rect: { x, y, width, height },
                handle: onMouseDown,
              })
              eventRef.current["onMouseMove"].push({
                rect: { x, y, width, height },
                handle: onMouseMove,
              })
              eventRef.current["onMouseUp"].push({
                rect: { x, y, width, height },
                handle: onMouseUp,
              })
              eventRef.current["onMouseLeave"].push({
                rect: { x, y, width, height },
                handle: onMouseLeave,
              })
              eventRef.current["onClick"].push({
                rect: { x, y, width, height },
                handle: onClick,
              })
            } else if (child.type === Layer) {
              loop(child.props.children)
            }
          }
        })
      }
      loop(children)

      const checkEvent = (
        event: MouseEvent,
        type: string,
        pos: { x: number; y: number }
      ) => {
        let events = eventRef.current[type] ?? []
        events.forEach((item: { rect: any; handle: any }, index: number) => {
          const { rect, handle } = item
          if (rect && handle) {
            if (
              isInsideRect(
                pos.x,
                pos.y,
                rect.x,
                rect.y,
                rect.width,
                rect.height
              )
            ) {
              handle(event)
            }
          }
        })
      }

      // 处理事件
      const handleMouseDown = (event: MouseEvent) => {
        touchRef.current = true
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        checkEvent(event, "onMouseDown", { x, y })
      }

      const handleMouseUp = (event: MouseEvent) => {
        touchRef.current = false
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        checkEvent(event, "onMouseUp", { x, y })
      }

      const handleMouseMove = (event: MouseEvent) => {
        if (!touchRef.current) {
          return
        }
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        checkEvent(event, "onMouseMove", { x, y })
      }

      const handleClick = (event: MouseEvent) => {
        touchRef.current = false
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        checkEvent(event, "onClick", { x, y })
      }
      const handleCancel = (event: MouseEvent) => {
        touchRef.current = false
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        checkEvent(event, "onMouseEnd", { x, y })
      }

      canvas.addEventListener("click", handleClick)
      canvas.addEventListener("mousedown", handleMouseDown)
      canvas.addEventListener("mouseup", handleMouseUp)
      canvas.addEventListener("mousemove", handleMouseMove)
      canvas.addEventListener("mouseleave", handleCancel)

      return () => {
        canvas.removeEventListener("click", handleClick)
        canvas.removeEventListener("mousedown", handleMouseDown)
        canvas.removeEventListener("mouseup", handleMouseUp)
        canvas.removeEventListener("mousemove", handleMouseMove)
        canvas.removeEventListener("mouseleave", handleCancel)
      }
    }, [children])

    return (
      <div className={className}>
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
    )
  }
)

export const Layer = (props: { children: any }) => null

export const Rect = (props: {
  x: number
  y: number
  width: number
  height: number
  fill: string
  stroke?: string
  strokeWidth?: string | number
  onMouseMove?: (event: MouseEvent) => void
  onMouseUp?: (event: MouseEvent) => void
  onMouseLeave?: (event: MouseEvent) => void
  onMouseDown?: (event: MouseEvent) => void
  onClick?: (event: MouseEvent) => void
}) => null
