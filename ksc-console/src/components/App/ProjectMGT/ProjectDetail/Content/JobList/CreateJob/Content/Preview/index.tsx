import React from 'react'
import {
  StyleCard,
  StyleColKey,
  StyleColValue,
  StyleRow,
  StyleTabs,
} from 'components/App/ProjectMGT/ProjectDetail/Content/JobList/CreateJob/Content/Preview/style'
import PreviewTaskContent from 'components/App/ProjectMGT/ProjectDetail/Content/JobList/CreateJob/Content/Preview/TaskContent'
import { BASIC_INFORMATION } from 'constants/job'
import { ITasks } from 'helpers/job'

const { TabPane } = StyleTabs
const PreviewStepContent = ({ form }) => {
  const formValues = form.getFieldsValue(true)
  const tasks: ITasks[] = formValues?.tasks || []

  const getFormItemValue = React.useCallback(
    (formNamePath: string | string[]) => {
      let result: string | number | boolean | undefined
      if (Array.isArray(formNamePath)) {
        result = formNamePath.reduce((result, current) => result[current], formValues)
      } else {
        result = formValues[formNamePath]
      }
      const stringResult = `${result}`
      return stringResult === 'undefined' ? '--' : stringResult
    },
    [formValues],
  )

  return (
    <>
      <StyleCard title="Basic Information" bordered={false}>
        {BASIC_INFORMATION.map((info) => (
          <StyleRow key={info.displayName}>
            <StyleColKey>{info.displayName}</StyleColKey>
            <StyleColValue>{getFormItemValue(info.formNamePath)}</StyleColValue>
          </StyleRow>
        ))}
      </StyleCard>
      <StyleCard title="Workflow" bordered={false}>
        <StyleTabs type="card">
          {tasks.map((task, index: number) => (
            <TabPane key={task.taskName} tab={`Task ${index + 1}`}>
              <PreviewTaskContent taskInfo={task} />
            </TabPane>
          ))}
        </StyleTabs>
      </StyleCard>
    </>
  )
}

export default PreviewStepContent
