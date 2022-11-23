import { HpaSpec, HPA, HPAWithId } from '@/features/hpa/entities/hpa.entity'
import { IOpenApiHpaSpec, IOpenApiHpa, IOpenApiHpaWithId } from '@/shared/open-api/entities/hpa.entity'
import { TRIGGER_RULE_TYPE, HPA_STATUS, METRIC_TYPE, AUTOSCALING_METRIC_TYPE } from '@/common/constants/hpa'

const transformHpaSpecRulesToOpenApi = (rules: HpaSpec['rules']): IOpenApiHpaSpec['triggerRules'] => {
  const { autoscalingRules = [], cronRules = [] } = rules || {}

  const openApiAutoscalingRules = autoscalingRules
    .filter(
      (rule) =>
        rule.metrics === AUTOSCALING_METRIC_TYPE.AVERAGE_CPU || rule.metrics === AUTOSCALING_METRIC_TYPE.AVERAGE_MEM,
    )
    .map((rule) => {
      const { metrics, threshold } = rule
      return {
        type: TRIGGER_RULE_TYPE.AUTOSCALING,
        autoscalingRule: {
          metrics: metrics === AUTOSCALING_METRIC_TYPE.AVERAGE_CPU ? METRIC_TYPE.CPU : METRIC_TYPE.MEMORY,
          threshold,
        },
      }
    })

  const openApiUtilizationRules = autoscalingRules
    .filter(
      (rule) =>
        rule.metrics === AUTOSCALING_METRIC_TYPE.INSTANT_CPU || rule.metrics === AUTOSCALING_METRIC_TYPE.INSTANT_MEM,
    )
    .map((rule) => {
      const { metrics, threshold } = rule
      return {
        type: TRIGGER_RULE_TYPE.UTILIZATION,
        utilizationRule: {
          metrics: metrics === AUTOSCALING_METRIC_TYPE.INSTANT_CPU ? METRIC_TYPE.CPU : METRIC_TYPE.MEMORY,
          threshold,
        },
      }
    })

  const openApiCronRules = cronRules.map((rule) => ({ type: TRIGGER_RULE_TYPE.CRON, cronRule: { ...rule } }))

  return [...openApiAutoscalingRules, ...openApiUtilizationRules, ...openApiCronRules]
}

const formatOpenApiHpaSpecTriggerRules = (triggerRules: IOpenApiHpaSpec['triggerRules'] = []): HpaSpec['rules'] => {
  const autoscalingRuleList: HpaSpec['rules']['autoscalingRules'] = []
  const cronRuleList: HpaSpec['rules']['cronRules'] = []

  triggerRules.forEach(({ type, autoscalingRule, cronRule, utilizationRule }) => {
    if (type === TRIGGER_RULE_TYPE.AUTOSCALING) {
      const { metrics, threshold = 0 } = autoscalingRule || {}
      autoscalingRule &&
        autoscalingRuleList.push({
          metrics:
            metrics === METRIC_TYPE.CPU ? AUTOSCALING_METRIC_TYPE.AVERAGE_CPU : AUTOSCALING_METRIC_TYPE.AVERAGE_MEM,
          threshold,
        })
    } else if (type === TRIGGER_RULE_TYPE.UTILIZATION) {
      const { metrics, threshold = 0 } = utilizationRule || {}
      utilizationRule &&
        autoscalingRuleList.push({
          metrics:
            metrics === METRIC_TYPE.CPU ? AUTOSCALING_METRIC_TYPE.INSTANT_CPU : AUTOSCALING_METRIC_TYPE.INSTANT_MEM,
          threshold,
        })
    } else if (type === TRIGGER_RULE_TYPE.CRON) {
      cronRule && cronRuleList.push({ ...cronRule })
    }
  })
  return { autoscalingRules: autoscalingRuleList, cronRules: cronRuleList }
}

const transformHpaSpecScaleDirectionToOpenApi = (
  scaleDirection: HpaSpec['scaleDirection'],
): {
  behavior: IOpenApiHpaSpec['behavior']
} => {
  const { scaleUp, scaleDown } = scaleDirection || {}
  const { ...scaleUpOthers } = scaleUp || {}
  const { ...scaleDownOthers } = scaleDown || {}
  return {
    behavior: {
      scaleUp: { ...scaleUpOthers },
      scaleDown: { ...scaleDownOthers },
    },
  }
}
const formatOpenApiHpaSpecBehavior = (
  openApiHpaSpecBehavior: IOpenApiHpaSpec['behavior'],
): HpaSpec['scaleDirection'] => {
  const { scaleUp, scaleDown } = openApiHpaSpecBehavior || {}
  const scaleDirection: HpaSpec['scaleDirection'] = {
    scaleUp: {
      ...scaleUp,
    },
    scaleDown: {
      ...scaleDown,
    },
  }

  return scaleDirection
}

/**
 * transform FE HPA entity to openApi HPA entity
 */
const transformHpaSpecToOpenApi = (spec: HpaSpec): IOpenApiHpaSpec => {
  const { notifyChannels, autoscalingLogic, rules, scaleDirection, threshold, status: isEnabled, ...others } = spec
  const { maxReplicaCount, minReplicaCount } = threshold
  const openApiRules = transformHpaSpecRulesToOpenApi(rules)
  const { behavior } = transformHpaSpecScaleDirectionToOpenApi(scaleDirection)

  const openApiSpec: IOpenApiHpaSpec = {
    notifyChannels,
    autoscalingLogic,
    triggerRules: openApiRules,
    behavior,
    maxReplicaCount,
    minReplicaCount,
    status: isEnabled ? HPA_STATUS.ENABLE : HPA_STATUS.DISABLE,
    ...others,
  }
  return openApiSpec
}

/**
 * format openApi HPA entity to FE HPA entity
 */
export function formatOpenApiHpaSpec(openApiSpec: IOpenApiHpaSpec): HpaSpec
export function formatOpenApiHpaSpec(openApiSpec: IOpenApiHpaSpec): HpaSpec
export function formatOpenApiHpaSpec(openApiSpec: IOpenApiHpaSpec): HpaSpec {
  const {
    notifyChannels,
    autoscalingLogic,
    triggerRules,
    behavior,
    maxReplicaCount,
    minReplicaCount,
    status,
    ...others
  } = openApiSpec
  const formattedTriggerRules = formatOpenApiHpaSpecTriggerRules(triggerRules)
  const scaleDirection = formatOpenApiHpaSpecBehavior(behavior)

  const formattedSpec: HpaSpec = {
    notifyChannels,
    autoscalingLogic,
    rules: formattedTriggerRules,
    scaleDirection,
    threshold: {
      maxReplicaCount,
      minReplicaCount,
    },
    status: status === HPA_STATUS.ENABLE,
    ...others,
  }
  return formattedSpec
}

export function transformHpaToOpenApi(hpa: HPA): IOpenApiHpa
export function transformHpaToOpenApi(hpa: HPAWithId): IOpenApiHpaWithId
export function transformHpaToOpenApi(hpa: HPA | HPAWithId) {
  const { spec, meta } = hpa
  const transformedSpec = transformHpaSpecToOpenApi(spec)
  if ('id' in hpa) {
    return { spec: transformedSpec, meta, id: hpa.id }
  } else {
    return { spec: transformedSpec, meta }
  }
}

export function formatOpenApiHpa(openApiHpa: IOpenApiHpaWithId): HPAWithId
export function formatOpenApiHpa(openApiHpa: IOpenApiHpa): HPA
export function formatOpenApiHpa(openApiHpa: IOpenApiHpa | IOpenApiHpaWithId) {
  const { spec, meta } = openApiHpa
  const formattedSpec = formatOpenApiHpaSpec(spec)
  if ('id' in openApiHpa) {
    return { spec: formattedSpec, meta, id: openApiHpa.id }
  } else {
    return { spec: formattedSpec, meta }
  }
}
