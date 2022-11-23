import { ApiProperty } from '@nestjs/swagger'

import { ClusterInfoDto } from './common/cluster.dto'

export class ClusterInfoListDto {
  @ApiProperty({ type: [ClusterInfoDto] })
  clusters: ClusterInfoDto[]

  @ApiProperty()
  totalCount: number
}

export class ClassNamesDto {
  @ApiProperty({ type: [String] })
  names: string[]
}
