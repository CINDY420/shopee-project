/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
import { AppsV1Api, V1Deployment, CustomObjectsApi } from '@kubernetes/client-node'
import * as tsconfigPath from 'tsconfig-paths'
import { kc } from './client'
import { load } from 'js-yaml'

tsconfigPath.register({
  baseUrl: './',
  paths: {}
})

const client = kc.makeApiClient(AppsV1Api)

export default (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    createDeployment: (deployment) => {
      return new Promise((resolve, reject) => {
        const deploymentJson: V1Deployment = load(deployment)

        // TODO check if deployment exist before creating?
        client
          .createNamespacedDeployment(deploymentJson.metadata.namespace, deploymentJson)
          .then(() => {
            resolve(null)
          })
          .catch((e) => {
            reject(e)
          })
      })
    },

    deleteDeployment: ({ name, namespace }) => {
      return new Promise((resolve, reject) => {
        client
          .deleteNamespacedDeployment(name, namespace)
          .then(() => {
            resolve(null)
          })
          .catch((e) => {
            reject(e)
          })
      })
    },

    deleteApplication: ({ projectName, name, apiServer }) => {
      return new Promise((resolve, reject) => {
        const client = kc.makeApiClient(CustomObjectsApi)
        const { customObj } = apiServer
        const { group, version, namespacePrefix } = customObj

        client
          .deleteNamespacedCustomObject(group, version, `${namespacePrefix}${projectName}`, 'applications', name)
          .then(() => {
            resolve('success')
          })
          .catch((e) => reject(e))
      })
    },

    createApplication: ({ groupName, projectName, name, apiServer }) => {
      return new Promise((resolve, reject) => {
        const client = kc.makeApiClient(CustomObjectsApi)
        const { customObj } = apiServer
        const { group, version, namespacePrefix } = customObj

        const crdObject = {
          kind: 'Application',
          metadata: {
            name
          },
          spec: {
            project: projectName,
            group: groupName
          }
        }

        client
          .createNamespacedCustomObject(group, version, `${namespacePrefix}${projectName}`, 'applications', {
            apiVersion: `${group}/${version}`,
            ...crdObject
          })
          .then(() => {
            resolve('success')
          })
          .catch((e) => reject(e))
      })
    }
  })
}
