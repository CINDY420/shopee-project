import { IsNotEmpty, IsString } from 'class-validator'

export class ListWorkloadsQuery {
  @IsString()
  @IsNotEmpty()
  env: string
}

export class ListWorkloadsResponse {
  items: Item[]
}

class Item {
  env: string
  az: string
  workloads: Workload[]
}

class Workload {
  name: string
  nameDisplay: string
  type: string
  category: string
  orchestrators: string[]
}
