import { IsString, IsNumberString } from 'class-validator'
import { ListQuery } from '@/common/models/dtos/list-query.dto'
export class ListApplicationsParams {
  @IsNumberString()
  tenantId: string

  @IsString()
  projectName: string
}

export class GetApplicationParams {
  @IsNumberString()
  tenantId: string

  @IsString()
  projectName: string

  @IsString()
  appName: string
}

export class ListApplicationsQuery extends ListQuery {}

export class Application {
  name: string
  status: string
  cids: string[]
  environments: string[]
}
export class ListApplicationsResponse {
  apps: Application[]
  tenantName: string
  tenantId: number
  projectName: string
  totalCount: number
}

export class GetApplicationResponse {
  name: string
  tenantName: string
  tenantId: string
  projectName: string
  cids: string[]
  envs: string[]
  azs: string[]
  enableHpa: boolean
}

export class GetApplicationServiceNameParams extends GetApplicationParams {}

export class GetApplicationServiceNameResponse {
  serviceName: string
}
