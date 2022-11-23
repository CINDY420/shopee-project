import React from 'react'
import { Button, Col, Form, FormInstance, Select, InputNumber, Row, Input } from 'infrad'
import { IAdd, ITrash } from 'infra-design-icons'
import { IJobListItem } from 'swagger-api/models'
import {
  StyledIconWrapper,
  StyledRow,
  StyledNumberCol,
  StyledFormListWrapper,
} from 'components/App/ProjectMGT/Common/ScaleModalForm/style'
import { jobControllerGetJob } from 'swagger-api/apis/Job'

interface ITasks {
  taskName: string
  replicas: number
  disabled: boolean
}
interface IScaleModalFormProps {
  form: FormInstance
  scaleJobDetail?: IJobListItem
  tenantId?: string
}

const { Option } = Select
const formItemLayoutWithoutLabelProps = {
  wrapperCol: { span: 24, offset: 2 },
}
const ScaleModalForm: React.FC<IScaleModalFormProps> = ({ form, scaleJobDetail, tenantId }) => {
  const [tasks, setTasks] = React.useState<ITasks[]>([])
  const setInitialFormData = React.useCallback(() => {
    if (scaleJobDetail) {
      form.setFieldsValue({
        jobName: scaleJobDetail.jobName,
        jobId: scaleJobDetail.jobId,
      })
    }
  }, [scaleJobDetail, form])

  const getJobDetails = React.useCallback(async () => {
    if (tenantId && scaleJobDetail) {
      const { projectId, jobId } = scaleJobDetail
      const { tasks: originTasks } = await jobControllerGetJob({ tenantId, projectId, jobId })
      const tasks: ITasks[] = originTasks.map((task) => {
        const { taskName, replicas } = task
        return {
          taskName,
          replicas,
          disabled: false,
        }
      })
      setTasks(tasks)
    }
  }, [scaleJobDetail, tenantId])

  React.useEffect(() => {
    setInitialFormData()
    getJobDetails()
  }, [setInitialFormData])

  const updateTasksStatus = () => {
    const formTasks: ITasks[] = form.getFieldValue('tasks')
    const selectedTasks: string[] = formTasks.map((task) => task.taskName)
    const newTasks: ITasks[] = tasks.map((task) => {
      let disabled = false
      if (selectedTasks.includes(task.taskName)) {
        disabled = true
      }
      return {
        ...task,
        disabled,
      }
    })
    setTasks(newTasks)
  }

  const handleTaskChange = (currentTaskName: string) => {
    updateTasksStatus()
    const formTasks: ITasks[] = form.getFieldValue('tasks')
    const currentTaskReplicas = tasks.find((item) => item.taskName === currentTaskName)?.replicas
    form.setFieldsValue({
      tasks: formTasks.map((task) => {
        if (task.taskName === currentTaskName && currentTaskReplicas) {
          return {
            taskName: currentTaskName,
            replicas: currentTaskReplicas,
          }
        }
        return task
      }),
    })
  }

  return (
    <Form
      name="scale"
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 16 }}
      style={{ marginTop: 32, marginBottom: 32 }}
    >
      <Form.Item noStyle name="jobId" />
      <Form.Item label="Job Name" name="jobName">
        <Input disabled />
      </Form.Item>
      <Form.Item label="Replica" required>
        <StyledFormListWrapper>
          <StyledRow gutter={[16, 16]}>
            <Col span={2}>No.</Col>
            <Col className="red-asterisk" span={10}>
              Task Name
            </Col>
            <Col span={10}>Replica</Col>
          </StyledRow>
          <Form.List name="tasks">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ name, ...restField }, index) => (
                  <Row gutter={[16, 16]} key={name}>
                    <StyledNumberCol span={2}>{index + 1}</StyledNumberCol>
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, 'taskName']}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'Please select task name',
                          },
                        ]}
                      >
                        <Select style={{ width: '100%' }} onChange={handleTaskChange}>
                          {tasks.map((task) => (
                            <Option
                              key={task.taskName}
                              value={task.taskName}
                              disabled={task.disabled}
                            >
                              {task.taskName}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, 'replicas']}
                        rules={[
                          {
                            type: 'number',
                            required: true,
                            whitespace: true,
                            message: 'Please input replicas',
                          },
                        ]}
                      >
                        <InputNumber
                          placeholder="Please input replicas"
                          style={{ width: '100%' }}
                          min={1}
                        />
                      </Form.Item>
                    </Col>
                    {fields.length > 1 ? (
                      <Col>
                        <StyledIconWrapper>
                          <ITrash
                            onClick={() => {
                              remove(name)
                              updateTasksStatus()
                            }}
                          />
                        </StyledIconWrapper>
                      </Col>
                    ) : null}
                  </Row>
                ))}
                <Form.Item {...formItemLayoutWithoutLabelProps}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '100%' }}
                    icon={<IAdd />}
                  >
                    Add
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </StyledFormListWrapper>
      </Form.Item>
    </Form>
  )
}

export default ScaleModalForm
