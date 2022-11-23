import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber } from 'class-validator'

export class GetApplicationParam {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  appId: number
}

export enum CreationTaskType {
  NORMAL = 'Normal',
  POLLING = 'Polling',
}

export class CurrentTaskInfo {
  id: number
  status: number
}

export class CurrentSubTaskInfo {
  id: number
  status: number
  startTime: number
  modifyTime: number
  message: string
  taskType: CreationTaskType
}

export class CurrentStageInfo {
  task: CurrentTaskInfo
  subTask: CurrentSubTaskInfo
  data?: any
}

export class GetApplicationResponse {
  appId: number
  cmdbServiceId: number
  appName: string
  cmdbProjectName: string
  cmdbModuleName: string
  gitlabProjectId: number
  appDescription: string
  gitlabRepoUrl: string
  createdBy: string
  createdAt: number
  updatedBy: string
  updatedAt: number
  @ApiProperty({ type: () => CurrentStageInfo })
  appSetupProgress: CurrentStageInfo
  appStatus: number
  feWorkbenchAppId: number
  isFavorite: boolean
}
