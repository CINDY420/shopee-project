import { ICaseType } from 'cypress/api/caseTypes'

interface IGenerateParameterCasesProps {
  actionDescription: string
  parameterKey: string
  possibleParameterValues: string[]
  expectedStatusCodes: number[]
  shouldValidateResponseType?: boolean
}

type generateParamterCasesFn = (props: IGenerateParameterCasesProps) => ICaseType[]

// Generate paramter cases with custom parameters
export const generateParamterCases: generateParamterCasesFn = ({
  actionDescription,
  parameterKey,
  possibleParameterValues,
  expectedStatusCodes,
  shouldValidateResponseType
}) => {
  return possibleParameterValues.map((value, index) => {
    const currentExpectedStatusCode = expectedStatusCodes[index]

    return {
      description: `should ${actionDescription} with parameter: ${parameterKey}=${value}`,
      params: {
        [parameterKey]: value
      },
      expectedStatusCode: currentExpectedStatusCode,
      shouldValidateResponseType
    }
  })
}
