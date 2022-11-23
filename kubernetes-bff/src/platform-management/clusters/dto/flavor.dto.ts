import { ApiProperty } from '@nestjs/swagger'

export class Flavor {
  @ApiProperty()
  cpu: number

  @ApiProperty()
  memory: number
}
export class ClusterFlavorResponse {
  @ApiProperty({ type: [Flavor] })
  flavors: Flavor[]
}

export class ClustersFlavors {
  @ApiProperty({ type: [Flavor] })
  flavors: Flavor[]

  @ApiProperty({ type: [String] })
  clusters: string[]
}

export class AddClustersFlavorsRequest {
  @ApiProperty({ type: [ClustersFlavors] })
  clustersFlavors: ClustersFlavors[]
}

export class UpdateClusterFlavorsRequest {
  @ApiProperty({ type: [Flavor] })
  added: Flavor[]

  @ApiProperty({ type: [Flavor] })
  removed: Flavor[]
}
