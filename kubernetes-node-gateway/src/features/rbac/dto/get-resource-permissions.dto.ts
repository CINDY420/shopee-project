import { ApiProperty } from '@nestjs/swagger'
import { RESOURCE_TYPE } from '@/common/constants/rbac'
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator'

export class GetResourcePermissionsQuery {
  @IsNotEmpty()
  @ApiProperty({ type: [RESOURCE_TYPE] })
  resources: RESOURCE_TYPE[]

  @IsNumberString()
  @IsOptional()
  tenantId?: string
}
