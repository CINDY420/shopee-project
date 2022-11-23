import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { IsStringOrNull, IsIntOrNull } from 'common/decorators/validations/common'

export class IPath {
  @ApiProperty()
  pathName: string

  @ApiProperty()
  pathType: string

  @ApiProperty()
  serviceName: string

  @ApiProperty()
  servicePort: string
}

export class IngressHost {
  @ApiProperty()
  name: string

  @ApiProperty({ type: [IPath] })
  paths: IPath[]
}

export class IngressInfo {
  @ApiProperty()
  name: string

  @ApiProperty({ type: [IngressHost] })
  hosts: IngressHost[]

  @ApiProperty()
  annotations: {
    key: string
    value: string
  }[]
}

export class IngressListResponseDto {
  @ApiProperty({ type: [IngressInfo] })
  ingresses: IngressInfo[]

  @ApiProperty()
  totalCount: number
}

export class GetClusterIngressesQueryDto {
  @ApiPropertyOptional()
  @IsIntOrNull({ message: 'offset should be number or null' })
  offset: number

  @ApiPropertyOptional()
  @IsIntOrNull({ message: 'limit should be number or null' })
  limit: number

  @ApiPropertyOptional()
  searchBy: string
}

interface IAnnotations {
  key: string
  value: string
}

interface IPaths {
  pathName: string
  pathType: string
  serviceName: string
  servicePort: string
}

interface IHosts {
  name: string
  paths: IPaths[]
}

export interface IIngresses {
  name: string
  annotations: IAnnotations[]
  hosts: IHosts[]
}
