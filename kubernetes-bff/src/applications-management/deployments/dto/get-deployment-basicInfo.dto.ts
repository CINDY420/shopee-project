import { ApiProperty } from '@nestjs/swagger'

class ReadinessProbe {
  initialDelaySeconds: number
  periodSeconds: number
  successThreshold: number
  timeoutSeconds: number
  type: string
  typeValue: string
}

class LivenessProbe {
  postStart: string
  preStop: string
}

class HealthCheck {
  livenessProbe: any
  readinessProbe: any
}

class Phase {
  @ApiProperty()
  cpuLimit: number

  @ApiProperty()
  cpuRequest: number

  @ApiProperty()
  image: string

  @ApiProperty()
  memLimit: number

  @ApiProperty()
  memRequest: number

  @ApiProperty()
  name: string

  @ApiProperty({ type: HealthCheck })
  healthCheck: HealthCheck
}

class RollingUpdateStrategy {
  @ApiProperty()
  maxSurge: string

  @ApiProperty()
  maxUnavailable: number
}

export class GetDeploymentBasicInfoResponseDto {
  @ApiProperty()
  name: string

  @ApiProperty()
  phase: {
    [key: string]: Phase
  }

  @ApiProperty()
  pods: {
    [key: string]: number
  }

  @ApiProperty({ type: RollingUpdateStrategy })
  rollingUpdateStrategy: RollingUpdateStrategy

  @ApiProperty()
  strategy: string
}
