import { IsNotEmpty, IsNumberString, IsString } from 'class-validator'

export class DeleteZoneParams {
  @IsNotEmpty()
  @IsNumberString()
  tenantId: string

  @IsNotEmpty()
  @IsString()
  zoneName: string
}
