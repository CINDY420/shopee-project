import { IModels } from 'src/rapper/request'

type Sdu = IModels['GET/api/ecp-cmdb/services/{serviceName}/sdus']['Res']['items'][0]
type Deployment = Sdu['deployments'][0]

export const generateBromoMonitorPlatformUrl = (sdu: Sdu) => {
  const { sdu: sduName, env, cid } = sdu
  const splitSDUName = sduName.split('-')
  const redirect = 'https://grafana.shopee.io/d/rSLj8Hxik/ssp-container?'
  const url = new URLSearchParams({
    orgId: '2',
    'var-project': splitSDUName[0],
    'var-module': splitSDUName.slice(1, -2).join('-'),
    'var-env': env ?? splitSDUName[2],
    'var-region': cid ?? splitSDUName[3],
    'var-idc': 'All',
    refresh: '10s',
  })
  if (['test'].includes(env)) {
    url.append('var-datasource', 'TEST_SMAP_THANOS_RAW')
  } else if (['uat', 'staging', 'stable'].includes(env)) {
    url.append('var-datasource', 'STAGING_SMAP_THANOS_RAW')
  } else {
    url.append('var-datasource', 'SMAP_THANOS_AGGR')
  }

  return redirect + url.toString()
}

export const generateOAMMonitorPlatformUrl = (sdu: Sdu, deployment: Deployment) => {
  const redirect = 'https://monitoring.infra.sz.shopee.io/grafana/d/YJPN5Cu7z/k8s-cluster-business?'
  const {
    identifier: { project, module },
    env,
    cid,
  } = sdu
  const { monitoringClusterName, cluster } = deployment
  const parsedClusterName = monitoringClusterName || cluster.replace(/^kube/, 'k8s')
  const url = new URLSearchParams({
    orgId: '1',
    'var-cid': cid,
    'var-cluster': parsedClusterName,
    'var-env': env,
    'var-module': `${project}-${module}`,
    'var-project': project,
  })
  return redirect + url.toString()
}

export const generateLogPlatformUrl = (sdu: Sdu) => {
  const {
    identifier: { project, module },
    env,
    cid,
  } = sdu
  const LOG_CENTER_URL = `https://${
    env === 'live' || env === 'liveish' ? 'log' : 'log.test'
  }.shopee.io/redirect-port?payload=`
  const url = `${LOG_CENTER_URL}${encodeURIComponent(
    JSON.stringify({
      project,
      module,
      env,
      cid,
      platform: 'PLATFORM_CMDB',
    }),
  )}`

  return url
}
