import React from 'react'
import { Form, Input, FormInstance } from 'infrad'
import { Sdu } from 'src/components/Container/SduTable'
import {
  RestartItemsWrapper,
  StyledDiv,
} from 'src/components/Container/Action/Restart/EditForm/style'
import RestartItem from 'src/components/Container/Action/Restart/EditForm/RestartItem'

interface IConfirmProps {
  initialValues: Sdu
  form: FormInstance
  onNextButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>
}

const EditForm: React.FC<IConfirmProps> = (props) => {
  const { initialValues, form, onNextButtonDisabled: handleNextButtonDisabled } = props
  const { sdu, deployments } = initialValues
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  }

  const handelFormValuesChange = () => {
    const restartFormValues = form.getFieldsValue()
    const checkedDeployments = deployments.filter((deployment) => {
      const { deployId, status } = deployment
      const { containers } = status
      const isChecked =
        restartFormValues[deployId] &&
        ((containers.length !== 0 && restartFormValues[deployId].length !== 0) ||
          (containers.length === 0 && restartFormValues[deployId].length === 0))
      return isChecked
    })
    const hasCheckedDeployment = checkedDeployments.length !== 0
    handleNextButtonDisabled(!hasCheckedDeployment)
  }

  return (
    <Form {...formItemLayout} form={form} onValuesChange={handelFormValuesChange}>
      <Form.Item label="SDU Name">
        <Input disabled value={sdu} />
      </Form.Item>
      <Form.Item label="Restart Items">
        <StyledDiv>
          {deployments?.map((deployment) => (
            <RestartItemsWrapper key={deployment.deployId}>
              <RestartItem
                deployment={deployment}
                form={form}
                onFormValuesChange={handelFormValuesChange}
              />
            </RestartItemsWrapper>
          ))}
        </StyledDiv>
      </Form.Item>
    </Form>
  )
}

export default EditForm
