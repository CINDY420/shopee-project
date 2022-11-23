import { ApiProperty } from '@nestjs/swagger'

export class IQuota {
  @ApiProperty({ type: Number })
  used: number

  @ApiProperty({ type: Number })
  assigned: number

  @ApiProperty({ type: Number })
  total: number

  @ApiProperty({ type: Number })
  limit: number
}

export class IDetail {
  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  envName: string

  @ApiProperty({ type: IQuota })
  cpu: IQuota

  @ApiProperty({ type: IQuota })
  memory: IQuota
}

export class IProjectQuotaDto {
  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: [IDetail] })
  resourceQuotas: IDetail[]
}

export class IProjectQuotasDto {
  @ApiProperty({ type: [IProjectQuotaDto] })
  clusters: IProjectQuotaDto[]
}

export class IUsage {
  @ApiProperty({ type: Number })
  used: number

  @ApiProperty({ type: Number })
  applied: number

  @ApiProperty({ type: Boolean })
  Ready?: boolean

  @ApiProperty({ type: String })
  alarm?: string

  @ApiProperty({ type: Number })
  total?: number
}

export class IMetrics {
  @ApiProperty({ type: IUsage })
  cpu: IUsage

  @ApiProperty({ type: IUsage })
  memory: IUsage

  @ApiProperty({ type: IUsage })
  filesystem: IUsage
}

export class ICrdQuota {
  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: Number })
  cpu: number

  @ApiProperty({ type: Number })
  memory: number

  @ApiProperty({ type: String })
  env: string

  @ApiProperty({ type: String })
  cluster: string
}

export class IProjectQuotas {
  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: Number })
  cpuTotal: number

  @ApiProperty({ type: Number })
  memoryTotal: number
}

export class updateResourceQuotasBody {
  @ApiProperty()
  projectQuotas: IProjectQuotas[]
}
