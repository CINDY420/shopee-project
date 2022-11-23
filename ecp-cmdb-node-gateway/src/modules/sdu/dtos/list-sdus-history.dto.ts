import { Container } from '@/modules/sdu/dtos/list-sdu.dto'
import { IsNotEmpty, IsString } from 'class-validator'

export class ListSDUsHistoryQuery {
  @IsNotEmpty()
  @IsString()
  sdus: string
}

export class DeploymentHistory {
  containers: Container[]
  deploymentId: string
  lastDeployed: number
}

export class ListSDUsHistoryResponse {
  items: string[]
  total: number
}
