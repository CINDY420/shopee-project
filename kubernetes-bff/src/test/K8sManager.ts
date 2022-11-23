import * as fs from 'fs'
import * as path from 'path'
import * as k8s from '@kubernetes/client-node'
import { customObj, env } from './constants'
import { AppsV1Api, CoreV1Api, CustomObjectsApi } from '@kubernetes/client-node'
import * as Mustache from 'mustache'
import { load } from 'js-yaml'
import { buildNewProjectCrdAndResult } from 'common/helpers/project'
import { poll } from 'test/helpers'
import { METHODS } from 'common/interfaces/jest.interface'

export default class K8sManager {
  private kc: k8s.KubeConfig
  private request: any

  constructor(private context) {
    const configFile = fs.readFileSync(path.resolve(__dirname, './clusters/test.yaml'), { encoding: 'utf8' })
    const kc = new k8s.KubeConfig()

    kc.loadFromString(configFile)

    this.kc = kc
    this.context = context
    this.request = context.request
    this.init()
  }

  private async init() {
    // create a test project if not exist
    const { projectName } = env
    const project = await this.getProject()

    if (!project) {
      await this.createProject(projectName)
    }
  }

  async getProject(name: string = null) {
    const { projectName, groupName } = env

    try {
      const result = await this.request({
        url: `/tenants/${groupName}/projects/${name || projectName}`,
        method: METHODS.GET
      })
      const data = result?.body
      if (!data.name) {
        return null
      }

      return data
    } catch (e) {
      return null
    }
  }

  async createProject(name: string) {
    const { groupName, projectName } = env
    const realName = name || projectName

    const payload = {
      project: realName,
      cids: ['ID'],
      quotas: [{ name: 'test:TEST', cpuTotal: 0.01, memoryTotal: 0.01 }]
    }

    try {
      await this.request({
        url: `/tenants/${groupName}/projects`,
        method: METHODS.POST
      }).send(payload)

      const pollFn = async () => await this.getProject(realName)
      const validateFn = (data) => {
        return data?.name === realName
      }

      await poll({ fn: pollFn, validate: validateFn })
    } catch (e) {
      throw new Error(e)
    }
  }

  async deleteProject(name: string) {
    const { env } = this.context
    const { projectName, groupName } = env
    const realName = name || projectName

    try {
      await this.request({
        url: `/tenants/${groupName}/projects/${realName}`,
        method: METHODS.DELETE
      })

      const pollFn = async () => await this.getProject(realName)
      const validateFn = (data) => {
        return !data?.name
      }

      await poll({ fn: pollFn, validate: validateFn })
    } catch (e) {
      throw new Error(e)
    }
  }

  async getApplication(name: string) {
    const { env } = this.context
    const { projectName, groupName } = env

    try {
      const result = await this.request({
        url: `/tenants/${groupName}/projects/${projectName}/apps/${name}`,
        method: METHODS.GET
      })
      const data = result?.body
      if (!data.name) {
        return null
      }

      return data
    } catch (e) {
      return null
    }
  }

  async createApplication(name: string) {
    const { env } = this.context
    const { groupName, projectName } = env

    try {
      await this.request({
        url: `/tenants/${groupName}/projects/${projectName}/apps`,
        method: METHODS.POST
      }).send({
        appName: name,
        strategyType: { type: 'RollingUpdate', value: { maxSurge: '25%', maxUnavailable: '0' } },
        healthCheck: {
          readinessProbe: {
            type: 'HTTP',
            typeValue: name,
            initialDelaySeconds: 15,
            periodSeconds: 5,
            successThreshold: 1,
            timeoutSeconds: 5
          },
          livenessProbe: {}
        },
        pipeline: ''
      })

      const pollFn = async () => await this.getApplication(name)
      const validateFn = (data) => data?.name === name

      await poll({ fn: pollFn, validate: validateFn })
    } catch (e) {
      throw new Error(e)
    }
  }

  async deleteApplication(name: string) {
    const { env } = this.context
    const { projectName, groupName } = env

    try {
      await this.request({
        url: `/tenants/${groupName}/projects/${projectName}/apps/${name}`,
        method: METHODS.DELETE
      })

      const pollFn = async () => await this.getApplication(name)
      const validateFn = (data) => {
        return !data?.name
      }

      await poll({ fn: pollFn, validate: validateFn })
    } catch (e) {
      throw new Error(e)
    }
  }

  async getDeployment(name: string) {
    const { env } = this.context
    const { cid, env: environment } = env

    const client = this.kc.makeApiClient(AppsV1Api)

    try {
      const result = await client.listNamespacedDeployment(`${name}-${environment}-${cid}`)
      return result.body.items.filter((item) => item?.metadata?.name.includes(name))
    } catch (e) {
      return null
    }
  }

  async getDeploymentTags(appName: string, name: string) {
    const { env } = this.context
    const { groupName, projectName, cid, env: environment, cluster, container } = env

    try {
      const result = await this.request({
        url: `/tenants/${groupName}/projects/${projectName}/apps/${appName}/deploys/${name}/containers/${container}/tags?clusterId=${`${environment.toUpperCase()}-${cid.toUpperCase()}:${cluster}`}`,
        method: METHODS.GET
      })
      const data = result?.body

      if (!data) {
        return null
      }

      return data
    } catch (e) {
      return null
    }
  }

  async createDeployment(name: string, phase?: string) {
    const { env } = this.context
    const { cid, env: environment } = env

    const namespaceApi = this.kc.makeApiClient(CoreV1Api)
    const deploymentApi = this.kc.makeApiClient(AppsV1Api)

    try {
      const namespace = `${name}-${environment}-${cid}`
      const filePath = phase
        ? `./templates/deployments/canary-${phase}-deployment.yaml`
        : './templates/deployments/deployment.yaml'
      const deploymentTemplate2 = fs.readFileSync(path.resolve(__dirname, filePath), {
        encoding: 'utf8'
      })
      const deploymentTemplate22 = Mustache.render(deploymentTemplate2, {
        appName: name,
        cid,
        env: environment,
        deploymentName: name,
        namespace
      })

      const deploymentJson = load(deploymentTemplate22)

      let isExist = true
      try {
        await namespaceApi.readNamespace(namespace)
      } catch {
        isExist = false
      }

      if (!isExist) {
        const yamlString = k8s.dumpYaml({
          metadata: {
            name: namespace
          }
        })
        const yamlNamespace = k8s.loadYaml(yamlString)
        await namespaceApi.createNamespace(yamlNamespace)
      }

      await deploymentApi.createNamespacedDeployment(namespace, deploymentJson)

      const pollFn = async () => await this.getDeployment(name)
      const validateFn = (data) => {
        const length = data.length
        return !!length
      }
      await poll({ fn: pollFn, validate: validateFn })
    } catch (e) {
      throw new Error(e)
    }
  }

  async deleteDeployment(name) {
    const { env } = this.context
    const { cid, env: environment } = env

    const namespaceApi = this.kc.makeApiClient(CoreV1Api)
    const namespace = `${name}-${environment}-${cid}`

    try {
      await namespaceApi.deleteNamespace(namespace)

      const pollFn = async () => await this.getDeployment(name)
      const validateFn = (data) => {
        return data.length === 0
      }

      await poll({ fn: pollFn, validate: validateFn })
    } catch (e) {
      throw new Error(e)
    }
  }

  async createCanaryDeployment(name) {
    await this.createDeployment(name, 'blue')
    await this.createDeployment(name, 'green')
  }
}
