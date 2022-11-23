import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { ListQueryDto } from 'common/dtos/index'

export class ApplicationTerminalLogsQueryDto extends ListQueryDto {
  @ApiPropertyOptional()
  startTime: string

  @ApiPropertyOptional()
  endTime: string
}

export class Log {
  @ApiProperty()
  container: string

  @ApiProperty()
  detail: string

  @ApiProperty()
  nodeIP: string

  @ApiProperty()
  nodeName: string

  @ApiProperty()
  operator: string

  @ApiProperty()
  podIP: string

  @ApiProperty()
  podName: string

  @ApiProperty()
  time: string

  @ApiProperty()
  sessionId: string
}

export class ApplicationTerminalLogsResponseDto {
  @ApiProperty({ type: [Log] })
  data: Log[]

  @ApiProperty()
  totalCount: number
}

export class EsTerminalLog {
  email: string
  name: string
  nodeName: string
  nodeIP: string
  pod: string
  podIP: string
  container: string
  requestQuery: string
  requestCmd: string
  sessionId: string
}
