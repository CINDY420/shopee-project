export enum ReplaceType {
  ENV = 'env',
  CID = 'cid',
  CLUSTER = 'cluster'
}

const domainEnvMap = {
  TEST: 'test.',
  STABLE: 'test-stable.',
  UAT: 'uat.',
  STAGING: 'staging.',
  LIVEISH: 'live-test.',
  LIVE: ''
}
const domainCidMap = {
  SG: 'sg',
  MY: 'com.my',
  PH: 'ph',
  TH: 'co.th',
  VN: 'vn',
  ID: 'co.id',
  TW: 'tw',
  CN: 'cn',
  BR: 'com.br',
  MX: 'com.mx',
  XX: 'system'
}
const clusterSuffixesMap = {
  'kube-general-sg2-test': 'kube-general-sg2.test.i.devops.shopee.io',
  'kube-general-ctl-live': 'kube-general-ctl-live.k8s.cluster',
  'kube-general-sg-live': 'kube-general-sg-live.k8s.cluster',
  'kube-ds-sg3-live': 'kube-ds-sg3-live.k8s.cluster'
}

const replaceEnvFn = (value: string, template: string): string => {
  let replacedTemplate = template.replace(/{{env}}/g, value.toLowerCase())
  // may be an empty string
  const domain = domainEnvMap[value]
  if (domain !== undefined) {
    replacedTemplate = replacedTemplate.replace(/{{domain_env_flag}}/g, domain)
  }
  return replacedTemplate
}

const replaceCidFn = (value: string, template: string): string => {
  let replacedTemplate = template.replace(/{{cid}}/g, value.toLowerCase())
  // may be an empty string
  const suffix = domainCidMap[value]
  if (suffix !== undefined) {
    replacedTemplate = replacedTemplate.replace(/{{domain_cid_suffix}}/g, suffix)
  }
  return replacedTemplate
}

const replaceClusterFn = (value: string, template: string): string | undefined => {
  const suffix = clusterSuffixesMap[value]
  // may be an empty string
  if (suffix !== undefined) {
    const replacedTemplate = template.replace(/{{kube_cluster}}/g, suffix)
    return replacedTemplate
  }

  return undefined
}

export const replaceFnMap = {
  [ReplaceType.ENV]: replaceEnvFn,
  [ReplaceType.CID]: replaceCidFn,
  [ReplaceType.CLUSTER]: replaceClusterFn
}
