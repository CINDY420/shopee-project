import { ITestCasesType } from 'cypress/api/caseTypes'

export const getDeploymentList: ITestCasesType = {
  method: 'GET',
  p1: [
    {
      description: 'should get a deployment list',
      params: {
        env: 'TEST'
      },
      expectedStatusCode: 200
    }
  ],
  p2: [],
  p3: []
}
