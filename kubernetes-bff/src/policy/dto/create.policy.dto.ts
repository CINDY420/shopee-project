import { EFFECT_TYPE } from 'policy/constants/policy.constant'

export interface ICreatePolicyDTO {
  role: number
  effectiveSourceId: string
  source: string
  actions: string[]
  desc?: string
  effect?: EFFECT_TYPE
}
