import { METHODS } from 'common/interfaces/jest.interface'
import { updateDeployLimitPayload } from 'test/constants'
import { generateName } from 'test/helpers'

const { request, env, k8sManager } = global as any
const { groupName, projectName, cid, env: environment, cluster, container } = env

describe('get: /tenants/{groupName}/projects/{projectName}/apps/{appName}/deploys/{deployName}/clusters/{clusterName}/detail', () => {
  let name: string
  let deployName: string
  beforeEach(async () => {
    name = generateName()
    deployName = `${name}-${environment.toLowerCase()}-${cid.toLowerCase()}`

    await k8sManager.createApplication(name)
    await k8sManager.createDeployment(name)
  })

  afterEach(async () => {
    await k8sManager.deleteDeployment(name)
    await k8sManager.deleteApplication(name)
  })

  it('p1: should get deploy detail successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${projectName}/apps/${name}/deploys/${deployName}/clusters/${cluster}/detail`,
      method: METHODS.GET
    })
      .query({
        clusterId: `${environment.toUpperCase()}-${cid.toUpperCase()}:${cluster}`
      })
      .expect(200)
  })
})

describe('put: /tenants/{groupName}/projects/{projectName}/apps/{appName}/deploys/{deployName}/resources', () => {
  let name: string
  let deployName: string
  beforeEach(async () => {
    name = generateName()
    deployName = `${name}-${environment.toLowerCase()}-${cid.toLowerCase()}`

    await k8sManager.createApplication(name)
    await k8sManager.createDeployment(name)
  })

  afterEach(async () => {
    await k8sManager.deleteDeployment(name)
    await k8sManager.deleteApplication(name)
  })

  it('p1: should update deploy resources successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${projectName}/apps/${name}/deploys/${deployName}/resources`,
      method: METHODS.PUT
    })
      .send({ ...updateDeployLimitPayload })
      .query({
        clusterName: cluster
      })
      .expect(200)
  })
})

describe('get: /tenants/{groupName}/projects/{projectName}/apps/{appName}/deploys/{deployName}/containers/{containerName}/tags', () => {
  let name: string
  let deployName: string
  beforeEach(async () => {
    name = generateName()
    deployName = `${name}-${environment.toLowerCase()}-${cid.toLowerCase()}`

    await k8sManager.createApplication(name)
    await k8sManager.createDeployment(name)
  })

  afterEach(async () => {
    await k8sManager.deleteDeployment(name)
    await k8sManager.deleteApplication(name)
  })

  it('p1: should get deploy tags successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${projectName}/apps/${name}/deploys/${deployName}/containers/${container}/tags`,
      method: METHODS.GET
    })
      .query({
        clusterId: `${environment.toUpperCase()}-${cid.toUpperCase()}:${cluster}`
      })
      .expect(200)
  })
})

describe('get: /tenants/{groupName}/projects/{projectName}/apps/{appName}/deploys/{deployName}/clusters/{clusterName}/basicInfo', () => {
  let name: string
  let deployName: string
  beforeEach(async () => {
    name = generateName()
    deployName = `${name}-${environment.toLowerCase()}-${cid.toLowerCase()}`

    await k8sManager.createApplication(name)
    await k8sManager.createDeployment(name)
  })

  afterEach(async () => {
    await k8sManager.deleteDeployment(name)
    await k8sManager.deleteApplication(name)
  })

  it('p1: should get deploy basic info successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${projectName}/apps/${name}/deploys/${deployName}/clusters/${cluster}/basicInfo`,
      method: METHODS.GET
    })
      .query({
        clusterId: `${environment.toUpperCase()}-${cid.toUpperCase()}:${cluster}`
      })
      .expect(200)
  })
})

describe('put: /tenants/{groupName}/projects/{projectName}/apps/{appName}/deploysscale', () => {
  let name: string
  let deployName: string
  let playLoad: any
  beforeEach(async () => {
    name = generateName()
    deployName = `${name}-${environment.toLowerCase()}-${cid.toLowerCase()}`

    await k8sManager.createApplication(name)
    await k8sManager.createDeployment(name)

    playLoad = {
      deploys: [{ name: deployName, clusterId: ':TEST-SG:test', releaseCount: 4, canaryValid: false }]
    }
  })

  afterEach(async () => {
    await k8sManager.deleteDeployment(name)
    await k8sManager.deleteApplication(name)
  })

  it('p1: should scale deploy successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${projectName}/apps/${name}/deploysscale`,
      method: METHODS.PUT
    })
      .send({ ...playLoad })
      .expect(200)
  })
})

describe('put: /tenants/{groupName}/projects/{projectName}/apps/{appName}/cancelcanary', () => {
  let name: string
  let deployName: string
  let playLoad: any
  beforeEach(async () => {
    name = generateName()
    deployName = `${name}-${environment.toLowerCase()}-${cid.toLowerCase()}`

    await k8sManager.createApplication(name)
    await k8sManager.createCanaryDeployment(name)

    playLoad = {
      deploys: [{ name: deployName, clusterId: ':TEST-SG:test' }]
    }
  })

  afterEach(async () => {
    await k8sManager.deleteDeployment(name)
    await k8sManager.deleteApplication(name)
  })

  it('p1: should cancel canary deploy successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${projectName}/apps/${name}/cancelcanary`,
      method: METHODS.PUT
    })
      .send({ ...playLoad })
      .expect(200)
  })
})

describe('put: /tenants/{groupName}/projects/{projectName}/apps/{appName}/deploysfullRelease', () => {
  let name: string
  let deployName: string
  let playLoad: any
  beforeEach(async () => {
    name = generateName()
    deployName = `${name}-${environment.toLowerCase()}-${cid.toLowerCase()}`

    await k8sManager.createApplication(name)
    await k8sManager.createCanaryDeployment(name)

    playLoad = {
      deploys: [{ name: deployName, clusterId: ':TEST-SG:test' }]
    }
  })

  afterEach(async () => {
    await k8sManager.deleteDeployment(name)
    await k8sManager.deleteApplication(name)
  })

  it('p1: should full release deploy successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${projectName}/apps/${name}/deploysfullRelease`,
      method: METHODS.PUT
    })
      .send({ ...playLoad })
      .expect(200)
  })
})

describe('put: /tenants/{groupName}/projects/{projectName}/apps/{appName}/deploysrollback', () => {
  let name: string
  let deployName: string
  let playLoad: any
  beforeEach(async () => {
    name = generateName()
    deployName = `${name}-${environment.toLowerCase()}-${cid.toLowerCase()}`

    await k8sManager.createApplication(name)
    await k8sManager.createDeployment(name)

    const { tags, name: tagName } = await k8sManager.getDeploymentTags(name, deployName)
    let image = 'harbor.test.shopeemobile.com/shopee/gxm-demo-test-sg:375f7bb0b31e'
    let tagname = '375f7bb0b31e'
    if (tags) {
      image = tags[0].image || image
      tagname = tags[0].tagname || tagname
    }

    playLoad = {
      deploys: [
        {
          name: deployName,
          clusterId: ':TEST-SG:test',
          phase: 'RELEASE',
          containers: [
            {
              name: tagName,
              image,
              tag: tagname
            }
          ]
        }
      ]
    }
  })

  afterEach(async () => {
    await k8sManager.deleteDeployment(name)
    await k8sManager.deleteApplication(name)
  })

  it('p1: should rollback deploy successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${projectName}/apps/${name}/deploysrollback`,
      method: METHODS.PUT
    })
      .send({ ...playLoad })
      .expect(200)
  })
})

describe('put: /tenants/{groupName}/projects/{projectName}/apps/{appName}/deploysrolloutRestart', () => {
  let name: string
  let deployName: string
  let playLoad: any
  beforeEach(async () => {
    name = generateName()
    deployName = `${name}-${environment.toLowerCase()}-${cid.toLowerCase()}`

    await k8sManager.createApplication(name)
    await k8sManager.createDeployment(name)

    playLoad = { deploys: [{ name: deployName, clusterId: ':TEST-SG:test', phases: ['RELEASE'] }] }
  })

  afterEach(async () => {
    await k8sManager.deleteDeployment(name)
    await k8sManager.deleteApplication(name)
  })

  it('p1: should rollout restart deploy successfully', () => {
    return request({
      url: `/tenants/${groupName}/projects/${projectName}/apps/${name}/deploysrolloutRestart`,
      method: METHODS.PUT
    })
      .send({ ...playLoad })
      .expect(200)
  })
})
