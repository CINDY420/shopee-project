import { IGetTenantMetricsResponse, IOpenApiQuota } from 'swagger-api/models'

export const DEFAULT_QUOTA_VALUE = '0'
export const DEFAULT_QUOTA = {
  cpu: Number(DEFAULT_QUOTA_VALUE),
  memory: DEFAULT_QUOTA_VALUE,
  gpu: Number(DEFAULT_QUOTA_VALUE),
}
export const generateQuota = (resourceData: IGetTenantMetricsResponse) => {
  const result: IOpenApiQuota = Object.keys(resourceData).reduce(
    (result, key) => {
      result[key] = Number(resourceData[key].quota ?? DEFAULT_QUOTA_VALUE)
      return result
    },
    { ...DEFAULT_QUOTA },
  )
  return result
}
