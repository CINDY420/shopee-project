import { ScaleDeploymentParam } from '@/modules/deployment/dtos/scale-deployment.dto'
import { DeploymentHistory } from '@/modules/sdu/dtos/list-sdus-history.dto'

export class GetDeploymentHistoryParam extends ScaleDeploymentParam {}

export class GetDeploymentHistoryResponse {
  items: DeploymentHistory[]
  total: number
}
