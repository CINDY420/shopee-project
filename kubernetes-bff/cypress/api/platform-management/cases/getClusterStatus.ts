import { ITestCasesType } from 'cypress/api/caseTypes'
import { expectedClusterListType } from './types'

const { name: clusterName } = Cypress.env('cluster')

export const getClusterStatusCases: ITestCasesType = {
  method: 'GET',
  expectedResponseType: expectedClusterListType,
  p1: [
    {
      description: 'should get a cluster status',
      expectedStatusCode: 200,
      shouldValidateResponseType: true,
      params: {
        clusters: [clusterName]
      }
    }
  ],
  p2: [
    {
      description: 'should get a cluster status without params',
      expectedStatusCode: 400
    }
  ],
  p3: []
}
