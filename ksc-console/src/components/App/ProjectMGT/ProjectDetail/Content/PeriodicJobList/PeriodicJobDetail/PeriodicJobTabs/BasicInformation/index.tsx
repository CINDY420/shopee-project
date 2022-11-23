import React from 'react'
import { StyledCard } from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/PeriodicJobDetail/PeriodicJobTabs/BasicInformation/style'
import BasicInformationTabContent from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/PeriodicJobDetail/PeriodicJobTabs/BasicInformation/TabContent'
import InformationCommonList from 'components/Common/InformationCommonList'
import {
  INSTANCE_BASIC_INFORMATION_BASICS,
  INSTANCE_BASIC_INFORMATION_WORKFLOW,
} from 'constants/periodicJob'
import { Tabs } from 'infrad'
import {
  IGetPeriodicJobResponse,
  IPeriodicJobTemplate,
  IPeriodicJobTemplateTask,
} from 'swagger-api/models'
import { useRecoilValue } from 'recoil'
import { selectedPeriodicJob } from 'states'

const { TabPane } = Tabs
export type IBasicData = Omit<IGetPeriodicJobResponse, 'jobTemplate' | 'periodicJobStatus'> &
  Omit<IPeriodicJobTemplate, 'tasks'>

const BasicInformation = () => {
  const jobDetails = useRecoilValue(selectedPeriodicJob)
  const [basicData, setBasicData] = React.useState<IBasicData>()
  const [tasks, setTasks] = React.useState<IPeriodicJobTemplateTask[]>([])

  const generateBasicData = React.useCallback(() => {
    if (jobDetails) {
      const {
        jobTemplate,
        periodicJobStatus: _periodicJobStatus,
        ...rest
      } = jobDetails as IGetPeriodicJobResponse
      const { tasks, ...jobRest } = jobTemplate
      setBasicData({ ...rest, ...jobRest })
      setTasks(tasks)
    }
  }, [jobDetails])

  React.useEffect(() => {
    generateBasicData()
  }, [])

  return (
    <>
      <StyledCard title="Basic" bordered={false}>
        {basicData && (
          <InformationCommonList nameMaps={INSTANCE_BASIC_INFORMATION_BASICS} data={basicData} />
        )}
      </StyledCard>
      <StyledCard title="Workflow" bordered={false}>
        {basicData && (
          <InformationCommonList nameMaps={INSTANCE_BASIC_INFORMATION_WORKFLOW} data={basicData} />
        )}
        <Tabs type="card">
          {tasks.map((task, index) => (
            <TabPane tab={`Task ${index + 1}`} key={task.taskName}>
              <BasicInformationTabContent task={task} />
            </TabPane>
          ))}
        </Tabs>
      </StyledCard>
    </>
  )
}

export default BasicInformation
