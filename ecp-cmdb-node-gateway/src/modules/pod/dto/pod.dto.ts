import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'
import { IModels } from '@/rapper/cmdb/request'
import { ListQuery } from '@/helpers/models/list-query.dto'
import { Transform, Type } from 'class-transformer'
export class ListDeploymentPodParam {
  @IsNotEmpty()
  @IsString()
  sduName: string

  @IsNotEmpty()
  @IsString()
  deployId: string
}

export class ListDeploymentPodQuery extends ListQuery {}

export class PodList {
  podName: string
  nodeName: string
  clusterName: string
  namespace: string
  sdu: string
  cid: string
  env: string
  nodeIp: string
  podIp: string
  status: string
  createdTime: number
  phase: string
  tag: string
  restartCount: number
  lastRestartTime: number
  cpu: {
    applied: number
    used: number
  }
  memory: {
    applied: number
    used: number
  }
}

export class ListDeploymentPodResponse {
  items: PodList[]
  statusList: string[]
  total: number
}

export class KillPodParam {
  @IsNotEmpty()
  @IsString()
  sduName: string

  @IsNotEmpty()
  @IsString()
  deployId: string

  @IsNotEmpty()
  @IsString()
  podName: string
}

export class KillPodBody {
  @IsNotEmpty()
  @IsString()
  clusterName: string

  @IsNotEmpty()
  @IsString()
  namespace: string
}

export type PodMetric =
  IModels['POST/ecpapi/v2/sdus/{sduName}/svcdeploys/{deployId}/pods/metrics']['Res']['items'][0]

export class BatchKillPodParam {
  @IsNotEmpty()
  @IsString()
  sduName: string

  @IsNotEmpty()
  @IsString()
  deployId: string
}

export class BatchKillPod extends KillPodBody {
  @IsNotEmpty()
  @IsString()
  podName: string
}

export class BatchKillPodBody {
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  pods: BatchKillPod[]
}

export class ListLogFilesParams {
  @IsNotEmpty()
  @IsString()
  sduName: string

  @IsNotEmpty()
  @IsString()
  deployId: string

  @IsNotEmpty()
  @IsString()
  podName: string
}

export class ListLogFilesQuery extends ListQuery {
  @IsNotEmpty()
  @IsString()
  hostIp: string
}

class LogFile {
  gid: string
  groupName: string
  isDir: boolean
  modTime: string
  mod: number
  modStr: string
  name: string
  path: string
  size: string
  uid: number
  userName: string
}

export class ListLogFilesResponse {
  items: LogFile[]
  total: number
}

export class GetLogFileContentParams extends ListLogFilesParams {}

export class GetLogFileContentQuery extends ListLogFilesQuery {
  @IsNotEmpty()
  @IsString()
  path: string

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  offset: number

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  length: number
}

export class GetLogFileContentResponse {
  fileContent: string
}

export class GetPodLogsParams {
  @IsNotEmpty()
  @IsString()
  sduName: string

  @IsNotEmpty()
  @IsString()
  deployId: string

  @IsNotEmpty()
  @IsString()
  podName: string
}

export class GetPodLogsQuery {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isPrevious?: boolean

  @IsOptional()
  @IsString()
  namespace?: string

  @IsOptional()
  @IsString()
  cluster?: string
}

export class GetPodLogsResponse {
  data: string
}
