import { METHODS } from 'common/interfaces/jest.interface'
import { createProjectPayload } from 'test/constants'
import { generateName } from 'test/helpers'

const { request, env, k8sManager } = global as any
const { groupName, projectName, cid, env: environment, cluster } = env

describe('get: /tenants/{groupName}/projects/{projectName}', () => {
  it('p1: should get project detail successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${projectName}`,
      method: METHODS.GET
    }).expect(200)
  })
})

describe('get: /tenants/{groupName}/projects/{projectName}/clusterListByConfigInfo', () => {
  it('p1: should get project cluster list by config info successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${projectName}/clusterListByConfigInfo?environments=${environment}&cid=${cid}`,
      method: METHODS.GET
    }).expect(200)
  })
})

describe('get: /tenants/{groupName}/projects', () => {
  it('p1: should get project list successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects?offset=0&limit=10&orderBy=`,
      method: METHODS.GET
    }).expect(200)
  })
})

describe('get: /tenants/{groupName}/projects/{projectName}/resourceQuotas', () => {
  it('p1: should get project resource quotas successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${projectName}/resourceQuotas`,
      method: METHODS.GET
    }).expect(200)
  })
})

describe('get: /tenants/{groupName}/projects/{projectName}/metrics', () => {
  it('p1: should get project metrics successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${projectName}/metrics?env=${environment.toUpperCase()}&cluster=${cluster}`,
      method: METHODS.GET
    }).expect(200)
  })
})

describe('post: tenants/:groupName/projects', () => {
  let project: string
  let payload

  beforeEach(() => {
    project = generateName()

    payload = {
      project,
      ...createProjectPayload
    }
  })

  afterEach(async () => {
    await k8sManager.deleteProject(project)
  })

  it('p1: should create application successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects`,
      method: METHODS.POST
    })
      .send({ ...payload })
      .expect(201)
  })
})

describe('put: tenants/:groupName/projects/{projectName}', () => {
  let project: string
  let payload

  beforeEach(async () => {
    project = generateName()

    await k8sManager.createProject(project)

    payload = {
      project,
      cids: ['ID'],
      quotas: [{ name: 'test:TEST', cpuTotal: 0.02, memoryTotal: 0.01 }]
    }
  })

  afterEach(async () => {
    await k8sManager.deleteProject(project)
  })

  it('p1: should update application successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${project}`,
      method: METHODS.PUT
    })
      .send({ ...payload })
      .expect(200)
  })
})

describe('delete: tenants/:groupName/projects', () => {
  let project: string
  let payload

  beforeEach(async () => {
    project = generateName()

    await k8sManager.createProject(project)
  })

  afterEach(async () => {
    const result = await k8sManager.getProject(project)
    if (result) {
      await k8sManager.deleteProject(project)
    }
  })

  it('p1: should delete application successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${project}`,
      method: METHODS.DELETE
    })
      .send({ ...payload })
      .expect(200)
  })
})

describe('put: /tenants/{groupName}/projects/{projectName}/resourceQuotas', () => {
  let project: string
  let payload

  beforeEach(async () => {
    project = generateName()

    await k8sManager.createProject(project)

    payload = {
      projectQuotas: [{ name: 'test:TEST', cpuTotal: 0.02, memoryTotal: 0.01 }]
    }
  })

  afterEach(async () => {
    await k8sManager.deleteProject(project)
  })

  it('p1: should update project resource quotas successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${project}/resourceQuotas`,
      method: METHODS.PUT
    })
      .send({ ...payload })
      .expect(200)
  })
})
