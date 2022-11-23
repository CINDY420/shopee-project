import fetch from 'helpers/fetch'

export interface IOpenApiGetPodTerminalSessionIdParams {
  clusterId: string
  namespace: string
  podName: string
  containerName: string
}

export interface IGetPodTerminalSessionId {
  sessionId: string
}

type OpenApiGetPodTerminalSessionIdFn = (
  params: IOpenApiGetPodTerminalSessionIdParams,
) => Promise<IGetPodTerminalSessionId>

export const openApiGetPodTerminalSessionId: OpenApiGetPodTerminalSessionIdFn = async ({
  clusterId,
  namespace,
  podName,
  containerName,
}) => {
  const body = await fetch({
    resource: `ws/api/${clusterId}/${namespace}/${podName}/${containerName}/shell`,
    method: 'GET',
  })

  return body
}
