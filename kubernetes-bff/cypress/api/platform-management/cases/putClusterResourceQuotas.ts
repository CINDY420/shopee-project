import { ITestCasesType } from 'cypress/api/caseTypes'

const quotasConfig = [
  {
    cpuTotal: 4,
    memoryTotal: 4,
    name: 'Infrastructure Team:DEV'
  }
]

export const putClusterResourceQuotasCases: ITestCasesType = {
  method: 'PUT',
  p1: [
    {
      description: 'should put a cluster resource quotas',
      expectedStatusCode: 200,
      payload: {
        quotasConfig
      }
    }
  ],
  p2: [],
  p3: []
}
