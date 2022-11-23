import { ITestCasesType } from 'cypress/api/caseTypes'
import { expectedClusterListType } from './types'

import { generateBasicListCases } from 'cypress/api/lib/generateCasesLib/generateBasicListCases'

const limitListCases = generateBasicListCases({ listName: 'cluster' })

export const getClusterListCases: ITestCasesType = {
  method: 'GET',
  expectedResponseType: expectedClusterListType,
  p1: [
    {
      description: 'should get a cluster list',
      expectedStatusCode: 200,
      shouldValidateResponseType: true
    }
  ],
  p2: [...limitListCases],
  p3: []
}
