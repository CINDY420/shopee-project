const EnvMap = {
  test: 'test.',
  stable: 'test-stable.',
  uat: 'uat.',
  staging: 'staging.',
  liveish: 'live-test.',
  live: '',
  dev: '',
  qa: '',
  sit: ''
}

const CidMap = {
  sg: 'sg',
  my: 'com.my',
  ph: 'ph',
  th: 'co.th',
  vn: 'vn',
  id: 'co.id',
  tw: 'tw',
  cn: 'cn',
  br: 'com.br',
  xx: 'system'
}

export enum ISelectorValue {
  CID = '@cid',
  ENV = '@env',
  DOMAIN_ENV_FLAG = '@domain_env_flag',
  DOMAIN_CID_SUFFIX = '@domain_cid_suffix'
}

export const SelectorValueMap = {
  [ISelectorValue.CID]: 'cid',
  [ISelectorValue.ENV]: 'env',
  [ISelectorValue.DOMAIN_ENV_FLAG]: 'domain_env_flag',
  [ISelectorValue.DOMAIN_CID_SUFFIX]: 'domain_cid_suffix'
}

const envWhiteList = ['dev', 'sit', 'qa']

export const parseWildCard = (value: string, env: string, cid: string) => {
  const parsedEnv = env.toLowerCase()
  const parsedCid = cid.toLowerCase()

  const envReg = /^@env/
  if (envReg.test(value)) {
    if (envWhiteList.includes(value)) {
      return value.replace(envReg, '')
    } else {
      return value.replace(envReg, parsedEnv)
    }
  }

  const cidReg = /^@cid/
  if (cidReg.test(value)) {
    return value.replace(cidReg, parsedCid)
  }

  const flagReg = /^@domain_env_flag/
  if (flagReg.test(value)) {
    if (envWhiteList.includes(value)) {
      return value.replace(flagReg, '')
    } else {
      return value.replace(flagReg, EnvMap[parsedEnv])
    }
  }
  const suffixReg = /^@domain_cid_suffix/
  if (suffixReg.test(value)) {
    return value.replace(suffixReg, CidMap[parsedCid])
  }

  return value
}

interface IParsedServiceName {
  prefix: string
  env: string
  cid: string
}

export const parseServiceName = (serviceName: string): IParsedServiceName => {
  const serviceNameItems = serviceName.split('-')
  if (serviceNameItems.length < 3) {
    throw new Error(`Invalid service name ${serviceName}!`)
  }

  return {
    prefix: serviceNameItems[0],
    env: serviceNameItems[1],
    cid: serviceNameItems[2]
  }
}
