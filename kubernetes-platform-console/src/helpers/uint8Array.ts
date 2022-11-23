export const decodeUtf8 = s => {
  return decodeURIComponent(escape(s))
}

export const uint8ArrayToString = Uint8Data => {
  let dataString = ''

  for (let i = 0; i < Uint8Data.length; i++) {
    dataString += String.fromCharCode(Uint8Data[i])
  }

  return decodeUtf8(dataString)
}
