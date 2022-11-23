export const ENGINE_JENKINS = 'jenkins'

export const DEFAULT_LIMIT = 20
export const DEFAULT_OFFSET = 0
export const MAX_LIMIT = 100000

export const DEFAULT_PIPELINE_CONFIG = {
  DEPLOY_DEFINITION: 'deploy/demo.json',
  K8S_REPLICAS: 1,
  K8S_MAX_SURGE: '25%',
  K8S_MAX_UNAVALIABLE: '25%',
  K8S_CANARY_REPLICAS: 1,
  K8S_CANARY_PERCENTAGE: '25%',
  TERMINATION_GRACE_PERIOD_SECONDS: 30
}

export const ENGINE = {
  ENGINE_SG_NON_LIVE: 'jenkins-sg-nonlive',
  ENGINE_SG_LIVE: 'jenkins-sg-live'
}

export const MIGRATION_FAILED = 'failed'
export const TEMPLATE = {
  K8S_TEMPLATE: 'k8s-deploy-shared-library',
  NON_K8S_TEMPLATE: 'deploy-shared-library',
  CUSTOM_TEMPLATE: 'custom'
}
