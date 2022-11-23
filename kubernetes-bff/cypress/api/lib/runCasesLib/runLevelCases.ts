import { runRequestCases, CaseLevel } from './runRequestCases'
import { ITestCasesType } from 'cypress/api/caseTypes'

interface IRunRequestLevelCasesProps {
  url?: string
  cases: ITestCasesType
}

type runRequestLevelCasesFn = (props: IRunRequestLevelCasesProps) => void

export const runRequestP1Cases: runRequestLevelCasesFn = ({ url, cases }) => {
  const level = CaseLevel.P1

  runRequestCases({
    url,
    requestCases: cases,
    level
  })
}

export const runRequestP2Cases: runRequestLevelCasesFn = ({ url, cases }) => {
  const level = CaseLevel.P2

  runRequestCases({
    url,
    requestCases: cases,
    level
  })
}

export const runRequestP3Cases: runRequestLevelCasesFn = ({ url, cases }) => {
  const level = CaseLevel.P3

  runRequestCases({
    url,
    requestCases: cases,
    level
  })
}

export const runRequestP4Cases: runRequestLevelCasesFn = ({ url, cases }) => {
  const level = CaseLevel.P4

  runRequestCases({
    url,
    requestCases: cases,
    level
  })
}
