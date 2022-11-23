import {
  METRIC_TYPE,
  HPA_TRIGGER_LOGIC,
  TRIGGER_RULE_TYPE,
  HPA_STATUS,
  HPA_CRON_RULE_REPEAT_TYPE,
  HPA_CRON_RULE_WEEK_DAY,
  HPA_SCALE_POLICY_TYPE,
  HPA_SELECT_POLICY_TYPE,
} from '@/common/constants/hpa'

export interface IOpenApiHpaMeta {
  az: string
  sdu: string
}

interface IOpenApiHpaTriggerRuleAutoscalingRule {
  metrics: METRIC_TYPE
  // 0-100
  threshold: number
}
interface IOpenApiHpaTriggerRuleCronRule {
  repeatType: HPA_CRON_RULE_REPEAT_TYPE
  startTime: string
  endTime: string
  targetCount: number
  startWeekday?: HPA_CRON_RULE_WEEK_DAY
  endWeekday?: HPA_CRON_RULE_WEEK_DAY
}
interface IOpenApiHpaTriggerRule {
  type: TRIGGER_RULE_TYPE
  autoscalingRule?: IOpenApiHpaTriggerRuleAutoscalingRule
  cronRule?: IOpenApiHpaTriggerRuleCronRule
  utilizationRule?: IOpenApiHpaTriggerRuleAutoscalingRule
}

interface IOpenApiHpaScalePolicy {
  type: HPA_SCALE_POLICY_TYPE
  value: number
  periodSeconds: number
}

interface IOpenApiHpaSpecBehaviorScaleValue {
  stabilizationWindowSeconds?: number
  notifyFailed?: boolean
  selected?: boolean
  policies?: IOpenApiHpaScalePolicy[]
  selectPolicy?: HPA_SELECT_POLICY_TYPE
}
interface IOpenApiHpaSpecBehavior {
  scaleUp?: IOpenApiHpaSpecBehaviorScaleValue
  scaleDown?: IOpenApiHpaSpecBehaviorScaleValue
}

export interface IOpenApiHpaSpec {
  autoscalingLogic: HPA_TRIGGER_LOGIC
  triggerRules: IOpenApiHpaTriggerRule[]
  behavior: IOpenApiHpaSpecBehavior
  maxReplicaCount: number
  minReplicaCount: number
  status: HPA_STATUS
  notifyChannels: string[]
  updator?: string
  updatedTime?: string
}

export interface IOpenApiHpa {
  meta: IOpenApiHpaMeta
  spec: IOpenApiHpaSpec
}

export interface IOpenApiHpaWithId extends IOpenApiHpa {
  id: number
}
