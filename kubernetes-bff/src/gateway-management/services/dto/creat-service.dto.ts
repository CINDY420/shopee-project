import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MinLength, MaxLength, IsOptional, IsBoolean } from 'class-validator'
import { IsNotEmptyArray, IsMatchRegExp, IsItemInArray } from 'common/decorators/validations/common'
import { ISelectorValue } from 'common/helpers/service'

export class IPort {
  port: string
  targetPort: string
  protocol: string
  name: string
}

export enum SERVICE_TYPE {
  CLUSTER_IP = 'ClusterIP',
  EXTERNAL_NAME = 'ExternalName'
}

export class ISelector {
  @ApiProperty()
  key: string

  @ApiProperty({ enum: ISelectorValue })
  value: ISelectorValue
}

export class ICreateServicePlayLoad {
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
  @IsNotEmptyArray({ message: 'Cluster array can not be empty' })
  cluster: string[]

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

export interface IClusterServiceNamespace {
  clusterName: string
  serviceNamespaceMap: Record<string, string>
}

export interface ICreateServiceArguments {
  clusterConfig: string
  clusterName: string
  tenant: number
  serviceName: string
  namespace: string
  serviceType: SERVICE_TYPE
  ports: string
  selectors: string
  externalName: string
  clusterIP: string
}
