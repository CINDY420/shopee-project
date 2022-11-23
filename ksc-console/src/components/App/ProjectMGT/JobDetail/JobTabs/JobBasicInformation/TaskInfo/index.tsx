import { Tabs } from 'infrad'
import TaskInfoTab from './TaskInfoTab'
import { IGetJobResponse } from 'swagger-api/models'

const { TabPane } = Tabs

interface ITaskInfoProps {
  jobDetails: IGetJobResponse | Record<string, unknown>
}

function isJobResponse(item: IGetJobResponse | Record<string, unknown>): item is IGetJobResponse {
  return 'tasks' in item
}

const TaskInfo = ({ jobDetails }: ITaskInfoProps) => {
  const { tasks = [] } = isJobResponse(jobDetails) ? jobDetails : {}
  return (
    <Tabs type="card">
      {tasks.map((task, index) => (
        // eslint-disable-next-line -- no other proper way to be used
        <TabPane tab={`Task ${index + 1}`} key={index}>
          <TaskInfoTab taskInfoData={task} />
        </TabPane>
      ))}
    </Tabs>
  )
}

export default TaskInfo
