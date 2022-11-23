import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { ListQueryDto } from 'common/dtos'

export class GetPodEventParams {
  @ApiProperty()
  @IsNotEmpty()
  tenantId: number

  @ApiProperty()
  @IsNotEmpty()
  projectName: string

  @ApiProperty()
  @IsNotEmpty()
  appName: string

  @ApiProperty()
  @IsNotEmpty()
  podName: string
}

export class GetPodEventQuery extends ListQueryDto {
  @ApiProperty()
  @IsNotEmpty()
  clusterId: string
}
