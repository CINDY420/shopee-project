import { IsString, IsNumberString, IsNotEmpty } from 'class-validator'
import { ListQuery } from '@/common/models/dtos/list-query.dto'
import { DEPLOYMENT_HEALTHY, AZ_TYPE } from '@/shared/open-api/interfaces/sdu'
export class ListSdusParams {
  @IsNumberString()
  tenantId: string

  @IsString()
  projectName: string

  @IsString()
  appName: string
}

export class ListSdusQuery extends ListQuery {}

class Container {
  image: string
  name: string
  tag: string
  phase: string
}

export class SduAZ {
  name: string
  type: AZ_TYPE
  env: string
  cid: string
  // sz k8s有cluster， leap 没有
  cluster?: string
  componentType: string
  componentTypeDisplay: string
  instance: number // deployment期望实例数
  status: string
  healthy: DEPLOYMENT_HEALTHY
  // TODO huadong.chen make sure
  unhealthyCount: number
  phase: string
  tag: string
  updateTime: string
  releaseCount: number
  canaryCount: number
  clusterId: string
  canScale: boolean
  canRollback: boolean
  canFullRelease: boolean
  canRestart: boolean
  canDelete: boolean
  containers: Container[]
  appInstanceName: string
  monitoringClusterName: string
}

export class Sdu {
  // sdu name is k8s deployment name
  name: string
  azs: SduAZ[]
  instancesCount: number
}

export class ListSdusResponse {
  items: Sdu[]
  allComponentTypeDisplays: string[]
}

export class ListAllAzSdusParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  projectName: string

  @IsNotEmpty()
  @IsString()
  appName: string
}

export class SduItem {
  sduName: string
  hasHpa: boolean
}

export class AzSdu {
  azName: string
  sdus: SduItem[]
}

export class ListAllAzSdusResponse {
  items: AzSdu[]
}

export class GetSduAzsParams {
  @IsNotEmpty()
  @IsString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  projectName: string

  @IsNotEmpty()
  @IsString()
  appName: string

  @IsNotEmpty()
  @IsString()
  sduName: string
}
export class GetSduAzsResponse {
  sdu: Sdu
}
