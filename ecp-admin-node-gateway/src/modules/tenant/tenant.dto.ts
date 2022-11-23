export class TenantManager {
  id: number
  email: string
  teamIds: number[]
}

export class Tenant {
  name: string
  id: number
  managers?: TenantManager[]
}

export class ListTenantResponse {
  items: Tenant[]
}
