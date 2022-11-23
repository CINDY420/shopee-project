import { ICaseType } from '../../caseTypes'
interface IGenerateBasicListCasesProps {
  listName: string
  limits?: number[]
  shouldValidateResponseType?: boolean
}

type generateBasicListCasesFn = (props: IGenerateBasicListCasesProps) => ICaseType[]

// Generate list cases with offset and limit
export const generateBasicListCases: generateBasicListCasesFn = ({
  listName = '',
  limits = [10, 20, 50],
  shouldValidateResponseType = false
}) => {
  return limits.reduce((cases, limit) => {
    const offsets = [0, limit]

    const currentLimitCases = offsets.map((offset) => {
      return {
        description: `should get a ${listName} list with offset=${offset}, limit=${limit}`,
        params: {
          offset,
          limit
        },
        expectedStatusCode: 200,
        shouldValidateResponseType
      }
    })

    return cases.concat(currentLimitCases)
  }, [])
}
