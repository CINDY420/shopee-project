import { deleteClusterCases } from './cases/deleteCluster'
import { postClusterCases } from './cases/postCluster'
import { getClusterListCases } from './cases/getClusterList'
import { getClusterCases } from './cases/getCluster'
import { putClusterCases } from './cases/putClusterConfig'
import { getClusterConfigCases } from './cases/getClusterConfig'
import { getClusterStatusCases } from './cases/getClusterStatus'
import { putClusterResourceQuotasCases } from './cases/putClusterResourceQuotas'
import { getClusterResourceQuotasCases } from './cases/getClusterResourceQuotas'

import { runRequestP1Cases } from 'cypress/api/lib/runCasesLib/runLevelCases'

const { name: clusterName } = Cypress.env('cluster')

const deleteClusterUrl = `/clusters/${clusterName}`
const postClusterUrl = '/clusters'
const getClusterListURl = postClusterUrl
const getClusterURl = `/clusters/${clusterName}`
const putClusterConfigUrl = `/clusterconfig/${clusterName}`
const getClusterConfigUrl = putClusterConfigUrl
const getClusterStatusUrl = '/clusterstatus'
const putClusterResourceQuotasUrl = `clusters/${clusterName}/resourceQuotas`
const getClusterResourceQuotasUrl = putClusterResourceQuotasUrl

describe('Cluster: p1 cases', () => {
  // Test delete cluster
  runRequestP1Cases({ url: deleteClusterUrl, cases: deleteClusterCases })
  // Test add cluster
  runRequestP1Cases({ url: postClusterUrl, cases: postClusterCases })
  // Test get cluster list
  runRequestP1Cases({ url: getClusterListURl, cases: getClusterListCases })
  // Test get cluster
  runRequestP1Cases({ url: getClusterURl, cases: getClusterCases })
  // Test put cluster config
  runRequestP1Cases({ url: putClusterConfigUrl, cases: putClusterCases })
  // Test get cluster config
  runRequestP1Cases({ url: getClusterConfigUrl, cases: getClusterConfigCases })
  // Test get cluster status
  runRequestP1Cases({ url: getClusterStatusUrl, cases: getClusterStatusCases })
  // Test put cluster resource quota
  runRequestP1Cases({ url: putClusterResourceQuotasUrl, cases: putClusterResourceQuotasCases })
  // Test get cluster resource quota
  runRequestP1Cases({ url: getClusterResourceQuotasUrl, cases: getClusterResourceQuotasCases })
})
