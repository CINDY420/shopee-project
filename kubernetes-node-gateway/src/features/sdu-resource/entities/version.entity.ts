class BigSale {
  day: number
  bigSaleId: string
  month: number
  name: string
  year: number
}

export class Version {
  endBigSale: BigSale
  startBigSale: BigSale
  versionId: string
  state: number
  name: string
}
