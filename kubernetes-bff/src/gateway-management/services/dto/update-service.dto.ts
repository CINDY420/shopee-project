import { ApiProperty } from '@nestjs/swagger'
import { SERVICE_TYPE, IPort, ISelector } from './creat-service.dto'
import { IsNotEmpty, MinLength, MaxLength, IsOptional, IsBoolean } from 'class-validator'
import { IsNotEmptyArray, IsMatchRegExp, IsItemInArray } from 'common/decorators/validations/common'

export class UpdateServiceParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  tenantId: number

  @ApiProperty()
  @IsNotEmpty()
  project: string

  @ApiProperty()
  @IsNotEmpty()
  svc: string
}

export class IUpdateServicePlayLoad {
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(31)
  @IsMatchRegExp(/^[a-z][a-z0-9-]*[a-z0-9]$/, { message: 'Request service prefix is invalid' })
  prefix: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNotEmptyArray({ message: 'Env array can not be empty' })
  env: string[]

  @ApiProperty()
  @IsNotEmpty()
  @IsNotEmptyArray({ message: 'Cid array can not be empty' })
  cid: string[]

  @ApiProperty()
  @IsNotEmpty()
  cluster: string

  @ApiProperty()
  @IsNotEmpty()
  @IsItemInArray(['ClusterIP', 'ExternalName'], { message: 'Request service type is invalid' })
  type: SERVICE_TYPE

  @ApiProperty()
  @IsOptional()
  @MinLength(2)
  @MaxLength(127)
  @IsMatchRegExp(
    /^@cid|^@env|^@domain_env_flag|^@domain_cid_suffix|^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/,
    {
      message:
        'externalName must match /^@cid|^@env|^@domain_env_flag|^@domain_cid_suffix|^[a-z0-9]([-a-z0-9]*[a-z0-9])?(.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/'
    }
  )
  externalName?: string

  @ApiProperty({ type: [IPort] })
  @IsOptional()
  @IsNotEmptyArray({ message: 'ports array can not be empty' })
  ports?: IPort[]

  @ApiProperty({ type: [ISelector] })
  @IsOptional()
  @IsNotEmptyArray({ message: 'selector array can not be empty' })
  selector?: ISelector[]

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  clusterIp?: boolean
}

export interface IServiceInfo {
  serviceName: string
  prefix: string
  env: string
  cid: string
  clusterName: string
  serviceType: SERVICE_TYPE
  externalName?: string
  ports?: IPort[]
  selectorList?: ISelector[]
  clusterIp?: boolean
}

export interface IUpdateServiceArgs {
  serviceName: string
  namespace: string
  env: string
  cid: string
  serviceType: SERVICE_TYPE
  externalName?: string
  ports?: IPort[]
  selectorList?: ISelector[]
  clusterIp?: boolean
}

export interface ICluster {
  cids: string[]
  config: string
  createTime: string
  updateTime: string
  envs: string[]
  groups: string[]
  name: string
  tenants: string[]
}
