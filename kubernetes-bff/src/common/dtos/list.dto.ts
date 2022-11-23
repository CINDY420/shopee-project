import { ApiPropertyOptional } from '@nestjs/swagger'
export class ListQueryDto {
  @ApiPropertyOptional()
  offset: number

  @ApiPropertyOptional()
  limit: number

  @ApiPropertyOptional()
  orderBy: string

  @ApiPropertyOptional()
  filterBy: string
}
