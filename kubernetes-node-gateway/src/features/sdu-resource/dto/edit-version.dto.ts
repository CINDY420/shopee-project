import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class EditVersionBody {
  @IsString()
  @IsOptional()
  unlockVersionId?: string

  @IsBoolean()
  @IsNotEmpty()
  lockAll: boolean
}
