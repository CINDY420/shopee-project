import React from 'react'
import { Form, Input } from 'infrad'
import { Sdu } from 'src/components/Container/SduTable'
import EditFormTable from 'src/components/Container/Action/Common/EditFormTable'

interface IEditFormProps {
  initialValues: Sdu
  onGetFormValues: (deployIds: string[]) => void
  selectedDeploymentIds: string[]
}

const EditForm: React.FC<IEditFormProps> = (props) => {
  const { initialValues, onGetFormValues: getFormValues, selectedDeploymentIds } = props
  const { sdu, deployments } = initialValues

  return (
    <Form labelCol={{ span: 4 }}>
      <Form.Item label="SDU Name" wrapperCol={{ span: 14 }}>
        <Input disabled value={sdu} />
      </Form.Item>
      <Form.Item label="Stop Items" wrapperCol={{ span: 18 }}>
        <div style={{ backgroundColor: '#fafafa', padding: '24px 32px' }}>
          <EditFormTable
            deployments={deployments}
            onGetFormValues={getFormValues}
            selectedDeploymentIds={selectedDeploymentIds}
          />
        </div>
      </Form.Item>
    </Form>
  )
}

export default EditForm
