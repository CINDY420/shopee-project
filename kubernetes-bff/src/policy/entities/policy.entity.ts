import { EFFECT_TYPE } from 'policy/constants/policy.constant'

export interface IESPolicy {
  id?: string
  role: number
  effectiveSourceId: string
  source: string
  actions: string[]
  effect?: EFFECT_TYPE
  desc?: string
  createdAt: string
  updatedAt: string
}
