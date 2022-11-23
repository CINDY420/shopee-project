import { IsNotEmpty, IsString } from 'class-validator'

export class GetDeploymentMetaParam {
  @IsString()
  @IsNotEmpty()
  sduName: string

  @IsString()
  @IsNotEmpty()
  deployId: string
}

class Container {
  phase: string
  name: string
  image: string
  tag: string
}

export class GetDeploymentMetaResponse {
  project: string
  module: string
  env: string
  cid: string
  azV1: string
  azV2: string
  deployEngine: string
  cluster: string
  clusterType: string
  componentType: string
  releaseInstances: number
  canaryInstances: number
  containers: Container[]
}
