import { ListQuery } from '@/helpers/models/list-query.dto'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class ListDeploymentEventsParam {
  @IsNotEmpty()
  @IsString()
  sduName: string

  @IsNotEmpty()
  @IsString()
  deployId: string
}

export class ListDeploymentEventsQuery extends ListQuery {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  startTime?: number

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  endTime?: number
}

class DeploymentEvent {
  name: string
  namespace: string
  kind: string
  reason: string
  message: string
  hostIp: string
  podIp: string
  createTime: string
}

export class ListDeploymentEventResponse {
  items: DeploymentEvent[]
  kindList: string[]
  total: number
}
