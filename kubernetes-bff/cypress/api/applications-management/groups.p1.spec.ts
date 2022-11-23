import { runRequestP1Cases } from 'cypress/api/lib/runCasesLib/runLevelCases'
import * as groups from './cases/groups'

describe('Group: p1 cases', () => {
  // get group detail
  runRequestP1Cases({ cases: groups.getGroupDetailCases })

  // get group metrics
  runRequestP1Cases({ cases: groups.getGroupMetricsCases })

  // get group project quotas
  runRequestP1Cases({
    cases: groups.getGroupProjectsQuotas
  })
})
