import { IsString } from 'class-validator'

export class ResolveNpmParams {
  @IsString()
  // eslint-disable-next-line @typescript-eslint/naming-convention
  0: string
}
export class ResolveNpmFileContent {
  fileContent: string
}
