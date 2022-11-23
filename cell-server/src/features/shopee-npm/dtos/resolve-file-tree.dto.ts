import { IsString } from 'class-validator'

export class ResolveFileTreeParams {
  @IsString()
  // eslint-disable-next-line @typescript-eslint/naming-convention
  0: string
}

export class ResolveFileTreeBody {
  files: string[]
  moduleName: string
  version: string
}
