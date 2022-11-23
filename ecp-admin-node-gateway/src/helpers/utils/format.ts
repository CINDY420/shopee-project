export const formatDataFromByteToGib = (byteNum: number): number => {
  const gib = parseFloat((byteNum / (1024 * 1024 * 1024)).toFixed(2))
  return gib
}

export const parseUnsafeJSON = <TData = unknown>(
  jsonString: string,
): { valid: boolean; json: TData | undefined } => {
  try {
    const json = JSON.parse(jsonString)
    return { valid: true, json }
  } catch (e) {
    return { valid: false, json: undefined }
  }
}
