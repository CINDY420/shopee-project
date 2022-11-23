import { getIngressTree } from './cases/getIngressTree'

import { runRequestP1Cases } from 'cypress/api/lib/runCasesLib/runLevelCases'

const getIngressTreeUrl = '/ingresses/tree'

describe('Ingress tree: p1 cases', () => {
  // Test ingress tree
  runRequestP1Cases({ url: getIngressTreeUrl, cases: getIngressTree })
})
