import { ITestCasesType } from 'cypress/api/caseTypes'
import { expectedNodePodType } from './types'

import { generateBasicListCases } from 'cypress/api/lib/generateCasesLib/generateBasicListCases'
import { generateParamterCases } from 'cypress/api/lib/generateCasesLib/generateParameterCases'

const expectedNodePodListType = {
  totalCount: 'number',
  pods: [expectedNodePodType],
  statusList: 'array'
}

const descriptionText = 'should get a node pod list'

// Generate list cases
const limitListCases = generateBasicListCases({ listName: 'pod' })
const orderByListCases = generateParamterCases({
  actionDescription: 'get a pod list',
  parameterKey: 'orderBy',
  possibleParameterValues: ['creationTimestamp', 'creationTimestamp+desc'],
  expectedStatusCodes: [200, 200]
})

export const getNodePodListCase: ITestCasesType = {
  method: 'GET',
  expectedResponseType: expectedNodePodListType,
  p1: [
    {
      description: descriptionText,
      expectedStatusCode: 200,
      shouldValidateResponseType: true
    }
  ],
  p2: [...limitListCases, ...orderByListCases],
  p3: []
}
