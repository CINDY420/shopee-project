import { ApiProperty } from '@nestjs/swagger'

export class ITenantTreeProjectItem {
  @ApiProperty()
  clusters: string[]

  @ApiProperty()
  name: string

  @ApiProperty()
  tenantId: number
}

export class ITenantTreeItem {
  @ApiProperty()
  name: string

  @ApiProperty()
  id: number

  @ApiProperty({ type: [ITenantTreeProjectItem] })
  projects: ITenantTreeProjectItem[]
}

export class ITenantTree {
  @ApiProperty({ type: [ITenantTreeItem] })
  tenants: ITenantTreeItem[]
}

export class IApplicationTreeItem {
  tenantName: string
  projectName: string
  name: string
  clusterId: string
}

export class IApplicationTree {
  applications: IApplicationTreeItem[]
  tenantName: string
  name: string
}
