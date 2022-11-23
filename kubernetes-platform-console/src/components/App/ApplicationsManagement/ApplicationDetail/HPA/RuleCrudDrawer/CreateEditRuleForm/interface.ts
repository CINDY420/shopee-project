import { IHpaSpecScaleDirection, IHpaAutoscalingRule, IHpaCronRule, IHpaThreshold } from 'swagger-api/v1/models'
import { Moment } from 'moment-timezone'

export interface IFormHpaCronRule {
  repeatTypes: [IHpaCronRule['repeatType'], IHpaCronRule['startWeekday']] | [IHpaCronRule['repeatType']]
  timeMoments: Moment[]
  targetCount: number
}

export interface IHpaRulesWithSelected {
  autoscalingRulesSelected: boolean
  autoscalingRules: IHpaAutoscalingRule[]
  cronRulesSelected: boolean
  cronRules: IFormHpaCronRule[]
}

export interface ICreateEditRuleFormValues {
  deployment: string[]
  notifyChannels: string[]
  rules: IHpaRulesWithSelected
  scaleDirection: IHpaSpecScaleDirection
  autoscalingLogic: 'or' | 'and'
  threshold: IHpaThreshold
  status: boolean
}
