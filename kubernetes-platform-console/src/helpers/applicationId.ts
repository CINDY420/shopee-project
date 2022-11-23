export const tenantId = (tenant: { tenantId: number }) => `tenants/${tenant.tenantId}`

export const projectId = (project: { name: string; tenantId: number }) =>
  `tenants/${project.tenantId}/projects/${project.name}`

export const applicationId = (application: { name: string; tenantId: number; projectName: string }) =>
  `tenants/${application.tenantId}/projects/${application.projectName}/applications/${application.name}`

export const serviceId = (service: { name: string; clusterId: string; tenantId: number; projectName: string }) =>
  `tenants/${service.tenantId}/projects/${service.projectName}/clusters/${service.clusterId}/services/${service.name}`

export const podId = (pod: {
  name: string
  appName: string
  clusterId: string
  tenantId: number
  projectName: string
}) =>
  `tenants/${pod.tenantId}/projects/${pod.projectName}/applications/${pod.appName}/clusters/${pod.clusterId}/pods/${pod.name}`

export const ingressId = (ingress: { name: string; tenantId: number; projectName: string; clusterId: string }) =>
  `tenants/${ingress.tenantId}/projects/${ingress.projectName}/clusters/${ingress.clusterId}/ingresses/${ingress.name}`

export const pipelineId = (groupName: string, projectName: string, appName: string, pipelineName: string) =>
  `tenants/${groupName}/projects/${projectName}/applications/${appName}/pipelines/${pipelineName}`

export const pipelineBuildId = (
  tenantId: number,
  projectName: string,
  appName: string,
  pipelineName: string,
  buildId: string
) =>
  `tenants/${tenantId}/projects/${projectName}/applications/${appName}/pipelines/${pipelineName}/pipelineBuilds/${buildId}`
