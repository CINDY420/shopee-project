export interface IOperationLog {
  detail: string
  tenant: string
  objectType: string
  operator: string
  time: string
}

export interface IOperationLogs {
  logs: IOperationLog[]
  tenants: string[]
  totalCount: number
  objectTypes: string[]
  methods: string[]
  sources: string[]
}
