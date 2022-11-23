export const STATUS = {
  HEALTHY: 'Healthy',
  UNHEALTHY: 'Unhealthy'
}

export const STRATEGY_TYPE = {
  RollingUpdate: 'RollingUpdate',
  ReCreate: 'ReCreate'
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

export const FTE_CONTAINER_NAME = 'egress-envoy'
export enum HPA_RULE_DRAWER_TYPE {
  CREATE = 'Create',
  EDIT = 'Edit',
  COPY = 'Copy'
}
