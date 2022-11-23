import { GetPodContainerParamsDto, GetPodContainerQueryDto } from './get-pod-container.dto'
import { ApiProperty } from '@nestjs/swagger'

export class File {
  @ApiProperty()
  filesize: string

  @ApiProperty()
  name: string

  @ApiProperty()
  updateTime: string
}

export class GetLogDirectoryResponseDto {
  @ApiProperty({ type: [File] })
  files: File[]
}

export class GetLogDirectoryParamsDto extends GetPodContainerParamsDto {}

export class GetLogDirectoryQueryDto extends GetPodContainerQueryDto {}

export class GetLogPreviousLogParamDto extends GetPodContainerParamsDto {}
export class GetPodPreviousLogQueryDto {
  @ApiProperty()
  clusterId: string
}

export class GetPodPreviousLogResponse {
  @ApiProperty()
  logString?: string

  @ApiProperty()
  message?: string
}
