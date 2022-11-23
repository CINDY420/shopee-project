import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, MaxLength, MinLength, Matches, ValidateNested } from 'class-validator'

export class IStrategyTypeDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  type: string

  @ApiProperty()
  value: {
    maxSurge?: string
    maxUnavailable?: string
  }
}

export class IHealthCheckProbeDto {
  type: string
  typeValue: string
  initialDelaySeconds: number
  periodSeconds: number
  successThreshold: number
  timeoutSeconds: number
}

export class IHealthCheckDto {
  readinessProbe: IHealthCheckProbeDto
  livenessProbe?: IHealthCheckProbeDto
}

export class ICreateApplicationDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @Matches(/^[a-z][a-z0-9]*$/)
  @MaxLength(31)
  @MinLength(2)
  appName: string
}

export class IApplicationTemplate {
  @ApiProperty({ type: String })
  project: string

  @ApiProperty({ type: String })
  app: string
}
