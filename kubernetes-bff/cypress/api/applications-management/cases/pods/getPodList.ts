import { ITestCasesType } from 'cypress/api/caseTypes'
import { expectedPodType } from '../types'

const expectedPodListType = {
  totalCount: 'number',
  pods: [expectedPodType],
  statusList: 'array',
  phaseList: 'array'
}

export const getPodListCase: ITestCasesType = {
  method: 'GET',
  expectedResponseType: expectedPodListType,
  p1: [
    {
      description: 'should get a pod list',
      params: {
        clusterId: 'DEV-SG%3Atest',
        phase: 'RELEASE'
      },
      expectedStatusCode: 200,
      shouldValidateResponseType: true
    }
  ],
  p2: [],
  p3: []
}
