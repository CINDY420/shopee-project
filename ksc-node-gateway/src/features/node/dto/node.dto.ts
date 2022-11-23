import { ListQuery } from '@/common/dtos/list.dto'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class NodeParams {
  @IsNotEmpty()
  @IsString()
  clusterId: string
}

export class ListNodesQuery extends ListQuery {}

export class ListClustersWithDetailQuery extends ListQuery {
  @IsOptional()
  @IsString()
  env?: string

  @IsString()
  tenantId?: string
}

export class UpdateNodeParams {
  @IsString()
  clusterId: string

  @IsString()
  nodeId: string
}
