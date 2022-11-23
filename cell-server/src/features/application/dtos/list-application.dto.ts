import { ListQuery } from '@/common/models/list-query.dto'
import { IsEnum, IsOptional } from 'class-validator'

export enum ApplicationListType {
  ALL = 'all',
  SUBSCRIPTION = 'subscription',
}
export class ListApplicationQuery extends ListQuery {
  @IsOptional()
  @IsEnum(ApplicationListType)
  type?: ApplicationListType = ApplicationListType.ALL
}

export class ApplicationData {
  appId: number
  appName: string
  cmdbProjectName: string
  cmdbModuleName: string
  gitlabProjectId: number
  cmdbServiceId: number
  gitlabRepoUrl: string
  feWorkbenchAppId: number
  appStatus: number
  createdBy: string
  createdAt: number
  subscribed: boolean
  subscribedAt?: number
}

export class ListApplicationResponse {
  items: ApplicationData[]
  total: number
}
