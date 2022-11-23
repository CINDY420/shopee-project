import { ITestCasesType } from 'cypress/api/caseTypes'
import { expectedNodeType } from './types'

import { generateBasicListCases } from 'cypress/api/lib/generateCasesLib/generateBasicListCases'
import { generateParamterCases } from 'cypress/api/lib/generateCasesLib/generateParameterCases'

const expectedNodeListType = {
  totalCount: 'number',
  nodes: [expectedNodeType]
}

// Generate list cases
const limitListCases = generateBasicListCases({ listName: 'node' })
const orderByListCases = generateParamterCases({
  actionDescription: 'get a node list',
  parameterKey: 'orderBy',
  possibleParameterValues: ['name', 'status'],
  expectedStatusCodes: [200, 200]
})
const decListCases = generateParamterCases({
  actionDescription: 'get a node list',
  parameterKey: 'dec',
  possibleParameterValues: ['yes', 'no'],
  expectedStatusCodes: [200, 200]
})
const filterByListCases = generateParamterCases({
  actionDescription: 'get a node list',
  parameterKey: 'filterBy',
  possibleParameterValues: [
    'status==Ready',
    'status==Not Ready',
    'status==Unknown',
    'status==SchedulingDisabled',
    'roles==master',
    'roles==worker',
    'roles==gateway',
    'roles==ingress'
  ],
  expectedStatusCodes: [200, 200, 200, 200, 200, 200, 200, 200]
})

export const getNodeListCase: ITestCasesType = {
  method: 'GET',
  expectedResponseType: expectedNodeListType,
  p1: [
    {
      description: 'should get a node list',
      expectedStatusCode: 200,
      shouldValidateResponseType: true
    }
  ],
  p2: [...limitListCases, ...orderByListCases, ...decListCases, ...filterByListCases],
  p3: []
}
