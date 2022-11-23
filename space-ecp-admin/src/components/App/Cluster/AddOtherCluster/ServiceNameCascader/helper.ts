export const buildProductValue = (productName: string, productId: number) =>
  `${productName}===${productId}`

export const parseProductValue = (value: string) => {
  if (typeof value !== 'string') return {}
  const [productName, productId] = value.split('===')
  return { productName, productId }
}
