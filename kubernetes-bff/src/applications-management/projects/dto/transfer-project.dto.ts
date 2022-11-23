import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class ITransferProjectDto {
  @IsNotEmpty()
  targetTenantId: number
}

export class ITransferProjectResponse {
  @ApiProperty({ type: Number })
  tenantId: number

  @ApiProperty({ type: String })
  name: string
}
