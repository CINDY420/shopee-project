import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator'

export class ClusterUpdateQuotaDto {
  @ApiProperty()
  @IsNumber()
  cpuTotal: number

  @ApiProperty()
  @IsNumber()
  memoryTotal: number

  @ApiProperty()
  @IsString()
  name: string
}

export class ClusterUpdateQuotasBodyDto {
  @ApiProperty({ type: [ClusterUpdateQuotaDto] })
  @ValidateNested({ each: true })
  @Type(() => ClusterUpdateQuotaDto)
  @IsNotEmpty()
  quotasConfig: ClusterUpdateQuotaDto[]
}
