import { IAdd } from 'infra-design-icons'
import { Button, Form, Input, InputNumber } from 'infrad'
import TaskContentContainer from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content/Workflow/Task/TaskContent/TaskContentContainer'

const formItemLayoutWithOutLabel = {
  wrapperCol: { span: 14, offset: 5 },
}
const TaskContent = ({ fieldName }) => (
  <>
    <Form.Item
      label="Task Name"
      name={[fieldName, 'taskName']}
      rules={[
        {
          required: true,
          message: 'Please input task name',
        },
      ]}
    >
      <Input placeholder="Must only consist of lowercase alphanumeric(a-z0-9)" />
    </Form.Item>
    <Form.Item
      label="Replica"
      name={[fieldName, 'replicas']}
      extra="Task Concurrency means the number of pod"
      rules={[
        {
          required: true,
          message: 'Please input replica',
        },
      ]}
    >
      <InputNumber min={1} />
    </Form.Item>
    <Form.Item
      label="Retry Limit"
      name={[fieldName, 'retryLimit']}
      rules={[
        {
          required: true,
          message: 'Please input retry limit',
        },
      ]}
    >
      <InputNumber min={0} />
    </Form.Item>
    <Form.List name={[fieldName, 'containers']}>
      {(fields, { add, remove }, { errors }) => (
        <>
          {fields.map((field, index) => (
            <Form.Item
              {...(index !== 0 ? formItemLayoutWithOutLabel : {})}
              label={index === 0 ? 'Container' : ''}
              key={field.key}
              required
            >
              <Form.Item {...field} noStyle>
                <TaskContentContainer
                  fieldName={field.name}
                  onDelete={fields.length > 1 ? remove : undefined}
                />
              </Form.Item>
            </Form.Item>
          ))}
          <Form.Item {...formItemLayoutWithOutLabel}>
            <Button
              type="link"
              onClick={() => add()}
              style={{ width: '60%', textAlign: 'left' }}
              icon={<IAdd />}
            >
              Add new Container
            </Button>
            <Form.ErrorList errors={errors} />
          </Form.Item>
        </>
      )}
    </Form.List>
  </>
)

export default TaskContent
