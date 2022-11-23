import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsEnum,
  Min,
  Max,
  IsBoolean,
  IsInt,
  IsArray,
} from 'class-validator'
import { Type } from 'class-transformer'
import {
  AUTOSCALING_METRIC_TYPE,
  HPA_TRIGGER_LOGIC,
  HPA_CRON_RULE_REPEAT_TYPE,
  HPA_CRON_RULE_WEEK_DAY,
  HPA_SCALE_POLICY_TYPE,
  HPA_SELECT_POLICY_TYPE,
} from '@/common/constants/hpa'

export class HpaMeta {
  @IsString()
  az: string

  @IsString()
  sdu: string
}
class HpaAutoscalingRule {
  @IsEnum(AUTOSCALING_METRIC_TYPE)
  metrics: AUTOSCALING_METRIC_TYPE

  // TODO huadong.chen make sure with BE if it is an integer
  // number-100
  @IsNumber()
  @Min(0)
  @Max(100)
  threshold: number
}

class HpaCronRule {
  @IsEnum(HPA_CRON_RULE_REPEAT_TYPE)
  repeatType: HPA_CRON_RULE_REPEAT_TYPE

  @IsString()
  startTime: string

  @IsString()
  endTime: string

  @IsInt()
  @Min(0)
  targetCount: number

  @IsOptional()
  @IsEnum(HPA_CRON_RULE_WEEK_DAY)
  startWeekday?: HPA_CRON_RULE_WEEK_DAY

  @IsOptional()
  @IsEnum(HPA_CRON_RULE_WEEK_DAY)
  endWeekday?: HPA_CRON_RULE_WEEK_DAY
}

class HpaRules {
  @ValidateNested()
  @Type(() => HpaAutoscalingRule)
  autoscalingRules: HpaAutoscalingRule[]

  @ValidateNested()
  @Type(() => HpaCronRule)
  cronRules: HpaCronRule[]
}

class HpaSpecScalePolicy {
  @IsEnum(HPA_SCALE_POLICY_TYPE)
  type: HPA_SCALE_POLICY_TYPE

  @IsNumber()
  value: number

  @IsNumber()
  periodSeconds: number
}
class HpaSpecScale {
  @IsOptional()
  @IsNumber()
  @Min(0)
  stabilizationWindowSeconds?: number

  @IsOptional()
  @IsBoolean()
  notifyFailed?: boolean

  @IsOptional()
  @IsBoolean()
  selected?: boolean

  @IsOptional()
  @ValidateNested()
  @Type(() => HpaSpecScalePolicy)
  policies?: HpaSpecScalePolicy[]

  @IsOptional()
  @IsEnum(HPA_SELECT_POLICY_TYPE)
  selectPolicy?: HPA_SELECT_POLICY_TYPE
}

class HpaSpecScaleDirection {
  @IsOptional()
  @ValidateNested()
  @Type(() => HpaSpecScale)
  scaleUp?: HpaSpecScale

  @IsOptional()
  @ValidateNested()
  @Type(() => HpaSpecScale)
  scaleDown?: HpaSpecScale
}

export class HpaThreshold {
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(200)
  maxReplicaCount: number

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  minReplicaCount: number
}

export class HpaSpec {
  @IsNotEmpty()
  @IsArray()
  notifyChannels: string[]

  @IsOptional()
  @IsEnum(HPA_TRIGGER_LOGIC)
  autoscalingLogic: HPA_TRIGGER_LOGIC

  @ValidateNested()
  @Type(() => HpaRules)
  rules: HpaRules

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => HpaSpecScaleDirection)
  scaleDirection: HpaSpecScaleDirection

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => HpaThreshold)
  threshold: HpaThreshold

  @IsBoolean()
  status: boolean

  @IsOptional()
  @IsString()
  updator?: string

  @IsOptional()
  @IsString()
  updatedTime?: string
}

export class HPA {
  @IsNotEmpty()
  meta: HpaMeta

  @IsNotEmpty()
  spec: HpaSpec
}

export class HPAWithId extends HPA {
  @IsNumber()
  id: number
}
