const serverMap = {
  mock: 'http://localhost:3000',
  development: 'https://bigcompute.infra.test.shopee.io',
  production: 'https://bigcompute.infra.shopee.io',
}

export const localServer = serverMap[import.meta.env.MODE]
export const cookiePolicy = process.env.__IS_LOCAL__ ? 'single_host_origin' : 'https://shopee.io'

export const LOG_PLATFORM_BASE_URL = 'https://log.shopee.io/log-search'
export const MONITOR_PLATFORM_BASE_URL =
  'https://monitoring.infra.sz.shopee.io/grafana/d/OuoRWt_nz/batch-job-detail'

export const getTensorboradUrl = (clusterName: string, jobName: string) =>
  `https://${clusterName}.bigcompute.infra.shopee.io/webjobs/${jobName}`

interface IGetPodServiceUrl {
  clusterName: string
  namespace: string
  jobName: string
  podName: string
  podPort?: number
}
export const getPodServiceUrl = ({
  clusterName,
  namespace,
  jobName,
  podName,
  podPort = 20148,
}: IGetPodServiceUrl) => {
  if (clusterName && namespace && jobName && podName && podPort) {
    return `https://${clusterName}.bigcompute.infra.shopee.io/cis/pods/${namespace}/${jobName}/${podName}:${podPort}`
  }
  return ''
}
