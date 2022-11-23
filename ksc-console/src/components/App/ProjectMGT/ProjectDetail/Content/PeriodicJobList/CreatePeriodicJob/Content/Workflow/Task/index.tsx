import React from 'react'
import { Form, Tabs } from 'infrad'
import { StyledRoot } from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content/Workflow/Task/style'
import TaskContent from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content/Workflow/Task/TaskContent'
import { PlusOutlined } from 'infra-design-icons'

const { TabPane } = Tabs

enum TabActions {
  ADD = 'add',
  REMOVE = 'remove',
}

const WorkflowTask = ({ form }) => {
  const [activeKey, setActiveKey] = React.useState<string>('0')

  const handleEditTabs = (
    targetKey: string,
    action: TabActions,
    addFormListItemFn,
    removeFormListItemFn,
  ) => {
    const tasks = form.getFieldValue(['jobTemplate', 'tasks']) || []
    let targetIndex = tasks.length
    if (action === TabActions.ADD) {
      addFormListItemFn({ containers: [{}] })
    } else {
      removeFormListItemFn(Number(targetKey))
      targetIndex = Number(targetKey) === 0 ? 0 : Number(targetKey) - 1
    }
    setActiveKey(`${targetIndex}`)
  }

  React.useEffect(() => {
    form.setFieldsValue({
      jobTemplate: { tasks: [{ containers: [{}] }], ...form.getFieldValue('jobTemplate') },
    })
  }, [])

  return (
    <StyledRoot>
      <Form.List name={['jobTemplate', 'tasks']}>
        {(fields, { add, remove }) => (
          <Tabs
            type="editable-card"
            onEdit={(targetKey: string, action: TabActions) =>
              handleEditTabs(targetKey, action, add, remove)
            }
            activeKey={activeKey}
            onChange={setActiveKey}
            addIcon={
              <>
                <PlusOutlined />
                &nbsp; Add new Task
              </>
            }
          >
            {fields.map((field, index) => (
              <TabPane tab={`Task ${index + 1}`} key={field.name} closable={fields.length > 1}>
                <Form.Item {...field} noStyle>
                  <TaskContent fieldName={field.name} />
                </Form.Item>
              </TabPane>
            ))}
          </Tabs>
        )}
      </Form.List>
    </StyledRoot>
  )
}
export default WorkflowTask
