import { Sketch, Colorful } from "@uiw/react-color"

export const ColorPickerPanel = ({
  color,
  onChange,
}: {
  color: string
  onChange: (color: any) => void
}) => {
  return (
    <Colorful
      style={{ marginLeft: 20 }}
      color={color}
      onChange={onChange}
      disableAlpha={true}
    />
  )
}
