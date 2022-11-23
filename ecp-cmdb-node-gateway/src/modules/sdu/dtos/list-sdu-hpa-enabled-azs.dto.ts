import { IsNotEmpty, IsString } from 'class-validator'

export class ListSDUHpaEnabledAZsParam {
  @IsNotEmpty()
  @IsString()
  sduName: string
}

export class ListSDUHpaEnabledAZsResponse {
  azs: string[] = ['']
}
