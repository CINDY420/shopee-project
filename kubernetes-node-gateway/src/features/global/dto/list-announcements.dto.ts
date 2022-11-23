import { Type } from 'class-transformer'
import { IsNumber, IsOptional } from 'class-validator'

export class ListAnnouncementsQuery {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  tenant: number
}

export class ListAnnouncementsResponse {
  announcements: string[]
  total: number
}
