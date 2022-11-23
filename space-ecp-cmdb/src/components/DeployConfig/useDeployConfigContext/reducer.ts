/* eslint-disable complexity */
import { IState, FormType } from 'src/components/DeployConfig/useDeployConfigContext'
import { Dispatch } from 'react'
import { ICountryAZ } from 'src/components/DeployConfig/ListView/CountryAZ'
import { IOverrideFormValue } from 'src/components/DeployConfig/ListView/Strategy'
import { pickBy, pick } from 'lodash'
import { IModels } from 'src/rapper/request'
import { IScheduler, ISelector } from 'src/components/DeployConfig/ListView/AssignmentPolicy'
import { IExtraConfigsFormType } from 'src/components/DeployConfig/ListView/ExtraConfig'
import { IInitialCanaryCount } from 'src/components/DeployConfig/ListView/CanaryDeployment'
import { IComponentTypeOverride } from 'src/components/DeployConfig/ListView/ComponentType'
import { UNIT } from 'src/components/DeployConfig/ListView/Resources/DefaultResourcesForm'
import { StorageType } from 'src/components/DeployConfig/ListView/Storage'

type DeployConfig = IModels['GET/api/ecp-cmdb/deploy-config/commits']['Res']['commits'][0]['data']
type IStorage = DeployConfig['storage']
type IResource =
  IModels['GET/api/ecp-cmdb/deploy-config/commits']['Res']['commits'][0]['data']['resources_override'][0]['data']

export interface IClusterInstance {
  canary_init_count: number
  cid: string
  idc: string
}
export interface ICanaryInstanceWithoutMultipleCanaryStage {
  canary: number
  cid: string
  idc: string
}
export interface IStrategyOverride {
  cid: string
  data: {
    name?: string
    parameters?: {
      max_surge?: string
      max_unavailable?: string
    }
  }
  idc: string
}

export interface ICid {
  key: string
  value: string
  label: string
  tip: string
  isMask?: boolean
}
export enum ActionTypes {
  UPDATE_CIDS,
  UPDATE_CURRENT_COMMIT,
  UPDATE_ENV,
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
  HYBRID_DEPLOY_TENANTS,
  IS_K8S_ONLY,
  UPDATE_WORKLOADS,
  UPDATE_TEXTAREA,
  RECORD_UPDATED_CID_AZ,
}

export enum ExtraConfigKeys {
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
  K8S_HOST_NETWORK = 'k8s_host_network',
}

export enum UnitType {
  CANARY = 'canary',
  CANARY_PERCENT = 'canary_percent',
}

export enum InPlaceType {
  NOT_IN_PLACE = 'Not In Place',
  IN_PLACE = 'In Place',
  STRICT_IN_PLACE = 'Strict In Place',
}

export enum StrategyType {
  ROLLING_UPDATE = 'ROLLING_UPDATE_STRATEGY',
  RECREATE = 'RECREATE_STRATEGY',
}

export enum DEPLOYMENT_STRATEGY_TYPE {
  BLUE_GREEN_STRATEGY = 'BLUE_GREEN_STRATEGY',
  REPLACEMENT_STRATEGY = 'REPLACEMENT_STRATEGY',
  HYBRID_STRATEGY = 'HYBRID_STRATEGY',
}

export interface IBaseAction {
  type: ActionTypes
  deployConfig?: IState['deployConfig']
  formType?: FormType
  deployConfigForms?: Partial<IState['deployConfigForms']>
  newDeployConfig?: Omit<IState['newDeployConfig'], 'scheduler'> & {
    scheduler: {
      assignment_policies: IScheduler['assignment_policies']
    }
  }
  countryAzsOptions?: IState['countryAzsOptions']
  componentType?: IState['componentType']
  nameMap?: IState['nameMap']
  hybridDeployTenants?: IState['hybridDeployTenants']
  env?: IState['env']
  currentCommit?: IState['currentCommit']
  cids?: IState['cids']
  strategyEngine?: IState['strategyEngine']
  workloads?: IState['workloads']
  textarea?: string
  updatedCidAz?: IState['updatedCidAz']
}

export const reducer = (state: IState, action: IBaseAction): IState => {
  switch (action.type) {
    case ActionTypes.UPDATE_CIDS: {
      const { cids } = action
      return {
        ...state,
        cids,
      }
    }

    case ActionTypes.UPDATE_ENV: {
      const { env } = action
      return {
        ...state,
        env,
      }
    }

    case ActionTypes.UPDATE_CURRENT_COMMIT: {
      const { currentCommit } = action
      return {
        ...state,
        currentCommit,
      }
    }

    case ActionTypes.ENABLE_EDIT:
      return {
        ...state,
        isEditing: true,
      }

    case ActionTypes.CANCEL_EDIT:
      return {
        ...state,
        componentType: {
          bromo: [],
          nonBromo: [],
        },
        isEditing: false,
      }

    case ActionTypes.UPDATE_DEPLOY_CONFIG: {
      const { deployConfig } = action

      return {
        ...state,
        newDeployConfig: deployConfig,
        deployConfig,
      }
    }

    case ActionTypes.UPDATE_DEPLOY_CONFID_FORMS: {
      const { deployConfigForms } = action
      return {
        ...state,
        deployConfigForms: {
          ...state.deployConfigForms,
          ...deployConfigForms,
        },
      }
    }

    case ActionTypes.UPDATE_COUNTRY_AZS_OPTIONS: {
      const { countryAzsOptions } = action

      return {
        ...state,
        countryAzsOptions,
      }
    }

    case ActionTypes.UPDATE_ERRORS: {
      const { formType } = action
      const { deployConfigForms } = state
      const fieldErrors = deployConfigForms[formType]?.getFieldsError()
      const hasError = fieldErrors?.some((fieldError) => fieldError.errors.length)

      return {
        ...state,
        errors: {
          ...state.errors,
          [formType]: hasError,
        },
      }
    }

    case ActionTypes.UPDATE_NEW_DEPLOY_CONFIG: {
      const { newDeployConfig } = action
      const { scheduler, ...restNewDeployConfig } = newDeployConfig
      return {
        ...state,
        newDeployConfig: {
          ...state.newDeployConfig,
          ...restNewDeployConfig,
          scheduler: {
            ...state.newDeployConfig.scheduler,
            ...scheduler,
          },
        },
      }
    }

    case ActionTypes.UPDATE_BROMO_COMPONENT: {
      const { componentType } = action

      return {
        ...state,
        componentType,
      }
    }

    case ActionTypes.NAME_MAP: {
      const { nameMap } = action

      return {
        ...state,
        nameMap,
      }
    }

    case ActionTypes.HYBRID_DEPLOY_TENANTS: {
      const { hybridDeployTenants } = action

      return {
        ...state,
        hybridDeployTenants,
      }
    }

    case ActionTypes.IS_K8S_ONLY: {
      const { strategyEngine } = action

      return {
        ...state,
        strategyEngine,
      }
    }

    case ActionTypes.UPDATE_WORKLOADS: {
      const { workloads } = action

      return {
        ...state,
        workloads,
      }
    }

    case ActionTypes.UPDATE_TEXTAREA: {
      const { textarea } = action

      return {
        ...state,
        textarea,
      }
    }

    case ActionTypes.RECORD_UPDATED_CID_AZ: {
      const { updatedCidAz } = action

      return {
        ...state,
        updatedCidAz,
      }
    }

    default: {
      return state
    }
  }
}

interface IResourcesFormValues {
  cpu: number
  disk?: number
  gpu?: number
  mem?: number
  mem_unit: string
  shared_mem?: number
  shared_mem_unit: string
}

export interface IFormVolume {
  cid: string
  mount_path: string
  [index: string]: string
}
interface IFusefsFormValue {
  user_account: string
  mount_path: string
  local_mount_path: string
  project_path: string
}
interface IFusefsOverrideFormValue {
  cid: string
  az: string
  data: IFusefsFormValue
}
export interface IStorageFormValues {
  storage: {
    enable: boolean
    name: string
    volumes: IFormVolume[]
  }
  fusefs: IFusefsFormValue
  fusefs_overrides: IFusefsOverrideFormValue[]
}

// eslint-disable-next-line complexity
export const getConvertedFormValues = async (
  deployConfigForms: IState['deployConfigForms'],
  deployConfig: DeployConfig,
) => {
  const { envs, annotations } = deployConfig
  const newDeployConfig: IBaseAction['newDeployConfig'] = {
    annotations_global: undefined,
    annotations: undefined,
    envs: undefined,
    idcs: undefined,
    instances: undefined,
    minimum_instances: undefined,
    resources: undefined,
    component_type: undefined,
    component_type_overrides: undefined,
    deploy_zones: undefined,
    resources_override: undefined,
    scheduler: {
      assignment_policies: undefined,
    },
    strategy: undefined,
    cluster_instance: undefined,
    jenkins_config: undefined,
    strategy_override: undefined,
    storage: undefined,
  }

  const extraConfigBooleanKeys = [
    ExtraConfigKeys.K8S_USE_ACTUAL_IDC,
    ExtraConfigKeys.K8S_KEEP_SMB_SMOKE,
    ExtraConfigKeys.K8S_MESOS_ZK,
    ExtraConfigKeys.K8S_HOST_NETWORK,
  ]
  const extraConfigNumberKeys = [
    ExtraConfigKeys.K8S_REPLICAS,
    ExtraConfigKeys.K8S_CANARY_REPLICAS,
    ExtraConfigKeys.TERMINATION_GRACE_PERIOD_SECONDS,
  ]

  const convertExtraConfigType = (key: ExtraConfigKeys, value: string | boolean | number) => {
    if (extraConfigBooleanKeys.includes(key)) {
      return value === 'true' || value === true
    }
    if (extraConfigNumberKeys.includes(key)) {
      return typeof value === 'string' ? parseInt(value) : value
    }
    return value
  }

  newDeployConfig.envs = envs
  newDeployConfig.annotations = annotations

  // Country AZ
  const countryAzsFormValues = await deployConfigForms[FormType.COUNTRY_AZ].validateFields()
  const { idcs } = countryAzsFormValues
  const convertedIdcs = Object.entries(idcs).map(([key, value]: [string, ICountryAZ[]]) => {
    const idcsValues = value.reduce((obj: IState['deployConfig']['idcs'], item: ICountryAZ) => {
      if (item?.cid) {
        // @ts-expect-error rapper cannot handle complex object type
        obj[item.cid] = item?.azs
      }
      return obj
    }, {})

    return {
      [key]: idcsValues,
    }
  })
  newDeployConfig.idcs = convertedIdcs?.[0]
  // Zone Manager
  if (deployConfigForms[FormType.ZONE_MANAGEMENT]) {
    const zoneManagerFormValues = await deployConfigForms[FormType.ZONE_MANAGEMENT].validateFields()
    const { deploy_zones } = zoneManagerFormValues
    newDeployConfig.deploy_zones = deploy_zones
  }

  // Component Type
  const componentTypeFormValues = await deployConfigForms[FormType.COMPONENT_TYPE].validateFields()
  const { workload_type, component_type_overrides, orchestrator } = componentTypeFormValues

  const formattedComponetTypeOverrides: IComponentTypeOverride[] = component_type_overrides?.map(
    (override: IComponentTypeOverride) => {
      const { data, cid, idc } = override
      const { workload_type, orchestrator } = data
      return {
        cid,
        data: {
          workload_type,
          orchestrator: workload_type === 'bromo' ? orchestrator ?? '' : undefined,
        },
        idc,
      }
    },
  )

  const componentType = {
    workload_type,
    orchestrator: workload_type === 'bromo' ? orchestrator ?? '' : undefined,
  }
  newDeployConfig.component_type = [componentType]
  newDeployConfig.component_type_overrides = formattedComponetTypeOverrides

  // Resources
  const resourcesFormValues = await deployConfigForms[FormType.RESOURCES].validateFields()
  const { resources, resources_override } = resourcesFormValues
  const resourcesArray = Object.entries(resources).map(
    ([key, value]: [string, IResourcesFormValues]) => {
      const { mem, shared_mem, mem_unit, shared_mem_unit, cpu, gpu, disk } = pickBy(value)
      const obj: IResource = {
        cpu,
        disk,
        gpu,
      }
      if (mem) {
        obj.mem = mem_unit === UNIT.MB ? mem : mem * 1024
      }
      if (shared_mem) {
        obj.shared_mem = shared_mem_unit === UNIT.MB ? shared_mem : shared_mem * 1024
      }
      return {
        [key]: { ...obj },
      }
    },
  )
  newDeployConfig.resources = resourcesArray?.[0]
  newDeployConfig.resources_override = resources_override?.map(
    (item: { cid: string; idc: string; data: IResourcesFormValues }) => {
      const { cid, idc, data } = item
      const { mem, shared_mem, mem_unit, shared_mem_unit, cpu, disk, gpu } = pickBy(data)
      const obj: IResource = {
        cpu,
        disk,
        gpu,
      }
      if (mem) {
        obj.mem = mem_unit === UNIT.MB ? mem : mem * 1024
      }
      if (shared_mem) {
        obj.shared_mem = shared_mem_unit === UNIT.MB ? shared_mem : shared_mem * 1024
      }
      return idc === 'N/A' ? { cid, data: { ...obj } } : { cid, data: { ...obj }, idc }
    },
  )

  // Storage
  const storageFormValues: IStorageFormValues = await deployConfigForms[
    FormType.STORAGE
  ].validateFields()
  const { storage, fusefs, fusefs_overrides } = storageFormValues
  const { enable, name, volumes: formValueVolumes } = storage

  if (enable) {
    if (name === StorageType.USS) {
      const cidAzPvArr = formValueVolumes?.flatMap((formValueVolume) => {
        const { cid, mount_path, ...cidAzsPvs } = formValueVolume

        const cidAzPv = Object.entries(cidAzsPvs)?.map(([az, pvc]) => ({
          idc: az,
          pvc: pvc ?? '',
        }))
        return {
          cid,
          mount_path,
          pvcs: cidAzPv,
        }
      })
      const storageValues: IStorage = {
        name,
        volumes: cidAzPvArr,
      }

      newDeployConfig.storage = storageValues
    } else {
      const { mount_path, local_mount_path, user_account, project_path } = fusefs
      const formattedFuseFsOverride = fusefs_overrides?.map((item) => {
        const { cid, az, data } = item
        const { mount_path, local_mount_path, project_path } = data
        return {
          cid,
          az: az === 'N/A' ? undefined : az,
          data: {
            user_account,
            mount_path,
            local_mount_path: mount_path + local_mount_path,
            project_path,
          },
        }
      })
      const data = {
        name: 'FuseFS',
        fusefs: {
          user_account,
          mount_path,
          local_mount_path: mount_path + local_mount_path,
          project_path,
        },
        fusefs_overrides: formattedFuseFsOverride,
      }
      newDeployConfig.storage = data
    }
  }

  // Instance Count
  const instanceCountFormValues = await deployConfigForms[FormType.INSTANCE_COUNT].validateFields()
  const { instances } = instanceCountFormValues
  const instanceEnv = Object.keys(instances)[0]

  const instanceCount = instances[instanceEnv]
  const formatInstanceCount = instanceCount?.reduce(
    (acc: Record<string, Record<string, number>>, curr: { cid: string }) => {
      const { cid, ...rest } = curr
      const res = { [cid]: rest }
      return { ...acc, ...res }
    },
    {},
  )
  newDeployConfig.instances = {
    [instanceEnv]: formatInstanceCount,
  }

  // Minimum Instance Count
  const minimumInstanceCountFormValues = await deployConfigForms[
    FormType.MINIMUM_INSTANCE_COUNT
  ].validateFields()
  const { minimumInstance } = minimumInstanceCountFormValues
  const minimumInstanceEnv = Object.keys(minimumInstance)[0]
  const minimumInstanceCount = minimumInstance[minimumInstanceEnv]
  const formatMinimumInstanceCount = minimumInstanceCount?.reduce(
    (acc: Record<string, Record<string, number>>, curr: { cid: string }) => {
      const { cid, ...rest } = curr
      const res = { [cid]: rest }
      return { ...acc, ...res }
    },
    {},
  )
  newDeployConfig.minimum_instances = {
    [minimumInstanceEnv]: formatMinimumInstanceCount,
  }

  // Canary Deployment
  const canaryDeploymentFormValues = await deployConfigForms[
    FormType.CANARY_DEPLOYMENT
  ].validateFields()
  const {
    initialCanaryCount,
    isMultipleStagesCanary,
    multiStageType,
    finalCanaryTarget,
    stageCount,
  } = canaryDeploymentFormValues
  const formatStageCount =
    (multiStageType === UnitType.CANARY_PERCENT
      ? stageCount?.map((stage: number | string) => `${stage}%`)
      : stageCount?.map((stage: number | string) => `${stage}`)) ?? []
  const stageCountArray = finalCanaryTarget ? formatStageCount : undefined

  const canaryCount = initialCanaryCount?.reduce(
    (acc: IInitialCanaryCount, curr: IInitialCanaryCount) => {
      const { cid, ...rest } = curr
      const res = { [cid]: rest }
      return { ...acc, ...res }
    },
    {},
  )

  const formatCanaryInstance: IClusterInstance[] = []
  const finalTarget: Record<string, Record<string, number>> = {}
  Object.entries(canaryCount).forEach(([cid, idcs]) => {
    finalTarget[cid] = {}
    Object.entries(idcs).forEach(([az, count]) => {
      finalTarget[cid][az] = parseInt(finalCanaryTarget)
      formatCanaryInstance.push({
        canary_init_count: count,
        cid,
        idc: az,
      })
    })
  })
  newDeployConfig.cluster_instance = formatCanaryInstance
  if (!isMultipleStagesCanary) {
    newDeployConfig.instances = { canary: canaryCount, ...newDeployConfig.instances }
  }
  if (finalCanaryTarget) {
    const finalCanaryTargetType = finalCanaryTarget.toString().includes('%')
      ? UnitType.CANARY_PERCENT
      : UnitType.CANARY
    // @ts-expect-error rapper cannot handle complex object type
    newDeployConfig.instances[finalCanaryTargetType] = finalTarget
  }

  // Strategy
  if (deployConfigForms[FormType.STRAEGY]) {
    const strategyFormValues = await deployConfigForms[FormType.STRAEGY].validateFields()
    const {
      k8sStrategy,
      override,
      max_unavailable,
      max_surge,
      deploymentStrategy,
      in_place,
      step_down,
      enable_canary_replacement,
    } = strategyFormValues

    const formatOverride =
      override?.reduce((acc: IStrategyOverride[], curr: IOverrideFormValue) => {
        const { idcs, data, ...info } = curr
        const res = idcs?.map((az) => ({
          idc: az,
          data: data?.name === 'RECREATE_STRATEGY' ? pick(data, ['name']) : data,
          ...info,
        }))
        return acc.concat(res)
      }, []) ?? []

    if (k8sStrategy && deploymentStrategy) {
      // bromo goes into strategy
      const strategy = {
        name: deploymentStrategy,
        parameters: {
          canary_stages: stageCountArray,
          in_place: in_place === InPlaceType.IN_PLACE || in_place === InPlaceType.STRICT_IN_PLACE,
          strict_in_place: in_place === InPlaceType.STRICT_IN_PLACE,
          step_down: typeof step_down === 'number' ? step_down : undefined,
          threshold: typeof step_down === 'string' ? parseInt(step_down) : undefined,
          enable_canary_replacement,
        },
      }
      newDeployConfig.strategy = strategy

      // ecp goes into overrides
      const formatK8sStrategy: IStrategyOverride['data'] = {}
      formatK8sStrategy.name = k8sStrategy
      if (k8sStrategy === 'ROLLING_UPDATE_STRATEGY') {
        formatK8sStrategy.parameters = {
          max_surge,
          max_unavailable,
        }
      }

      const globalOverride = { cid: 'default', data: formatK8sStrategy }
      formatOverride.push(globalOverride)
    } else if (deploymentStrategy) {
      const strategy = {
        name: deploymentStrategy,
        parameters: {
          canary_stages: stageCountArray,
          in_place: in_place === InPlaceType.IN_PLACE || in_place === InPlaceType.STRICT_IN_PLACE,
          strict_in_place: in_place === InPlaceType.STRICT_IN_PLACE,
          step_down: typeof step_down === 'number' ? step_down : undefined,
          threshold: typeof step_down === 'string' ? parseInt(step_down) : undefined,
          enable_canary_replacement,
        },
      }
      newDeployConfig.strategy = strategy
    } else if (k8sStrategy) {
      const formatK8sStrategy = { name: '', parameters: {} }
      formatK8sStrategy.name = k8sStrategy
      if (k8sStrategy === 'ROLLING_UPDATE_STRATEGY') {
        formatK8sStrategy.parameters = {
          max_surge,
          max_unavailable,
        }
      }
      newDeployConfig.strategy = formatK8sStrategy
    }
    newDeployConfig.strategy_override = formatOverride.length !== 0 ? formatOverride : undefined
  }

  if (deployConfigForms[FormType.EXTRA_CONFIG]) {
    // Extra Config
    const extraConfigFormValues = await deployConfigForms[FormType.EXTRA_CONFIG].validateFields()
    const { extraConfig } = extraConfigFormValues
    const formatExtraConfig = extraConfig?.reduce(
      (acc: IExtraConfigsFormType, curr: IExtraConfigsFormType) => {
        const obj = { [curr.key]: convertExtraConfigType(curr.key, curr.value) }
        return { ...acc, ...obj }
      },
      {},
    )
    newDeployConfig.jenkins_config = JSON.stringify(formatExtraConfig)
  }

  // Assignment Policy
  if (deployConfigForms[FormType.ASSIGNMENT_POLICIES]) {
    const assignmentPolicyFormValues = await deployConfigForms[
      FormType.ASSIGNMENT_POLICIES
    ].validateFields()
    const { selectors, max_instances, unique_key, enable } = assignmentPolicyFormValues

    if (enable) {
      const formatSelectors = selectors?.map((selector: ISelector) => {
        const { value, ...restSelector } = selector
        return Array.isArray(value)
          ? { ...restSelector, values: selector.value }
          : { ...restSelector, value: selector.value }
      })
      const formatAssignmentPolicy = []
      if (formatSelectors && formatSelectors.length !== 0) {
        formatAssignmentPolicy.push({
          name: 'AGENT_SELECTORS',
          parameters: {
            selectors: formatSelectors,
          },
        })
      }
      if (unique_key !== undefined || max_instances !== undefined) {
        formatAssignmentPolicy.push({
          name: 'MAX_PER_UNIQUE_KEY',
          parameters: {
            unique_key: unique_key?.length !== 0 ? unique_key : undefined,
            max_instances,
          },
        })
      }
      newDeployConfig.scheduler.assignment_policies =
        formatAssignmentPolicy.length !== 0 ? formatAssignmentPolicy : undefined
    }
  }

  // Annotations
  if (deployConfigForms[FormType.ANNOTATIONS]) {
    const globalAnnotations = await deployConfigForms[FormType.ANNOTATIONS].validateFields()
    const { annotations, enable } = globalAnnotations
    if (enable) {
      const formattedAnnotations = annotations?.reduce(
        (acc: Record<string, string>, curr: { key: string; value: string }) => {
          const obj = { [`custom.ecp.shopee.io/${curr.key}`]: curr.value }
          return { ...acc, ...obj }
        },
        {},
      )
      newDeployConfig.annotations_global = formattedAnnotations
    }
  }
  console.log('newDeployConfig', newDeployConfig)
  return newDeployConfig
}

export const getDispatchers = (dispatch: Dispatch<IBaseAction>) => ({
  enableEdit: () => dispatch({ type: ActionTypes.ENABLE_EDIT }),
  cancelEdit: () => dispatch({ type: ActionTypes.CANCEL_EDIT }),
  updateDeployConfig: (deployConfig: IState['deployConfig']) =>
    dispatch({ type: ActionTypes.UPDATE_DEPLOY_CONFIG, deployConfig }),
  updateErrors: (formType: FormType) => dispatch({ type: ActionTypes.UPDATE_ERRORS, formType }),
  updateDeployConfigForms: (deployConfigForms: IState['deployConfigForms']) =>
    dispatch({ type: ActionTypes.UPDATE_DEPLOY_CONFID_FORMS, deployConfigForms }),
  updateCountryAzsOptions: (countryAzsOptions: IState['countryAzsOptions']) =>
    dispatch({ type: ActionTypes.UPDATE_COUNTRY_AZS_OPTIONS, countryAzsOptions }),
  updateNewDeployConfig: (newDeployConfig: IBaseAction['newDeployConfig']) =>
    dispatch({ type: ActionTypes.UPDATE_NEW_DEPLOY_CONFIG, newDeployConfig }),
  updateBromoComponent: (componentType: IState['componentType']) =>
    dispatch({ type: ActionTypes.UPDATE_BROMO_COMPONENT, componentType }),
  updateNameMap: (nameMap: IState['nameMap']) => dispatch({ type: ActionTypes.NAME_MAP, nameMap }),
  updateHybridDeployTenants: (hybridDeployTenants: IState['hybridDeployTenants']) =>
    dispatch({ type: ActionTypes.HYBRID_DEPLOY_TENANTS, hybridDeployTenants }),
  updateEnv: (env: IState['env']) => dispatch({ type: ActionTypes.UPDATE_ENV, env }),
  updateCurrentCommit: (currentCommit: IState['currentCommit']) =>
    dispatch({ type: ActionTypes.UPDATE_CURRENT_COMMIT, currentCommit }),
  updateCids: (cids: IState['cids']) => dispatch({ type: ActionTypes.UPDATE_CIDS, cids }),
  updateStrategyEngine: (strategyEngine: IState['strategyEngine']) =>
    dispatch({ type: ActionTypes.IS_K8S_ONLY, strategyEngine }),
  updateWorkloads: (workloads: IState['workloads']) =>
    dispatch({ type: ActionTypes.UPDATE_WORKLOADS, workloads }),
  updateTextarea: (textarea: IState['textarea']) =>
    dispatch({ type: ActionTypes.UPDATE_TEXTAREA, textarea }),
  recordUpdatedCidAz: (updatedCidAz: IState['updatedCidAz']) =>
    dispatch({ type: ActionTypes.RECORD_UPDATED_CID_AZ, updatedCidAz }),
})
