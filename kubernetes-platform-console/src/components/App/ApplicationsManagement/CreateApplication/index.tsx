import * as React from 'react'
import { Form, Modal, Button } from 'infrad'
import { useRecoilValue } from 'recoil'
import history from 'helpers/history'
import { selectedTenant } from 'states/applicationState/tenant'
import { selectedProject } from 'states/applicationState/project'
import { applicationsControllerCreateApplication } from 'swagger-api/v3/apis/Applications'

import CrudDrawer from 'components/Common/CrudDrawer'
import useAsyncFn from 'hooks/useAsyncFn'
import ApplicationForm from './ApplicationForm'
import { buildApplicationDetailRoute } from 'constants/routes/routes'
import {
  CustomCheckCircleFilled,
  CustomCloseCircleFilled,
  FooterWrapper,
  ModalText,
  ModalTitle,
  ModalWrapper
} from 'components/App/ApplicationsManagement/CreateApplication/style'

interface IProps {
  visible: boolean
  onHide: (visible: boolean) => void
  onRefresh?: () => void
}

const ApplicationCrudDrawer: React.FC<IProps> = ({ onRefresh, visible, onHide }) => {
  const project = useRecoilValue(selectedProject)
  const tenant = useRecoilValue(selectedTenant)

  const [createApplicationState, createApplicationFn] = useAsyncFn(applicationsControllerCreateApplication)
  const [isSubmitDisabled, setSubmitDisabled] = React.useState(true)

  const [isSuccessModalVisible, setSuccessModalVisible] = React.useState(false)
  const [isFailureModalVisible, setFailureModalVisible] = React.useState(false)

  const [form] = Form.useForm()

  const sbumitButtomRef = React.useRef<HTMLElement>(null)
  const handleRouteToDeployConfig = async () => {
    const { appName } = await form.validateFields()
    const formatApplicationName = `${project.name}-${appName}`
    const applicationDetailRoute = buildApplicationDetailRoute({
      tenantId: tenant.id,
      projectName: project.name,
      applicationName: formatApplicationName
    })
    const deployConfigURI = encodeURI(`${applicationDetailRoute}?selectedTab=Deploy Config`)
    history.push(deployConfigURI)
  }
  const handleCancel = () => {
    onHide(false)
  }

  const handleOk = async () => {
    try {
      const values: any = await form.validateFields()

      if (createApplicationState) {
        const result: any = await createApplicationFn({
          tenantId: tenant.id,
          projectName: project.name,
          payload: {
            ...values,
            pipeline: ''
          }
        })

        if (result && result.project) {
          setSuccessModalVisible(true)
          sbumitButtomRef?.current?.focus()
        }
      }
    } catch (err) {
      setFailureModalVisible(true)
      sbumitButtomRef?.current?.focus()
      console.error('error: ', err)
    }
  }

  const handleFieldsChange = (disabled: boolean) => setSubmitDisabled(disabled)

  return (
    <>
      <CrudDrawer
        title='Create Application'
        visible={visible}
        onCancel={handleCancel}
        onSubmit={handleOk}
        body={<ApplicationForm form={form} onFieldsChange={handleFieldsChange} />}
        closeDrawer={() => handleCancel()}
        isSubmitDisabled={isSubmitDisabled}
      />
      <Modal
        width='400px'
        visible={isSuccessModalVisible}
        getContainer={() => document.body}
        onCancel={handleCancel}
        footer={[
          <FooterWrapper key='footer'>
            <Button onClick={handleCancel}>Cancel</Button>,
            <Button ref={sbumitButtomRef} type='primary' onClick={handleRouteToDeployConfig}>
              Go to Deploy Config
            </Button>
          </FooterWrapper>
        ]}
      >
        <ModalWrapper>
          <CustomCheckCircleFilled />
          <ModalTitle>Success</ModalTitle>
          <ModalText>Application was created successfully, </ModalText>
          <ModalText>You will go to deploy config for the first configuration. </ModalText>
        </ModalWrapper>
      </Modal>

      <Modal
        width='400px'
        visible={isFailureModalVisible}
        getContainer={() => document.body}
        onCancel={handleCancel}
        footer={[
          <FooterWrapper key='footer'>
            <Button ref={sbumitButtomRef} type='primary' onClick={handleCancel}>
              Confirm
            </Button>
          </FooterWrapper>
        ]}
      >
        <ModalWrapper>
          <CustomCloseCircleFilled />
          <ModalTitle>Fail</ModalTitle>
          <ModalText>Your Application did not create successfully</ModalText>
        </ModalWrapper>
      </Modal>
    </>
  )
}

export default ApplicationCrudDrawer
