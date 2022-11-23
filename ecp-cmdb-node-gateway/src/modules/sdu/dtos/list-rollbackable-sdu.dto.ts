import { IsNotEmpty, IsString } from 'class-validator'

export class ListRollbackableSDUParam {
  @IsNotEmpty()
  @IsString()
  serviceName: string
}

export class ListRollbackableSDUQuery {
  @IsNotEmpty()
  @IsString()
  env: string
}

export class ListRollbackableSDUResponse {
  items: string[]
  total: number
}
