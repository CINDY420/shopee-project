import { ApplicationEntity } from '@/entities/application.entity'

export function getServiceName(serviceNamePrefix: string, app: ApplicationEntity) {
  return `${serviceNamePrefix}.${app.cmdbProjectName}${app.cmdbModuleName}`
}
