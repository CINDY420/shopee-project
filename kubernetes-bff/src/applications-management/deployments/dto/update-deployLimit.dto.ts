import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  ValidateNested,
  IsPositive,
  Max
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

class PhaseResource {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  container: string

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Max(64)
  cpuLimit: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  memLimit: number
}

export class Phase {
  @ApiProperty()
  phase: string

  @ApiProperty({ type: [PhaseResource] })
  @ValidateNested({ each: true })
  @Type(() => PhaseResource)
  @IsArray()
  @ArrayMinSize(1)
  resource: PhaseResource[]
}

export class UpdateDeployLimitBody {
  @ApiProperty({ type: [Phase] })
  @ValidateNested({ each: true })
  @Type(() => Phase)
  @IsArray()
  @ArrayMinSize(1)
  phases: Phase[]

  @ApiProperty()
  appInstanceName: string
}

export class UpdateDeployLimitResponse {}
