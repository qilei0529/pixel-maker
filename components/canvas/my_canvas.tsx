/* eslint-disable react/display-name */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"

export const Stage = forwardRef(
  (
    {
      width,
      height,
      children,
      className,
      onMouseMove,
      onMouseMoveEnd,
      onMouseDraw,
    }: {
      width: number
      height: number
      className?: string
      children?: any
      onMouseMove?: (
        event: MouseEvent,
        size: { width: number; height: number }
      ) => void
      onMouseMoveEnd?: (
        event: MouseEvent,
        size: { width: number; height: number }
      ) => void
      onMouseDraw?: (
        event: MouseEvent,
        touch: { x: number; y: number; type?: string; button?: number }
      ) => void
    },
    ref: any
  ) => {
    const canvasRef = useRef(null)
    const [ratio] = useState(2)

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

    const touchMoveRef = useRef({ width: 0, height: 0 })
    const touchTypeRef = useRef({ type: "mouse", button: -1 })

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
              ctx.fillRect(x * ratio, y * ratio, width * ratio, height * ratio)

              // 绘制边框
              if (stroke) {
                ctx.strokeStyle = stroke
                ctx.lineWidth = strokeWidth * ratio
                ctx.strokeRect(
                  x * ratio,
                  y * ratio,
                  width * ratio,
                  height * ratio
                )
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
        pos: RectTouchEvent
      ) => {
        let events = eventRef.current[type] ?? []
        // events.forEach((item: { rect: any; handle: any }, index: number) => {
        //   const { rect, handle } = item
        //   if (rect && handle) {
        //     if (
        //       isInsideRect(
        //         pos.x,
        //         pos.y,
        //         rect.x,
        //         rect.y,
        //         rect.width,
        //         rect.height
        //       )
        //     ) {
        //       handle(event, pos)
        //     }
        //   }
        // })
      }

      const getPosition = (event: MouseEvent & TouchEvent) => {
        const rect = canvas.getBoundingClientRect()
        if (event.touches && event.touches.length) {
          const touch = event.touches[0] // 获取第一个触摸点的信息
          const x = touch.clientX - rect.left
          const y = touch.clientY - rect.top
          return { x, y }
        }

        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        return { x, y }
      }

      // 处理事件
      const handleMouseDown = (event: MouseEvent & TouchEvent) => {
        setLogger({ event: "down" })
        touchRef.current = true
        const { x, y } = getPosition(event)
        touchMoveRef.current = { width: x, height: y }
        const type = touchTypeRef.current.type
        const button = touchTypeRef.current.button

        checkEvent(event, "onMouseDown", {
          x,
          y,
          type,
          button,
        })
      }

      const handleMouseUp = (event: MouseEvent & TouchEvent) => {
        setLogger({ event: "up" })
        touchRef.current = false
        const { x, y } = getPosition(event)
        touchMoveRef.current = { width: 0, height: 0 }

        checkEvent(event, "onMouseUp", { x, y })

        if (onMouseMoveEnd) {
          let size = touchMoveRef.current ?? { width: 0, height: 0 }
          onMouseMoveEnd?.(event, {
            width: x - size.width,
            height: y - size.height,
          })
        }
      }

      const handleMouseMove = (event: MouseEvent & TouchEvent) => {
        if (!touchRef.current) {
          return
        }
        const { x, y } = getPosition(event)

        const type = touchTypeRef.current.type
        const button = touchTypeRef.current.button

        checkEvent(event, "onMouseMove", {
          x,
          y,
          type,
          button,
        })

        setLogger({
          event: "move",
          type,
          button,
          pos: { x, y },
        })

        if (onMouseMove) {
          let size = touchMoveRef.current ?? { width: 0, height: 0 }
          onMouseMove?.(event, {
            width: x - size.width,
            height: y - size.height,
          })
        }

        if (onMouseDraw) {
          // let size = touchMoveRef.current ?? { width: 0, height: 0 }
          onMouseDraw?.(event, { x, y, type, button })
        }
      }

      const handleClick = (event: MouseEvent & TouchEvent) => {
        touchRef.current = false
        const { x, y } = getPosition(event)
        checkEvent(event, "onClick", { x, y })

        const type = touchTypeRef.current.type
        const button = touchTypeRef.current.button

        if (onMouseDraw) {
          onMouseDraw?.(event, { x, y, type, button })
        }
      }
      const handleCancel = (event: MouseEvent & TouchEvent) => {
        touchRef.current = false
        const { x, y } = getPosition(event)
        checkEvent(event, "onMouseEnd", { x, y })
      }

      const handlePoinerDown = (event: PointerEvent) => {
        // 修改 pointer type
        // pen change
        touchTypeRef.current.type = event.pointerType
        touchTypeRef.current.button = event.button
      }

      const handlePoinerUp = (event: PointerEvent) => {
        // pen change
        touchTypeRef.current.type = "none"
        touchTypeRef.current.button = -1
      }

      canvas.addEventListener("pointerdown", handlePoinerDown)

      canvas.addEventListener("click", handleClick)
      canvas.addEventListener("mousedown", handleMouseDown)
      canvas.addEventListener("mouseup", handleMouseUp)
      canvas.addEventListener("mousemove", handleMouseMove)
      canvas.addEventListener("mouseleave", handleCancel)

      canvas.addEventListener("touchstart", handleMouseDown)
      canvas.addEventListener("touchend", handleMouseUp)
      canvas.addEventListener("touchmove", handleMouseMove)
      canvas.addEventListener("touchcancel", handleCancel)
      canvas.addEventListener("pointerup", handlePoinerUp)

      return () => {
        canvas.removeEventListener("pointerdown", handlePoinerDown)
        canvas.removeEventListener("pointerup", handlePoinerUp)

        canvas.removeEventListener("click", handleClick)
        canvas.removeEventListener("mousedown", handleMouseDown)
        canvas.removeEventListener("mouseup", handleMouseUp)
        canvas.removeEventListener("mousemove", handleMouseMove)
        canvas.removeEventListener("mouseleave", handleCancel)

        canvas.removeEventListener("touchstart", handleMouseDown)
        canvas.removeEventListener("touchend", handleMouseUp)
        canvas.removeEventListener("touchmove", handleMouseMove)
        canvas.removeEventListener("touchcancel", handleCancel)
      }
    }, [children, onMouseMove, onMouseMoveEnd, ratio])

    const [logger, setLogger] = useState<any>({ event: "none" })
    return (
      <div className={className}>
        <canvas
          ref={canvasRef}
          width={width * ratio}
          height={height * ratio}
          style={{
            width: width,
            height: height,
          }}
        />
        <div className="absolute hidden">{JSON.stringify(logger)}</div>
      </div>
    )
  }
)

export const Layer = (props: { children: any }) => null

export type RectTouchEvent = {
  x: number
  y: number
  type?: string
  button?: number
}

export const Rect = (props: {
  x: number
  y: number
  width: number
  height: number
  fill: string
  stroke?: string
  strokeWidth?: string | number
  onMouseMove?: (event: MouseEvent, touch: RectTouchEvent) => void
  onMouseUp?: (event: MouseEvent, touch: RectTouchEvent) => void
  onMouseLeave?: (event: MouseEvent, touch: RectTouchEvent) => void
  onMouseDown?: (event: MouseEvent, touch: RectTouchEvent) => void
  onClick?: (event: MouseEvent, touch: RectTouchEvent) => void
}) => null
