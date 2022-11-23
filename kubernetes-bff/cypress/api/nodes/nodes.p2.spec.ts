import { getNodeListCase } from './cases/getNodeList'
import { getNodePodListCase } from './cases/getNodePodList'
import { labelNodesCase } from './cases/labelNodes'
import { taintNodesCase } from './cases/taintNodes'

import { runRequestP2Cases } from 'cypress/api/lib/runCasesLib/runLevelCases'

const { name: clusterName, nodes } = Cypress.env('cluster')
const nodeName = nodes[1]

const getNodeListUrl = `/clusters/${clusterName}/nodes`
const getNodePodListUrl = `${getNodeListUrl}/${nodeName}/pods`
const labelNodesUrl = `${getNodeListUrl}/action/label`
const taintNodesUrl = `${getNodeListUrl}/action/taint`

describe('Cluster nodes: p2 cases!', () => {
  // Test node list
  runRequestP2Cases({ url: getNodeListUrl, cases: getNodeListCase })
  // Test node pod list
  runRequestP2Cases({ url: getNodePodListUrl, cases: getNodePodListCase })
  // Test label node list
  runRequestP2Cases({ url: labelNodesUrl, cases: labelNodesCase })
  // Test taint node
  runRequestP2Cases({ url: taintNodesUrl, cases: taintNodesCase })
})
