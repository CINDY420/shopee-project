import { IsNotEmpty, IsString } from 'class-validator'

export class ListProjectsQuery {
  @IsString()
  @IsNotEmpty()
  tenantId: string
}

export class ListProjectsResponse {
  items: string[]
}
