import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class DeleteServiceQueryDto {
  @ApiProperty()
  @IsNotEmpty()
  cluster: string
}
