import { getNodeListCase } from './cases/getNodeList'
import { getNodeDetailCase } from './cases/getNodeDetail'
import { cordonNodesCase } from './cases/cordonNodes'
import { uncordonNodesCase } from './cases/uncordonNodes'
import { drainNodesCase } from './cases/drainNodes'
import { labelNodesCase } from './cases/labelNodes'
import { taintNodesCase } from './cases/taintNodes'
import { getNodePodListCase } from './cases/getNodePodList'

import { runRequestP1Cases } from 'cypress/api/lib/runCasesLib/runLevelCases'

const { name: clusterName, nodes } = Cypress.env('cluster')
const nodeName = nodes[1]

const getNodeListUrl = `/clusters/${clusterName}/nodes`
const getNodeDetailUrl = `${getNodeListUrl}/${nodeName}`
const cordonNodesUrl = `${getNodeListUrl}/action/cordon`
const uncordonNodesUrl = `${getNodeListUrl}/action/uncordon`
const drainNodesUrl = `${getNodeListUrl}/action/drain`
const labelNodesUrl = `${getNodeListUrl}/action/label`
const taintNodesUrl = `${getNodeListUrl}/action/taint`
const getNodePodListUrl = `${getNodeListUrl}/${nodeName}/pods`

describe('Cluster nodes: p1 cases', () => {
  // Test node list
  runRequestP1Cases({ url: getNodeListUrl, cases: getNodeListCase })
  // Test node detail
  runRequestP1Cases({ url: getNodeDetailUrl, cases: getNodeDetailCase })
  // Test cordon node
  runRequestP1Cases({ url: cordonNodesUrl, cases: cordonNodesCase })
  // Test uncordon node
  runRequestP1Cases({ url: uncordonNodesUrl, cases: uncordonNodesCase })
  // Test drain node
  runRequestP1Cases({ url: drainNodesUrl, cases: drainNodesCase })
  // Test label node
  runRequestP1Cases({ url: labelNodesUrl, cases: labelNodesCase })
  // Test taint node
  runRequestP1Cases({ url: taintNodesUrl, cases: taintNodesCase })
  // Test get node pod list
  runRequestP1Cases({ url: getNodePodListUrl, cases: getNodePodListCase })
})
