import { IsString, ValidateNested, IsInt } from 'class-validator'
import { Type } from 'class-transformer'
import { IsValidMemoryQuota } from '@/common/decorators/validations'

export class OpenApiQuota {
  @IsInt() // core个数，整数
  cpu: number

  @IsInt() // core个数，整数
  gpu: number

  // 单位是Gi/Mi/Ki，创建时指定，返回和创建一样的单位，格式是数字+单位，例如: '30Gi', '20Mi', '40Ki'
  @IsValidMemoryQuota()
  memory: string
}

export class DisplayQuota {
  cpu: number
  gpu: number
  memory: number // unit Gi
}

export class ResponseClusterQuota {
  @IsString()
  clusterId: string

  @IsString()
  clusterName: string

  @ValidateNested()
  @Type(() => OpenApiQuota)
  quota: OpenApiQuota
}

export class PayloadClusterQuota {
  @IsString()
  clusterId: string

  @ValidateNested()
  @Type(() => OpenApiQuota)
  quota: OpenApiQuota
}

export class ResponseEnvQuota {
  @IsString()
  env: string

  @ValidateNested({
    each: true,
  })
  @Type(() => ResponseClusterQuota)
  clusterQuota: ResponseClusterQuota[]
}

export class PayloadEnvQuota {
  @IsString()
  env: string

  @ValidateNested({
    each: true,
  })
  @Type(() => PayloadClusterQuota)
  clusterQuota: PayloadClusterQuota[]
}
