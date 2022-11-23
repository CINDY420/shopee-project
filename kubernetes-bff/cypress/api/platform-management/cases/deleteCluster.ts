import { ITestCasesType } from 'cypress/api/caseTypes'

export const deleteClusterCases: ITestCasesType = {
  method: 'DELETE',
  p1: [
    {
      description: 'should delete a cluster',
      expectedStatusCode: 200
    }
  ],
  p2: [],
  p3: []
}
