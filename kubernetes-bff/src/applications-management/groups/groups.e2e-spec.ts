import { METHODS } from 'common/interfaces/jest.interface'

const { request, env, k8sManager } = global as any
const { groupName, cluster, cid } = env

describe('get: /tenants/{groupName}', () => {
  it('p1: should get group detail successfully', () => {
    const isValidGroup = (res) => {
      expect(res.body).toHaveProperty('name')
      expect(res.body).toHaveProperty('envs')
      expect(res.body).toHaveProperty('cids')
      expect(res.body).toHaveProperty('clusters')
      expect(res.body).toHaveProperty('envClusterMap')
      expect(res.body.name).toBe(groupName)
    }

    return request({
      url: `/tenants/${groupName}`,
      method: METHODS.GET
    })
      .expect(200)
      .then(isValidGroup)
  })
})

describe('get: /tenants/{groupName}/metrics', () => {
  it('p1: should get group metrics successfully', () => {
    const isValidGroupMetrics = (res) => {
      expect(res.body).toHaveProperty('cluster')
      expect(res.body).toHaveProperty('env')
      expect(res.body).toHaveProperty('quota')
    }

    return request({
      url: `/tenants/${groupName}/metrics`,
      method: METHODS.GET
    })
      .query({
        env: 'DEV',
        cluster
      })
      .expect(200)
      .then(isValidGroupMetrics)
  })
})

describe('get: /tenants/{groupName}/projectEnvQuotas', () => {
  it('p1: should get group projectEnvQuotas successfully', () => {
    const isValidGroupProjectQuota = (res) => {
      expect(res.body).toHaveProperty('clusters')
      expect(res.body.clusters.length).toBeGreaterThan(0)
    }

    return request({
      url: `/tenants/${groupName}/projectEnvQuotas`,
      method: METHODS.GET
    })
      .query({
        environments: ['DEV'],
        cids: ['SG']
      })
      .expect(200)
      .then(isValidGroupProjectQuota)
  })
})
