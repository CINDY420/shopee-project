import { IsNotEmpty, IsNumberString } from 'class-validator'

export class ListSduProjectParams {
  @IsNumberString()
  @IsNotEmpty()
  levelId: string
}

export class ListSduProjectResponse {
  projects: string[]
  level: string
  total: number
}
