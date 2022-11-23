import * as React from 'react'
import * as R from 'ramda'
import { Form, Input } from 'infrad'

import CrudDrawer from 'components/Common/CrudDrawer'
import { checkIfFormHasError } from 'helpers/form'
import TaintForm from './TaintForm'
import LabelForm from './LabelForm'
import { StyledForm } from 'common-styles/form'

import { IINodeTaint } from 'swagger-api/v3/models'

const { TextArea } = Input

interface IDrawerProps {
  visible: boolean
  type: string
  nodeNames: string[]
  closeDrawer: () => void
  onCancel: () => void
  onSubmit: (result, submitCallback) => void
}

interface IFormResult {
  labels?: object
  action?: string
  taint?: IINodeTaint
}

const Drawer: React.FC<IDrawerProps> = props => {
  const { visible, type, nodeNames, closeDrawer, onCancel, onSubmit } = props

  const [formResult, setFormResult] = React.useState<IFormResult>({})
  const [isSubmitDisabled, setIsSubmitDisabled] = React.useState(true)
  const [form] = Form.useForm()

  const getTable = () => {
    switch (type) {
      case 'Taint':
        return <TaintForm setFormResult={setFormResult} form={form} />
      case 'Label':
        return <LabelForm setFormResult={setFormResult} form={form} />
      default:
        return null
    }
  }

  const formValidator = React.useCallback(() => {
    switch (type) {
      case 'Taint':
        if (formResult.action === 'update') {
          return !(formResult.action && formResult.taint && formResult.taint.key && formResult.taint.effect)
        }
        return !(formResult.action && formResult.taint && formResult.taint.key)
      case 'Label':
        return R.equals({}, formResult) || R.equals({ labels: {} }, formResult)
      default:
        return true
    }
  }, [formResult, type])

  const getFormState = React.useCallback(() => {
    return formValidator() || checkIfFormHasError(form.getFieldsError())
  }, [form, formValidator])

  React.useEffect(() => {
    setIsSubmitDisabled(getFormState())
  }, [formResult, getFormState])

  return (
    <CrudDrawer
      title={type}
      isSubmitDisabled={isSubmitDisabled}
      visible={visible}
      closeDrawer={() => {
        closeDrawer()
        setFormResult({})
        form.resetFields()
      }}
      body={
        <>
          <StyledForm layout='vertical'>
            <StyledForm.Item
              name={nodeNames.toString()}
              label='Node Name'
              initialValue={nodeNames.toString()}
              rules={[
                {
                  required: true
                }
              ]}
            >
              <TextArea disabled style={{ resize: 'none' }} />
            </StyledForm.Item>
          </StyledForm>
          {getTable()}
        </>
      }
      onSubmit={() => {
        onSubmit({ nodes: nodeNames, ...formResult }, () => {
          form.resetFields()
        })
      }}
      onCancel={() => {
        form.resetFields()
        onCancel()
        closeDrawer()
      }}
    ></CrudDrawer>
  )
}

export default Drawer
