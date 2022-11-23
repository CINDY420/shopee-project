import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsOptional, IsNumberString } from 'class-validator'

export class ListQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  offset?: string = '0' // default 0

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  limit?: string = '10' // default 10

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderBy?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  filterBy?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  searchBy?: string
}
