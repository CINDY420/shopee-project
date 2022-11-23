import {
  IHealthCheckDto,
  IHealthCheckProbeDto,
  IStrategyTypeDto
} from 'applications-management/applications/dto/create-application.dto'

export const STRATEGY_TYPE = {
  RollingUpdate: 'RollingUpdate',
  ReCreate: 'Recreate'
}

export const HEALTH_CHECK_TYPE = {
  Command: 'Command',
  HTTP: 'HTTP',
  TCP: 'TCP'
}

export const HEALTH_CHECK_TYPE_TEXT = {
  [HEALTH_CHECK_TYPE.Command]: 'Command',
  [HEALTH_CHECK_TYPE.HTTP]: 'Endpoint',
  [HEALTH_CHECK_TYPE.TCP]: 'Port'
}

export const strategyExp = /^(\d|[1-9]\d)%$|^([1-9]\d{0,3})$|^(0|10000)$|^100%$/
export const strategyZeroExp = /^0$|^0%$/
export const isSecondsInvalid = (seconds) => typeof seconds !== 'number' || seconds < 0 || seconds > 10000

export const checkStrategyIsValid = (strategy: IStrategyTypeDto): string => {
  const { type, value = {} } = strategy
  if (type !== STRATEGY_TYPE.ReCreate && type !== STRATEGY_TYPE.RollingUpdate) {
    return 'The StrategyType type is invalid'
  }

  if (type === STRATEGY_TYPE.RollingUpdate) {
    const { maxSurge, maxUnavailable } = value
    if (maxSurge === undefined || maxUnavailable === undefined) {
      return 'The StrategyType value is invalid'
    }

    if (!(strategyExp.test(maxSurge) && strategyExp.test(maxUnavailable))) {
      return 'The StrategyType value range is invalid'
    }

    if (strategyZeroExp.test(maxSurge) && strategyZeroExp.test(maxUnavailable)) {
      return 'MaxSurge and MaxUnavailable can not both be 0(0%)'
    }
  }
}

export const checkProbe = (name: string, probe: IHealthCheckProbeDto): string => {
  if (typeof probe !== 'object') {
    return `${name} is invalid`
  }

  const { type, typeValue, initialDelaySeconds, periodSeconds, successThreshold, timeoutSeconds } = probe
  if (type) {
    if (type === HEALTH_CHECK_TYPE.Command || type === HEALTH_CHECK_TYPE.HTTP) {
      if (!typeValue || typeValue.length < 1 || typeValue.length > 128) {
        return `The valid ${name} typeValue length is 1~128`
      }
    } else if (type === HEALTH_CHECK_TYPE.TCP) {
      const value = Number(typeValue)
      if (isNaN(value) || value < 1 || value > 65535) {
        return `The valid ${name} typeValue range is [1, 65535]`
      }
    } else {
      return `The ${name} type is invalid`
    }
  }

  if (
    isSecondsInvalid(initialDelaySeconds) ||
    isSecondsInvalid(periodSeconds) ||
    isSecondsInvalid(successThreshold) ||
    isSecondsInvalid(timeoutSeconds)
  ) {
    return `The ${name} value is invalid`
  }
}

export const checkHealthyStatusIsValid = (healthCheck: IHealthCheckDto): string => {
  const { readinessProbe, livenessProbe } = healthCheck || {}

  const readinessError = checkProbe('Readiness', readinessProbe)
  if (readinessError) {
    return readinessError
  }

  if (livenessProbe && livenessProbe.type) {
    return checkProbe('Liveness', livenessProbe)
  }
}
