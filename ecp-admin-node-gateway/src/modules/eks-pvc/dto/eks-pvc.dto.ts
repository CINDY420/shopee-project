import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'
import { ListQuery } from '@/helpers/query/list-query.dto'
import { Type } from 'class-transformer'

export class EksListPvcParams {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  clusterId: number
}

export class EksListPvcQuery extends ListQuery {}

export class PvcLabel {
  key: string
  value: string
}

export class EksPvcItem {
  pvcName: string
  status: string
  storage: string
  accessModes: string[]
  pvName: string
  labels: PvcLabel[]
  updateTime: string
}

export class EksListPvcResponse {
  items: EksPvcItem[]
  total: number
  statusList: string[]
  accessModeList: string[]
}

export class EksGetPvcNamespaceParam {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  clusterId: number
}

export class EksGetPvcNamespaceQuery {
  @IsOptional()
  @IsString()
  searchBy?: string
}

export class EksGetPvcNamespaceResponse {
  namespaceList: string[]
}
