import React from 'react'
import { Form } from 'infrad'
import { Sdu } from 'src/components/Container/SduTable'
import { SuspendEditForm } from 'src/components/Container/Action'
import ConfirmFormTable from 'src/components/Container/Action/Common/ConfirmFormTable'

interface IConfirmProps {
  initialValues: Sdu
  suspendSduData: SuspendEditForm
}

const ConfirmForm: React.FC<IConfirmProps> = (props) => {
  const { initialValues, suspendSduData } = props
  const { sdu, deployments } = initialValues

  return (
    <Form labelCol={{ span: 4 }}>
      <Form.Item label="SDU Name" wrapperCol={{ span: 14 }}>
        <div>{sdu}</div>
      </Form.Item>
      <Form.Item label="Suspend Items" wrapperCol={{ span: 18 }}>
        <div style={{ backgroundColor: '#fafafa', padding: '24px 32px' }}>
          <ConfirmFormTable editFormData={suspendSduData} deployments={deployments} />
        </div>
      </Form.Item>
    </Form>
  )
}

export default ConfirmForm
