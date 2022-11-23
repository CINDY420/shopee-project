import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsArray } from 'class-validator'
import { IsItemInArray } from 'common/decorators/validations/common'

const loadBalanceClusterTypeList = ['live', 'nonlive']

export class GetInfoQueryDto {
  @ApiProperty({ enum: loadBalanceClusterTypeList })
  @IsNotEmpty()
  @IsString()
  @IsItemInArray(loadBalanceClusterTypeList, { message: 'request type should be nonlive or live!' })
  type: string
}

export class GetInfoResponseDto {
  @ApiProperty()
  envs: string[]

  @ApiProperty()
  cids: string[]

  @ApiProperty()
  clusters: string[]
}

export class GetTemplateResponseDto {
  @ApiPropertyOptional()
  frontend: string

  @ApiPropertyOptional()
  backend: string
}

export class RenderTemplateBodyDto {
  @ApiProperty()
  @IsArray()
  envs: string[]

  @ApiProperty()
  @IsArray()
  cids: string[]

  @ApiProperty()
  @IsArray()
  clusters: string[]

  @ApiPropertyOptional()
  @IsString()
  frontend: string

  @ApiPropertyOptional()
  @IsString()
  backend: string
}

class RenderTemplateResponseFrontend {
  [key: string]: string[]
}

class RenderTemplateResponseBackendClusterRender {
  envRenders: string[]
}

class RenderTemplateResponseBackend {
  clusterRenders: RenderTemplateResponseBackendClusterRender[]
}

export class RenderTemplateResponseDto {
  @ApiProperty()
  frontend: RenderTemplateResponseFrontend

  @ApiProperty()
  backend: RenderTemplateResponseBackend[]
}
