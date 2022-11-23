import { getClusterListCases } from './cases/getClusterList'

import { runRequestP2Cases } from 'cypress/api/lib/runCasesLib/runLevelCases'

const getClusterListURl = '/clusters'

describe('Cluster: p2 cases', () => {
  // Test get cluster list
  runRequestP2Cases({ url: getClusterListURl, cases: getClusterListCases })
})
