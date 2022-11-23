import { ISdu, ISduAZ } from 'swagger-api/v1/models'

type AZ_TYPE = 'kubernetes' | 'bromo'

interface IRowKeyValue {
  sduName: string
  azName: string
  type: AZ_TYPE
  componentTypeDisplay: string
  index: number
  clusterId?: string
}

export const generateRowKey = (rowKeyArguments: IRowKeyValue) => {
  const { sduName, azName, type, componentTypeDisplay, index, clusterId } = rowKeyArguments
  return `${sduName}-${azName}-${type}-${componentTypeDisplay}-${clusterId}-${index}`
}

export interface ISpannedAz extends ISduAZ {
  sduName: string
  instancesCount: number
  span: number
  rowKey: string
}

export const transformSdusToSpannedAzs = (sdus: ISdu[]): ISpannedAz[] => {
  const spanAzList: ISpannedAz[] = []
  sdus.forEach(({ name: sduName, azs, instancesCount }) => {
    azs.forEach((az, index) => {
      const { name: azName, type, clusterId, componentTypeDisplay } = az
      const spanAz = {
        sduName,
        instancesCount,
        ...az,
        span: index === 0 ? azs.length : 0,
        rowKey: generateRowKey({ sduName, azName, type, clusterId, componentTypeDisplay, index })
      }

      spanAzList.push(spanAz)
    })
  })
  return spanAzList
}
/**
 * check if a html element and it's forefather elements have a certain class name until the endForefatherElement
 */
export const doesElementHasClass = (
  element: HTMLElement,
  queryClass: string,
  endForefatherElementTagName: string
): boolean => {
  const currentElementClassName = element.className
  if (typeof currentElementClassName === 'string' && currentElementClassName.includes(queryClass)) return true

  const currentElementTagName = element.tagName
  if (currentElementTagName === endForefatherElementTagName) {
    return false
  } else {
    const fatherElement = element.parentElement
    return doesElementHasClass(fatherElement, queryClass, endForefatherElementTagName)
  }
}

// target envs order: LIVE>LIVEISH>UAT>STAGING>STABLE>TEST>Others
export const sortEnvs = (envs: string[]): string[] => {
  const envPriorityList: { env: string; priority: number }[] = [
    {
      env: 'LIVE',
      priority: 0
    },
    {
      env: 'LIVEISH',
      priority: 1
    },
    {
      env: 'UAT',
      priority: 2
    },
    {
      env: 'STAGING',
      priority: 3
    },
    {
      env: 'STABLE',
      priority: 4
    },
    {
      env: 'TEST',
      priority: 5
    }
  ]
  const OTHER_ENV_PRIORITY = 20
  const priorityEnvs = envs.map(env => {
    const matchedEnv = envPriorityList.find(({ env: targetEnv, priority }) => {
      const targetEnvRegexp = new RegExp(`^${targetEnv}$`, 'i')
      return targetEnvRegexp.test(env)
    })
    return matchedEnv || { env, priority: OTHER_ENV_PRIORITY }
  })
  const sortedEnvs = priorityEnvs
    .sort((previousItem, currentItem) => previousItem?.priority - currentItem.priority)
    .map(priorityEnv => priorityEnv.env)
  return sortedEnvs
}
