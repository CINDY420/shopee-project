import { TIME_UNITS } from 'constants/periodicJob'
import { LOG_PLATFORM_BASE_URL, MONITOR_PLATFORM_BASE_URL } from 'constants/server'
import { addUnitOfMemory, lowerCaseString } from 'helpers/format'
import { message } from 'infrad'
import { IPeriodicJobTemplateTask, IPeriodicJobTemplateTaskContainer } from 'swagger-api/models'
import { stringify } from 'query-string'
import { TENANT_MAP } from 'constants/tenantDetail'
import dayjs from 'dayjs'

interface IGenerateOvertime {
  runningOvertime?: number
  runningOvertimeUnit: TIME_UNITS
  pendingOvertime?: number
  pendingOvertimeUnit: TIME_UNITS
}
export interface ITaskContainers
  extends Omit<IPeriodicJobTemplateTaskContainer, 'env' | 'command'> {
  env: string
  command: string
  isInitContainer: boolean
}
export interface ITasks extends Omit<IPeriodicJobTemplateTask, 'initContainers' | 'containers'> {
  containers: ITaskContainers[]
}
export const generateContainerEnv = (env?: string) => {
  if (!env) return {}
  const result: Record<string, string> = {}
  const keyValues = env.split(';')
  keyValues.forEach((item) => {
    const [key, value] = item.trim().split(':')
    if (key && value) {
      result[key.trim()] = value.trim()
    }
  })
  return result
}
export const generateContainerCommand = (command: string) =>
  command.split(',').map((item) => item.trim())
export const transformOvertime = (time: number, unit: TIME_UNITS): number => {
  switch (unit) {
    case TIME_UNITS.MINUTES:
      return time
    case TIME_UNITS.HOURS:
      return time * 60
    case TIME_UNITS.DAYS:
      return time * 24 * 60
    default:
      return time
  }
}
export const generateOvertime = ({
  runningOvertime,
  runningOvertimeUnit,
  pendingOvertime,
  pendingOvertimeUnit,
}: IGenerateOvertime) => {
  const result: { runningOvertime?: number; pendingOvertime?: number } = {}
  if (runningOvertime) {
    result.runningOvertime = transformOvertime(runningOvertime, runningOvertimeUnit)
  }
  if (pendingOvertime) {
    result.pendingOvertime = transformOvertime(pendingOvertime, pendingOvertimeUnit)
  }
  return result
}

export const hasContainer = (tasks: ITasks[]): boolean => {
  let result = true
  const errorTaskNames: string[] = []
  tasks.forEach((task) => {
    const { containers = [], taskName } = task
    const isRightTask = containers.some((container) => !container.isInitContainer)
    if (!isRightTask) {
      result = false
      errorTaskNames.push(taskName)
    }
  })
  if (!result) {
    message.error(`Task ${errorTaskNames.join(', ')} need at least one container`)
  }
  return result
}

export const generateSubmitTask = (tasks: ITasks[]) =>
  tasks.map((task) => {
    const { containers: totalContainers = [], ...rest } = task
    const initContainers: IPeriodicJobTemplateTaskContainer[] = []
    const containers: IPeriodicJobTemplateTaskContainer[] = []
    totalContainers.forEach((container) => {
      const { env, command, image, resource, volumeMounts, isInitContainer } = container
      const { requests } = resource
      const formatContainer: IPeriodicJobTemplateTaskContainer = {
        env: generateContainerEnv(env),
        command: generateContainerCommand(command),
        image,
        resource: {
          requests: {
            ...requests,
            memory: addUnitOfMemory(requests.memory),
          },
        },
        volumeMounts,
      }
      isInitContainer ? initContainers.push(formatContainer) : containers.push(formatContainer)
    })
    return {
      ...rest,
      containers,
      initContainers,
    }
  })

interface IGenerateLogUrl {
  jobName: string
  logStore: string
  dateTime: {
    start: number
    end: number
  }
}
export const generateLogUrl = ({ jobName, logStore, dateTime }: IGenerateLogUrl): string => {
  if (!logStore) {
    message.warning('LogStore is empty.')
    return ''
  }
  const querys = stringify({
    'enable-long-history-search': 0,
    'log-search-filters': '[]',
    'log-search-input': '',
    'pipeline-search-filter': '[]',
    'search-type': 'pipeline',
    'pipeline-search-input': `*|logsearch \`@file_name:/.*${jobName}.*/\``,
    'search-version-type': 'v2',
    'selected-logstores': logStore,
    'time-zone': 8,
    'date-time': JSON.stringify({
      type: 'abs',
      start: dayjs.unix(dateTime.start).valueOf(),
      end: dateTime.end ? dayjs.unix(dateTime.end).valueOf() : new Date().getTime(),
    }),
  })
  return `${LOG_PLATFORM_BASE_URL}?${querys}`
}

interface IGenerateMonitorUrl {
  jobName: string
  clusterName: string
  tenantName: string
  projectName: string
}
export const generateMonitorUrl = ({
  jobName,
  clusterName,
  tenantName,
  projectName,
}: IGenerateMonitorUrl): string => {
  const querys = stringify({
    orgId: '38',
    'var-cluster': clusterName,
    'var-tenant_name': lowerCaseString(
      (TENANT_MAP[tenantName] || tenantName).replace(/[\s|.]/g, '-'),
    ),
    'var-project_name': projectName.replace(/_/g, '-'),
    'var-job': jobName,
    'var-pod': 'All',
  })
  return `${MONITOR_PLATFORM_BASE_URL}?${querys}`
}
