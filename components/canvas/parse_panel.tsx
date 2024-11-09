import { useEffect, useState } from "react"

export function ParseCanvas() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      const clipboardItems = event.clipboardData?.items

      if (clipboardItems) {
        for (let i = 0; i < clipboardItems.length; i++) {
          const item = clipboardItems[i]

          // 如果剪贴板中的项目是图片
          if (item.type.startsWith("image/")) {
            const blob = item.getAsFile()
            if (blob) {
              const imageUrl = URL.createObjectURL(blob)

              // 设置图片 URL 到 state 以便展示图片
              setImageSrc(imageUrl)
            }
          }
        }
      }
    }

    window.addEventListener("paste", handlePaste)

    return () => {
      window.removeEventListener("paste", handlePaste)
    }
  }, [])
  return (
    <div>
      <h1>Paste an image here</h1>
      {imageSrc ? (
        <img src={imageSrc} alt="Pasted" style={{ maxWidth: "100%" }} />
      ) : (
        <p>No image pasted yet</p>
      )}
    </div>
  )
}
