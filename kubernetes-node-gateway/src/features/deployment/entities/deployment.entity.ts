import { IDeploymentContainer } from '@/shared/open-api/open-api.model'

export class Az {
  name: string
  type: string
  env: string
  clusters: string[]
}

export class Container implements IDeploymentContainer {
  image: string
  name: string
  tag: string
}
