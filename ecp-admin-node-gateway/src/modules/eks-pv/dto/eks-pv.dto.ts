import { IsNotEmpty, IsNumber } from 'class-validator'
import { ListQuery } from '@/helpers/query/list-query.dto'
import { Type } from 'class-transformer'

export class EksListPvParams {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  clusterId: number
}

export class EksListPvQuery extends ListQuery {}

export class PvLabel {
  key: string
  value: string
}

export class EksPvItem {
  pvName: string
  status: string
  volumeMode: string
  storage: string
  accessModes: string[]
  pvcName: string
  labels: PvLabel[]
  createTime: string
}

export class EksListPvsResponse {
  items: EksPvItem[]
  total: number
  statusList: string[]
  accessModeList: string[]
}
