import { ISetUpClusterProps } from './types/nodesType'

export type setUpClusterFn = (props: ISetUpClusterProps) => void

const { cid, environment, quotasConfig } = Cypress.env('cluster')
const group = Cypress.env('group')

export const setUpCluster: setUpClusterFn = ({ clusterName, kubeconfig }) => {
  // 1. Delete the cluster if it exits
  cy.request('GET', '/clusters').then((response) => {
    expect(response.status).to.equal(200)

    const isExit = response.body.clusters.some((cluster) => cluster.name === clusterName)
    if (isExit) {
      cy.request('DELETE', `/clusters/${clusterName}`).then((response) => {
        expect(response.status).to.equal(200)
      })
    }
  })

  // 2. Create a cluster
  cy.request('POST', '/clusters', {
    name: clusterName,
    kubeconfig
  }).then((response) => {
    expect(response.status).to.equal(201)
  })
  // 3. Create several nodes
  // The nodes will be created automatic when creating cluster, see the nodes name in cypress.json

  // 4. Edit Cluster
  cy.request({
    method: 'PUT',
    url: `/clusterconfig/${clusterName}`,
    body: {
      cids: [cid],
      environments: [environment],
      groups: [group]
    }
  }).then((response) => {
    expect(response.status).to.equal(200)
  })

  // 5. Set cluster resource quotas
  cy.request({
    method: 'PUT',
    url: `/clusters/${clusterName}/resourceQuotas`,
    body: {
      quotasConfig
    }
  }).then((response) => {
    expect(response.status).to.equal(200)
  })
}
