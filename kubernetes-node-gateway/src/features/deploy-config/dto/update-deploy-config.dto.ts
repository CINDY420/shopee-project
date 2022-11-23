import { IsStringify } from '@/common/decorators/class-validator/is-stringify'
import { IsNotEmpty, IsString } from 'class-validator'

export class UpdateDeployConfigBodyDto {
  @IsString()
  @IsNotEmpty()
  env: string

  @IsString()
  @IsNotEmpty()
  comment: string

  @IsString()
  @IsNotEmpty()
  version: string

  @IsStringify()
  deployConfig: string
}
