import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export enum ListApplicationsQueryScope {
  TENANT = 'tenant',
  PROJECT = 'project',
}

export class ListApplicationsQuery {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsEnum(ListApplicationsQueryScope)
  scope: ListApplicationsQueryScope
}

export class ListApplicationsResponse {
  items: string[]
}
