import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { RESOURCE_TYPE } from 'common/constants/rbac'

export class GetResourcePermissionsQueryDto {
  @ApiProperty()
  resources: RESOURCE_TYPE[]

  @ApiPropertyOptional()
  tenantId: number
}
