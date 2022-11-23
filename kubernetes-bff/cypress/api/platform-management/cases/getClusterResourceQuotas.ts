import { ITestCasesType } from 'cypress/api/caseTypes'

export const getClusterResourceQuotasCases: ITestCasesType = {
  method: 'GET',
  p1: [
    {
      description: 'should get a cluster resource quotas',
      expectedStatusCode: 200
    }
  ],
  p2: [],
  p3: []
}
