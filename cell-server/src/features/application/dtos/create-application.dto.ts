import { CurrentStageInfo } from '@/features/application/dtos/get-application.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateApplicationBody {
  @IsString()
  appName: string

  @IsString()
  cmdbProjectName: string

  @IsString()
  cmdbModuleName: string

  @IsOptional()
  @IsString()
  description?: string
}

export class RecreateApplicationParam {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  appId: number
}

export class CreateApplicationResponse {
  appId: number
  cmdbServiceId: number
  appName: string
  cmdbProjectName: string
  cmdbModuleName: string
  gitlabProjectId: number
  appDescription: string
  gitlabRepoUrl: string
  createdBy: string
  createdAt: number
  updatedBy: string
  updatedAt: number
  @ApiProperty({ type: () => CurrentStageInfo })
  appSetupProgress: CurrentStageInfo
  appStatus: number
  feWorkbenchAppId: number
}

export class QueryCreationTicketsParam {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  appId: number
}

class CreationTicket {
  id?: number
  phase?: string
}

export class QueryCreationTicketsResponse {
  cmdbTicket?: CreationTicket
  jenkinsTicket?: CreationTicket
  albTestTicket?: CreationTicket
  albLiveTicket?: CreationTicket
}

export class ValidateCMDBServiceNameBody {
  @IsString()
  cmdbProjectName: string

  @IsString()
  cmdbModuleName: string
}

export class ValidateCMDBServiceNameResponse {
  isValidateSuccess: boolean
}
