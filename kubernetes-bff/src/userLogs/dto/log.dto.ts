import { ApiProperty } from '@nestjs/swagger'
import { ListQueryDto } from 'common/dtos/list.dto'

export class IListLogsQueryDto extends ListQueryDto {
  @ApiProperty()
  startTime: string

  @ApiProperty()
  endTime: string
}

export class ILog {
  @ApiProperty()
  operator: string

  @ApiProperty()
  group: string

  @ApiProperty()
  objectType: string

  @ApiProperty()
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'

  @ApiProperty()
  source: string

  @ApiProperty()
  time: string

  @ApiProperty()
  detail: string
}

export class IListLogsResponse {
  @ApiProperty({ type: ILog })
  logs: ILog[]

  @ApiProperty()
  totalCount: number

  @ApiProperty()
  tenants: string[]

  @ApiProperty()
  methods: string[]

  @ApiProperty()
  objectTypes: string[]

  @ApiProperty()
  sources: string[]
}
