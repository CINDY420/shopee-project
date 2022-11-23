import { ITestCasesType } from 'cypress/api/caseTypes'

const expectedClusterConfigType = {
  cids: 'array',
  environments: 'array',
  groups: 'array'
}

export const getClusterConfigCases: ITestCasesType = {
  method: 'GET',
  expectedResponseType: expectedClusterConfigType,
  p1: [
    {
      description: 'should get a cluster config',
      expectedStatusCode: 200,
      shouldValidateResponseType: true
    }
  ],
  p2: [],
  p3: []
}
