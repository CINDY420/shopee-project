import { METHODS } from 'common/interfaces/jest.interface'
import { createApplicationPayload } from 'test/constants'
import { generateName } from 'test/helpers'

const { request, env, k8sManager } = global as any
const { groupName, projectName } = env

describe('get: tenants/:groupName/projects/:projectName/apps', () => {
  let appName: string
  beforeEach(async () => {
    appName = generateName()

    await k8sManager.createApplication(appName)
  })

  afterEach(async () => {
    await k8sManager.deleteApplication(appName)
  })
  it('p1: should list applications successfully', () => {
    return request({ url: `/tenants/${groupName}/projects/${projectName}/apps`, method: METHODS.GET }).expect(200)
  })
})

describe('get: tenants/:groupName/projects/:projectName/apps/:appName', () => {
  let appName: string
  beforeEach(async () => {
    appName = generateName()

    await k8sManager.createApplication(appName)
  })

  afterEach(async () => {
    await k8sManager.deleteApplication(appName)
  })
  it('p1: should get application successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${projectName}/apps/${appName}`,
      method: METHODS.GET
    }).expect(200)
  })
})

describe('delete: tenants/:groupName/projects/:projectName/apps/:appName', () => {
  let appName: string
  beforeEach(async () => {
    appName = generateName()
    await k8sManager.createApplication(appName)
  })

  afterEach(async () => {
    const result = await k8sManager.getApplication(appName)
    if (result) {
      await k8sManager.deleteApplication(appName)
    }
  })

  it('p1: should delete application successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${projectName}/apps/${appName}`,
      method: METHODS.DELETE
    }).expect(200)
  })
})

describe('post: tenants/:groupName/projects/:projectName/apps', () => {
  let appName: string
  let payload

  beforeEach(() => {
    appName = generateName()

    payload = {
      appName,
      ...createApplicationPayload
    }
  })

  afterEach(async () => {
    await k8sManager.deleteApplication(appName)
  })

  it('p1: should create application successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${projectName}/apps`,
      method: METHODS.POST
    })
      .send({ ...payload })
      .expect(201)
  })
})

describe('get: tenants/:groupName/projects/:projectName/apps/:appName/deploysFilterInfo', () => {
  let name: string
  beforeEach(async () => {
    name = generateName()

    await k8sManager.createApplication(name)
    await k8sManager.createDeployment(name)
  })

  afterEach(async () => {
    await k8sManager.deleteDeployment(name)
    await k8sManager.deleteApplication(name)
  })
  it('p1: should get deploys filter info successfully', () => {
    const isValidFilter = (res) => {
      expect(res.body).toHaveProperty('cids')
      expect(res.body).toHaveProperty('envs')
      expect(res.body).toHaveProperty('clusters')
      expect(res.body).toHaveProperty('name')
    }

    return request({
      url: `/tenants/${groupName}/projects/${projectName}/apps/${name}/deploysFilterInfo`,
      method: METHODS.GET
    })
      .expect(200)
      .then(isValidFilter)
  })
})

describe('get: tenants/{groupName}/projects/{projectName}/apps/{appName}/deploys', () => {
  let name: string
  beforeEach(async () => {
    name = generateName()

    await k8sManager.createApplication(name)
    await k8sManager.createDeployment(name)
  })

  afterEach(async () => {
    await k8sManager.deleteDeployment(name)
    await k8sManager.deleteApplication(name)
  })

  it('p1: should list application deploys successfully', () => {
    const isValidDeploys = function (res) {
      expect(res.body).toHaveProperty('deploys')
      expect(res.body.deploys.length).toBe(1)
    }

    return request({
      url: `/tenants/${groupName}/projects/${projectName}/apps/${name}/deploys`,
      method: METHODS.GET
    })
      .query({
        env: 'TEST'
      })
      .expect(200)
      .then(isValidDeploys)
  })
})
