import { Form, Input, Radio } from 'infrad'
import { StyledRoot } from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content/Basics/style'
import Task from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content/Workflow/Task'
import { JOB_TYPES } from 'constants/periodicJob'

const WorkflowStepContent = ({ form }) => (
  <StyledRoot>
    <Form.Item
      label="Type"
      name={['jobTemplate', 'jobType']}
      rules={[
        {
          required: true,
          message: 'Please input job name',
        },
      ]}
    >
      <Radio.Group>
        {JOB_TYPES.map((type) => (
          <Radio key={type.value} value={type.value}>
            {type.name}
          </Radio>
        ))}
      </Radio.Group>
    </Form.Item>
    <Form.Item label="Share Dir" name={['jobTemplate', 'shareDir']}>
      <Input placeholder="/app/sjf/sjf" />
    </Form.Item>
    <Task form={form} />
  </StyledRoot>
)

export default WorkflowStepContent
