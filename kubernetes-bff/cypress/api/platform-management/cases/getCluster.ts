import { ITestCasesType } from 'cypress/api/caseTypes'

import { expectedClusterType } from './types'

export const getClusterCases: ITestCasesType = {
  method: 'GET',
  expectedResponseType: expectedClusterType,
  p1: [
    {
      description: 'should get a cluster',
      expectedStatusCode: 200,
      shouldValidateResponseType: true
    }
  ],
  p2: [],
  p3: []
}
