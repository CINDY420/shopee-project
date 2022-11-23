import { ENV } from '@/common/constants/project'
import { IsNotEmpty, IsString } from 'class-validator'

export class ListAllJobStatusResponse {
  total: number
  items: string[]
}

export class ListAllJobTypesResponse {
  total: number
  items: string[]
}

export class ListAllEnvsResponse {
  total: number
  items: ENV[]
}

export class ListAllProjectsParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string
}
