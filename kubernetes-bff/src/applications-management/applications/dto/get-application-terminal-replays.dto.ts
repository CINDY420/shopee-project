import { ApiProperty } from '@nestjs/swagger'
import { ListQueryDto } from 'common/dtos/index'

export class Replay {
  @ApiProperty()
  container: string

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

  @ApiProperty()
  duration: string
}

export class ApplicationTerminalReplaysResponseDto {
  @ApiProperty({ type: [Replay] })
  data: Replay[]

  @ApiProperty()
  totalCount: number
}

export class ApplicationTerminalReplayDetailQueryDto extends ListQueryDto {
  @ApiProperty()
  createdTime: string
}

export class EsTerminalReplay {
  email: string
  time: string
  container: string
  nodeIP: string
  nodeName: string
  podIP: string
  podName: string
  sessionId: string
  name: string
  duration: string
}

export class EsTerminalReplayFileData extends EsTerminalReplay {
  fileId: string
}
