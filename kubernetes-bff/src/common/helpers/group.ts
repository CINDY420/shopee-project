// eslint-disable-next-line @typescript-eslint/no-var-requires
const route = require('path-match')({
  sensitive: false,
  strict: false,
  end: false
})
const groupMatch = route('/api/v3/groups/:groupName')
const tenantMatch = route('/api/v3/tenants/:tenantId')

export const generateGroupNamespace = (groupName: string, env: string, cid: string) => `${groupName}-${env}-${cid}`

export const parseGroupNamespace = (namespace: string) => {
  const [groupName, env, cid] = namespace.split('-')

  return {
    groupName,
    env,
    cid
  }
}

export const parseGroupFromPath = (path: string): string | null => {
  const params = groupMatch(path) as any
  if (params === false) {
    return null
  }
  return params.groupName
}

export const parseTenantIdFromPath = (path: string): string | null => {
  const params = tenantMatch(path) as any
  if (params === false) {
    return null
  }
  return params.tenantId
}
