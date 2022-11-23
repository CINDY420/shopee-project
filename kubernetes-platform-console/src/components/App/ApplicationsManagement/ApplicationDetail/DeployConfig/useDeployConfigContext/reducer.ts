import {
  IState,
  FORM_TYPE
} from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/useDeployConfigContext'
import { Dispatch } from 'react'
import { ICountryAZ } from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/CountryAZ'
import { IIClusterInstance, IResourceOverride, IScheduler, ISelector, IStrategyOverride } from 'swagger-api/v1/models'
import { IOverrideFormValue } from 'components/App/ApplicationsManagement/ApplicationDetail/DeployConfig/ListView/Strategy'
import { pickBy, pick } from 'lodash'

export enum ACTION_TYPES {
  ENABLE_EDIT,
  CANCEL_EDIT,
  UPDATE_IDC_TYPE_LIST,
  UPDATE_DEPLOY_CONFIG,
  UPDATE_ERRORS,
  UPDATE_DEPLOY_CONFID_FORMS,
  UPDATE_COUNTRY_AZS_OPTIONS,
  UPDATE_NEW_DEPLOY_CONFIG,
  UPDATE_BROMO_AZS,
  UPDATE_BROMO_COMPONENT,
  NAME_MAP,
  HYBRID_DEPLOY_TENANTS
}

export enum EXTRA_CONFIG_KEYS {
  K8S_GROUP = 'k8s_Group',
  K8S_REPLICAS = 'k8s_replicas',
  K8S_CANARY_REPLICAS = 'k8s_canary_replicas',
  EXTRA_HOSTS = 'extra_hosts',
  K8S_USE_ACTUAL_IDC = 'k8s_use_actual_idc',
  K8S_KEEP_SMB_SMOKE = 'k8s_keep_smb_smoke',
  K8S_MESOS_ZK = 'k8s_mesos_zk',
  K8S_MAX_SURGE = 'k8s_max_surge',
  K8S_MAX_UNAVAILABLE = 'k8s_max_unavailable',
  K8S_CANARY_PERCENTAGE = 'k8s_canary_percentage',
  PLATFORM_CLUSTER = 'platform_cluster',
  TERMINATION_GRACE_PERIOD_SECONDS = 'termination_grace_period_seconds',
  K8S_HOST_NETWORK = 'k8s_host_network'
}

export enum UNIT_TYPE {
  CANARY = 'canary',
  CANARY_PERCENT = 'canary_percent'
}

export enum IN_PLACE_TYPE {
  NOT_IN_PLACE = 'Not In Place',
  IN_PLACE = 'In Place',
  STRICT_IN_PLACE = 'Strict In Place'
}

export enum STRATEGY_TYPE {
  ROLLING_UPDATE = 'ROLLING_UPDATE_STRATEGY',
  RECREATE = 'RECREATE_STRATEGY'
}

export interface IBaseAction {
  type: ACTION_TYPES
  deployConfig?: IState['deployConfig']
  formType?: FORM_TYPE
  deployConfigForms?: Partial<IState['deployConfigForms']>
  newDeployConfig?: Omit<IState['newDeployConfig'], 'annotations' | 'envs' | 'scheduler'> & {
    scheduler: {
      assignment_policies: IScheduler['assignment_policies']
    }
  }
  countryAzsOptions?: IState['countryAzsOptions']
  componentType?: IState['componentType']
  nameMap?: IState['nameMap']
  hybridDeployTenants?: IState['hybridDeployTenants']
}

export const reducer = (state: IState, action: IBaseAction): IState => {
  switch (action.type) {
    case ACTION_TYPES.ENABLE_EDIT:
      return {
        ...state,
        isEditing: true
      }

    case ACTION_TYPES.CANCEL_EDIT:
      return {
        ...state,
        componentType: {
          bromo: [],
          nonBromo: []
        },
        isEditing: false
      }

    case ACTION_TYPES.UPDATE_DEPLOY_CONFIG: {
      const { deployConfig } = action

      return {
        ...state,
        newDeployConfig: deployConfig,
        deployConfig
      }
    }

    case ACTION_TYPES.UPDATE_DEPLOY_CONFID_FORMS: {
      const { deployConfigForms } = action
      return {
        ...state,
        deployConfigForms: {
          ...state.deployConfigForms,
          ...deployConfigForms
        }
      }
    }

    case ACTION_TYPES.UPDATE_COUNTRY_AZS_OPTIONS: {
      const { countryAzsOptions } = action

      return {
        ...state,
        countryAzsOptions
      }
    }

    case ACTION_TYPES.UPDATE_ERRORS: {
      const { formType } = action
      const { deployConfigForms } = state
      const fieldErrors = deployConfigForms[formType]?.getFieldsError()
      const hasError = fieldErrors?.some(fieldError => fieldError.errors.length)

      return {
        ...state,
        errors: {
          ...state.errors,
          [formType]: hasError
        }
      }
    }

    case ACTION_TYPES.UPDATE_NEW_DEPLOY_CONFIG: {
      const { newDeployConfig } = action
      const { scheduler, ...restNewDeployConfig } = newDeployConfig
      return {
        ...state,
        newDeployConfig: {
          ...state.newDeployConfig,
          ...restNewDeployConfig,
          scheduler: {
            ...state.newDeployConfig.scheduler,
            ...scheduler
          }
        }
      }
    }

    case ACTION_TYPES.UPDATE_BROMO_COMPONENT: {
      const { componentType } = action

      return {
        ...state,
        componentType
      }
    }

    case ACTION_TYPES.NAME_MAP: {
      const { nameMap } = action

      return {
        ...state,
        nameMap
      }
    }

    case ACTION_TYPES.HYBRID_DEPLOY_TENANTS: {
      const { hybridDeployTenants } = action

      return {
        ...state,
        hybridDeployTenants
      }
    }
    default: {
      return state
    }
  }
}

interface IResourcesFormValues {
  cpu: number
  gpu?: number
  mem: number | string
  otherMemory?: string
  disk?: number
}

export const getConvertedFormValues = async (deployConfigForms: IState['deployConfigForms']) => {
  const newDeployConfig: IBaseAction['newDeployConfig'] = {
    idcs: undefined,
    instances: undefined,
    minimum_instances: undefined,
    resources: undefined,
    component_type: undefined,
    component_type_overrides: undefined,
    deploy_zones: undefined,
    resources_override: undefined,
    scheduler: {
      assignment_policies: undefined
    },
    strategy: undefined,
    k8s_strategy: undefined,
    cluster_instance: undefined,
    jenkins_config: undefined,
    strategy_override: undefined
  }

  const extraConfigBooleanKeys = [
    EXTRA_CONFIG_KEYS.K8S_USE_ACTUAL_IDC,
    EXTRA_CONFIG_KEYS.K8S_KEEP_SMB_SMOKE,
    EXTRA_CONFIG_KEYS.K8S_MESOS_ZK,
    EXTRA_CONFIG_KEYS.K8S_HOST_NETWORK
  ]
  const extraConfigNumberKeys = [
    EXTRA_CONFIG_KEYS.K8S_REPLICAS,
    EXTRA_CONFIG_KEYS.K8S_CANARY_REPLICAS,
    EXTRA_CONFIG_KEYS.TERMINATION_GRACE_PERIOD_SECONDS
  ]
  const convertExtraConfigType = (key: EXTRA_CONFIG_KEYS, value: string | boolean | number) => {
    if (extraConfigBooleanKeys.includes(key)) {
      return value === 'true' || value === true
    } else if (extraConfigNumberKeys.includes(key)) {
      return typeof value === 'string' ? parseInt(value) : value
    }
    return value
  }

  // Country AZ
  const countryAzsFormValues = await deployConfigForms[FORM_TYPE.COUNTRY_AZ].validateFields()
  const { idcs } = countryAzsFormValues
  const convertedIdcs = Object.entries(idcs).map(([key, value]: [string, ICountryAZ[]]) => {
    const idcsValues = value.reduce((obj: IState['deployConfig']['idcs'], item: ICountryAZ) => {
      if (item?.cid) {
        obj[item.cid] = item?.azs
      }
      return obj
    }, {})

    return {
      [key]: idcsValues
    }
  })
  newDeployConfig.idcs = convertedIdcs?.[0]

  // Zone Manager
  if (deployConfigForms[FORM_TYPE.ZONE_MANAGEMENT]) {
    const zoneManagerFormValues = await deployConfigForms[FORM_TYPE.ZONE_MANAGEMENT].validateFields()
    const { deploy_zones } = zoneManagerFormValues
    newDeployConfig.deploy_zones = deploy_zones
  }

  // Component Type
  const componentTypeFormValues = await deployConfigForms[FORM_TYPE.COMPONENT_TYPE].validateFields()
  const { component_type, component_type_overrides } = componentTypeFormValues
  newDeployConfig.component_type = [{ workload_type: component_type }]
  newDeployConfig.component_type_overrides = component_type_overrides

  // Resources
  const resourcesFormValues = await deployConfigForms[FORM_TYPE.RESOURCES].validateFields()
  const { resources, resources_override } = resourcesFormValues
  const resourcesArray = Object.entries(resources).map(([key, value]: [string, IResourcesFormValues]) => {
    const { otherMemory, ...restValue } = value
    if (otherMemory) {
      restValue.mem = otherMemory
    }
    return {
      [key]: pickBy(restValue)
    }
  })
  newDeployConfig.resources = resourcesArray?.[0]
  newDeployConfig.resources_override = resources_override?.map((item: IResourceOverride) => {
    return {
      ...item,
      data: pickBy(item?.data)
    }
  })

  // Instance Count
  const instanceCountFormValues = await deployConfigForms[FORM_TYPE.INSTANCE_COUNT].validateFields()
  const { instances } = instanceCountFormValues
  const instanceEnv = Object.keys(instances)[0]

  const instanceCount = instances[instanceEnv]
  const formatInstanceCount = instanceCount?.reduce(
    (acc: Record<string, Record<string, Record<string, number>>>, curr: { cid: string }) => {
      const { cid, ...rest } = curr
      const res = { [cid]: rest }
      return { ...acc, ...res }
    },
    {}
  )
  newDeployConfig.instances = {
    [instanceEnv]: formatInstanceCount
  }

  // Minimum Instance Count
  const minimumInstanceCountFormValues = await deployConfigForms[FORM_TYPE.MINIMUM_INSTANCE_COUNT].validateFields()
  const { minimumInstance } = minimumInstanceCountFormValues
  const minimumInstanceEnv = Object.keys(minimumInstance)[0]
  const minimumInstanceCount = minimumInstance[minimumInstanceEnv]
  const formatMinimumInstanceCount = minimumInstanceCount?.reduce(
    (acc: Record<string, Record<string, Record<string, number>>>, curr: { cid: string }) => {
      const { cid, ...rest } = curr
      const res = { [cid]: rest }
      return { ...acc, ...res }
    },
    {}
  )
  newDeployConfig.minimum_instances = {
    [minimumInstanceEnv]: formatMinimumInstanceCount
  }

  // Canary Deployment
  const canaryDeploymentFormValues = await deployConfigForms[FORM_TYPE.CANARY_DEPLOYMENT].validateFields()
  const { initialCanaryCount, multiStageType, finalCanaryTarget, stageCount } = canaryDeploymentFormValues
  const formatStageCount =
    multiStageType === UNIT_TYPE.CANARY_PERCENT
      ? stageCount?.map(stage => `${stage}%`)
      : stageCount?.map(stage => `${stage}`)
  const stageCountArray = finalCanaryTarget ? formatStageCount : undefined

  const canaryCount = initialCanaryCount?.reduce((acc, curr) => {
    const { cid, ...rest } = curr
    const res = { [cid]: rest }
    return { ...acc, ...res }
  }, {})

  const formatCanaryInstance: IIClusterInstance[] = []
  const finalTarget: Record<string, Record<string, number>> = {}
  Object.entries(canaryCount).forEach(([cid, idcs]) => {
    finalTarget[cid] = {}
    Object.entries(idcs).forEach(([az, count]) => {
      finalTarget[cid][az] = parseInt(finalCanaryTarget)
      formatCanaryInstance.push({
        cid,
        idc: az,
        canary_init_count: count
      })
    })
  })
  newDeployConfig.cluster_instance = formatCanaryInstance
  if (finalCanaryTarget) {
    const finalCanaryTargetType = finalCanaryTarget.toString().includes('%')
      ? UNIT_TYPE.CANARY_PERCENT
      : UNIT_TYPE.CANARY
    newDeployConfig.instances[finalCanaryTargetType] = finalTarget
  }

  // Strategy
  if (deployConfigForms[FORM_TYPE.STRAEGY]) {
    const strategyFormValues = await deployConfigForms[FORM_TYPE.STRAEGY].validateFields()
    const {
      k8sStrategy,
      override,
      max_unavailable,
      max_surge,
      deploymentStrategy,
      in_place,
      step_down,
      enable_canary_replacement
    } = strategyFormValues

    const formatOverride = override?.reduce((acc: IStrategyOverride[], curr: IOverrideFormValue) => {
      const { idcs, data, ...info } = curr
      const res = idcs?.map(az => {
        return {
          idc: az,
          data: data?.name === 'RECREATE_STRATEGY' ? pick(data, ['name']) : data,
          ...info
        }
      })
      return acc.concat(res)
    }, [])

    newDeployConfig.strategy_override = formatOverride

    if (deploymentStrategy) {
      const strategy = {
        name: deploymentStrategy,
        parameters: {
          canary_stages: stageCountArray,
          in_place: in_place === IN_PLACE_TYPE.IN_PLACE || in_place === IN_PLACE_TYPE.STRICT_IN_PLACE,
          strict_in_place: in_place === IN_PLACE_TYPE.STRICT_IN_PLACE,
          step_down: typeof step_down === 'number' ? step_down : undefined,
          threshold: typeof step_down === 'string' ? parseInt(step_down) : undefined,
          enable_canary_replacement
        }
      }
      newDeployConfig.strategy = strategy
    }
    if (k8sStrategy) {
      const formatK8sStrategy = { name: undefined, parameters: undefined }
      formatK8sStrategy.name = k8sStrategy
      if (k8sStrategy === 'ROLLING_UPDATE_STRATEGY') {
        formatK8sStrategy.parameters = {
          max_unavailable,
          max_surge
        }
      }
      newDeployConfig.k8s_strategy = formatK8sStrategy
    }
  }

  if (deployConfigForms[FORM_TYPE.EXTRA_CONFIG]) {
    // Extra Config
    const extraConfigFormValues = await deployConfigForms[FORM_TYPE.EXTRA_CONFIG].validateFields()
    const { extraConfig } = extraConfigFormValues
    const formatExtraConfig = extraConfig?.reduce((acc, curr) => {
      const obj = { [curr.key]: convertExtraConfigType(curr.key, curr.value) }
      return { ...acc, ...obj }
    }, {})
    newDeployConfig.jenkins_config = JSON.stringify(formatExtraConfig)
  }

  // Assignment Policy
  if (deployConfigForms[FORM_TYPE.ASSIGNMENT_POLICIES]) {
    const assignmentPolicyFormValues = await deployConfigForms[FORM_TYPE.ASSIGNMENT_POLICIES].validateFields()
    const { selectors, max_instances, unique_key } = assignmentPolicyFormValues
    const formatSelectors = selectors?.map((selector: ISelector) => {
      const { value, ...restSelector } = selector
      return value.length === 1
        ? { ...restSelector, value: selector.value[0] }
        : { ...restSelector, values: selector.value }
    })
    const formatAssignmentPolicy = [
      {
        name: 'AGENT_SELECTORS',
        parameters: {
          selectors: formatSelectors
        }
      },
      {
        name: 'MAX_PER_UNIQUE_KEY',
        parameters: {
          unique_key,
          max_instances
        }
      }
    ]
    newDeployConfig.scheduler.assignment_policies = formatAssignmentPolicy
  }

  return newDeployConfig
}

export const getDispatchers = (dispatch: Dispatch<IBaseAction>) => ({
  enableEdit: () => dispatch({ type: ACTION_TYPES.ENABLE_EDIT }),
  cancelEdit: () => dispatch({ type: ACTION_TYPES.CANCEL_EDIT }),
  updateDeployConfig: (deployConfig: IState['deployConfig']) =>
    dispatch({ type: ACTION_TYPES.UPDATE_DEPLOY_CONFIG, deployConfig }),
  updateErrors: (formType: FORM_TYPE) => dispatch({ type: ACTION_TYPES.UPDATE_ERRORS, formType }),
  updateDeployConfigForms: (deployConfigForms: IState['deployConfigForms']) =>
    dispatch({ type: ACTION_TYPES.UPDATE_DEPLOY_CONFID_FORMS, deployConfigForms }),
  updateCountryAzsOptions: (countryAzsOptions: IState['countryAzsOptions']) =>
    dispatch({ type: ACTION_TYPES.UPDATE_COUNTRY_AZS_OPTIONS, countryAzsOptions }),
  updateNewDeployConfig: (newDeployConfig: IBaseAction['newDeployConfig']) =>
    dispatch({ type: ACTION_TYPES.UPDATE_NEW_DEPLOY_CONFIG, newDeployConfig }),
  updateBromoComponent: (componentType: IState['componentType']) =>
    dispatch({ type: ACTION_TYPES.UPDATE_BROMO_COMPONENT, componentType }),
  updateNameMap: (nameMap: IState['nameMap']) => dispatch({ type: ACTION_TYPES.NAME_MAP, nameMap }),
  updateHybridDeployTenants: (hybridDeployTenants: IState['hybridDeployTenants']) =>
    dispatch({ type: ACTION_TYPES.HYBRID_DEPLOY_TENANTS, hybridDeployTenants })
})
