export const textSize = (
  text: string,
  style: {
    fontWeight: string | number
    fontSize: string
    fontFamily: string
  }
) => {
  const { fontWeight = 'normal', fontSize = '14px', fontFamily = 'PingFang SC' } = style
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`

  return ctx.measureText(text).width
}
