import { IsOptional, IsString } from 'class-validator'

export class GetUnboundSDUsQuery {
  @IsOptional()
  @IsString()
  sduPrefix?: string
}

export class GetUnboundSDUsResponse {
  sdus: string[]
}
