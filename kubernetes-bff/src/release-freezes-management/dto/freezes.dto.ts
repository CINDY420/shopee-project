import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
// release freezes list
export class ReleaseFreezeItemDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  env: string

  @ApiProperty()
  startTime: string

  @ApiProperty()
  endTime: string

  @ApiProperty()
  reason: string

  @ApiProperty()
  status: string

  @ApiProperty()
  createdBy: string

  @ApiProperty()
  createdAt: string

  @ApiProperty()
  updatedBy: string

  @ApiProperty()
  updatedAt: string

  @ApiProperty()
  resource: string
}

export class ListFreezesQueryDto {
  @ApiPropertyOptional({ type: Number })
  offset?: number

  @ApiPropertyOptional({ type: Number })
  limit?: number

  @ApiPropertyOptional()
  status?: string
}

export class ListReleaseFreezesResponseDto {
  @ApiProperty({ type: [ReleaseFreezeItemDto] })
  releaseFreezeList: ReleaseFreezeItemDto[]

  @ApiProperty({ type: Number })
  total: number

  @ApiProperty({ type: String })
  message: string

  @ApiProperty({ type: Number })
  code: number
}

// last release freeze
export class getLastReleaseFreezeResponseDto {
  @ApiProperty()
  isFreezing: boolean

  @ApiPropertyOptional()
  item?: ReleaseFreezeItemDto
}

// create release freeze
export class CreateReleaseFreezeBodyDto {
  @ApiProperty()
  envs: string[]

  @ApiProperty()
  startTime: number

  @ApiProperty()
  endTime: number

  @ApiProperty()
  reason: string
}

// update release freeze
export class UpdateReleaseFreezeParamsDto {
  @ApiProperty()
  releaseFreezeId: string
}

export class UpdateReleaseFreezeBodyDto {
  @ApiProperty()
  envs: string[]

  @ApiProperty()
  startTime: number

  @ApiProperty()
  endTime: number

  @ApiProperty()
  reason: string
}

// get release freeze
export class GetReleaseFreezeParamsDto {
  @ApiProperty()
  releaseFreezeId: string
}

// stop release freeze
export class StopReleaseFreezeParamsDto {
  @ApiProperty()
  releaseFreezeId: string
}

// get last release freeze
export class GetLastReleaseFreezeParamsDto {
  @ApiProperty()
  env: string
}
