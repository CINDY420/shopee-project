import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class IGroupDetail {
  @ApiProperty({ type: String })
  name: string

  @ApiProperty({ type: String })
  id: number

  @ApiProperty({ type: [String] })
  envs: string[]

  @ApiProperty({ type: [String] })
  cids: string[]

  @ApiProperty({ type: [String] })
  clusters: string[]

  @ApiProperty()
  envClusterMap: {
    [envName: string]: string[]
  }
}

export class IUsage {
  @ApiProperty({ type: Number })
  total: number

  @ApiProperty({ type: Number })
  applied: number

  @ApiProperty({ type: Number })
  used: number

  @ApiProperty({ type: Boolean })
  Ready?: boolean

  @ApiProperty({ type: String })
  alarm?: string
}

export class IQuota {
  @ApiProperty({ type: IUsage })
  cpu: IUsage

  @ApiProperty({ type: IUsage })
  memory: IUsage

  @ApiProperty({ type: IUsage })
  filesystem: IUsage
}

export class IMetricsDto {
  @ApiProperty({ type: Number })
  cluster: string

  @ApiProperty({ type: Number })
  env: string

  @ApiProperty({ type: IQuota })
  quota: IQuota
}

export class ITenant {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  detail: string

  @ApiProperty()
  createAt: string

  @ApiProperty()
  updateAt: string
}

export class ITenantList {
  @ApiProperty({ type: [ITenant] })
  tenantList: ITenant[]

  @ApiProperty()
  totalCount: number
}

export interface ITenants {
  tenants: ITenant[]
  totalSize: number
}

export class ITenantDetailParams {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  tenantId: number
}

export class ICreateTenantBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  detail: string
}

export class IAddTenantUsersBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  emails: string[]

  @ApiProperty()
  roleId: number
}
export class IUpdateTenantBodyDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  detail: string
}

export class IUpdateTenantUserParamsDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  tenantId: number

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  userId: number
}

export class IUpdateTenantUserBodyDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  roleId: number
}

export class IDeleteTenantUserParamsDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  tenantId: number

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  userId: string
}

export class IAddTenantBotBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  password: string

  @ApiProperty()
  @IsNotEmpty()
  detail: string

  @ApiProperty()
  roleId: number
}

export class IUpdateTenantBotParamsDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  tenantId: number

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  botId: number
}
export class IUpdateTenantBotBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string

  @ApiProperty()
  @IsNotEmpty()
  password: string

  @ApiProperty()
  @IsNotEmpty()
  detail: string

  @ApiProperty()
  roleId: number
}

export class IDeleteTenantBotParamsDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  tenantId: number

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  botId: number
}

export class IGenerateBotAccessTokenParamsDto {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  tenantId: number

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  botId: number
}

export class IGenerateBotAccessTokenBodyDto {
  @ApiProperty()
  password: string
}
