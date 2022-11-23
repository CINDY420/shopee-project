export interface IListParam {
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}

export interface IRequestListParam {
  statusType: string
  offset?: number
  limit?: number
  orderBy?: string
  filterBy?: string
}
