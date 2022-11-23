interface ITags {
  envs?: string[]
  cids?: string[]
  tenants?: string[]
}

export const getTags = (resource: ITags) => {
  const { envs = [], cids = [], tenants = [] } = resource || {}
  const tags = []

  envs && envs.length && tags.push('Env: '.concat(envs.join(', ')))
  cids && cids.length && tags.push('CID: '.concat(cids.join(', ')))
  tenants && tenants.length && tags.push('Tenant: '.concat(tenants.join(', ')))

  return tags
}
