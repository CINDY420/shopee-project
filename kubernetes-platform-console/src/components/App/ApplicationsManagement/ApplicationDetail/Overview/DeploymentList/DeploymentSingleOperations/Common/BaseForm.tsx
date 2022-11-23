import * as React from 'react'
import { Form, Modal } from 'infrad'
import { FormInstance } from 'infrad/lib/form'
import { QuestionCircleOutlined } from 'infra-design-icons'

import GotItModal from 'components/Common/GotItModal'

const formItemLayout = {
  labelCol: {
    span: 24
  },
  wrapperCol: {
    span: 24
  }
}

interface IBaseFormProps {
  id: string
  initialValues?: any
  onFinish: (values: any) => void
  onValuesChange?: (flag: boolean) => void
  form: FormInstance
  confirmConfig: {
    title: string
    content?: string | React.ReactNode
  }
  enableGotIt?: boolean
  deployConfigEnable?: boolean
}

const BaseForm: React.FC<IBaseFormProps> = ({
  id,
  initialValues,
  onFinish,
  onValuesChange,
  form,
  children,
  confirmConfig,
  enableGotIt,
  deployConfigEnable
}) => {
  const { title, content } = confirmConfig

  const [visible, setVisible] = React.useState<boolean>()
  const [values, setValues] = React.useState()

  const handleOk = () => {
    onFinish(values)
    setVisible(false)
  }

  const handleGotItConfirm = values => {
    setVisible(true)
    setValues(values)
  }
  const handleConfirm = React.useCallback(
    values =>
      Modal.confirm({
        title: title,
        icon: <QuestionCircleOutlined />,
        content: content || 'This operation cannot be canceled',
        okText: 'Confirm',
        cancelText: 'Cancel',
        onOk() {
          onFinish(values)
        }
      }),
    [content, onFinish, title]
  )

  const confirm = enableGotIt ? handleGotItConfirm : handleConfirm

  return (
    <>
      <Form
        id={id}
        form={form}
        colon={false}
        labelAlign='left'
        initialValues={initialValues}
        onFinish={values => confirm(values)}
        onFieldsChange={() => {
          const errors = form.getFieldsError()
          const isError = errors.filter(error => error.errors.length > 0).length > 0

          onValuesChange(isError)
        }}
        {...formItemLayout}
      >
        {children}
      </Form>
      {enableGotIt && (
        <GotItModal
          visible={visible}
          title={title}
          okText='Confirm'
          cancelText='Cancel'
          onOk={handleOk}
          onCancel={() => setVisible(false)}
          getContainer={() => document.body}
          deployConfigEnable={deployConfigEnable}
          destroyOnClose
        >
          {content || 'This operation cannot be canceled'}
        </GotItModal>
      )}
    </>
  )
}

export default BaseForm
