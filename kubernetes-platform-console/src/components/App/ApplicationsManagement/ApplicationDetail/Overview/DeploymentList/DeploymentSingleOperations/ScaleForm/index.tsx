import * as React from 'react'
import { Form, Input, message, Alert, Typography } from 'infrad'

import useAsyncFn from 'hooks/useAsyncFn'
import { IDeploymentSingleEditProps } from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations'
import { DEPLOYMENT_ACTIONS, PHASE_CANARY, CANARY_PHASE } from 'constants/deployment'
import { deploymentsControllerScaleApplicationDeploys } from 'swagger-api/v3/apis/Deployments'
import { ticketControllerCreateTicket } from 'swagger-api/v1/apis/Ticket'
import { clusterControllerListSpecialClusterNames } from 'swagger-api/v1/apis/Cluster'
import { AccessControlContext } from 'hooks/useAccessControl'
import { ApplicationContext } from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/useApplicationContext'
import { GlobalContext } from 'hocs/useGlobalContext'

import BaseForm from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations/Common/BaseForm'
import Scale from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations/ScaleForm/Scale'

import { Label } from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations/style'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'
import { AUTH_TYPE, TICKET_TITLE } from 'constants/approval'
import { PLATFORM_USER_ROLE } from 'constants/rbacActions'
import { getClusterNameById } from 'helpers/cluster'
import { HorizontalDivider, VerticalDivider } from 'common-styles/divider'
import { hpaControllerListHPARules } from 'swagger-api/v1/apis/Hpa'
import { InfoCircleOutlined } from 'infra-design-icons'
import {
  TitleWrapper,
  IconWrapper,
  Title,
  ContentWrapper
} from 'components/App/ApplicationsManagement/ApplicationDetail/Overview/DeploymentList/DeploymentSingleOperations/ScaleForm/style'

const { Text } = Typography
const { TextArea } = Input

const ScaleForm: React.FC<IDeploymentSingleEditProps> = ({
  initialValues,
  onValuesChange,
  application,
  afterFinished,
  onSuccess,
  deployConfigEnable
}) => {
  const [form] = Form.useForm()

  const {
    phase,
    appInstanceName = '',
    canaryCount: currentCanaryPodCount = 0,
    releaseCount: currentReleasePodCount = 0,
    clusterId
  } = initialValues || {}
  const { tenantId, projectName, name: appName } = application

  const [specialClusterList, setSpecialClusterList] = React.useState<string[]>([])

  const accessControlContext = React.useContext(AccessControlContext)
  const deploymentActions = accessControlContext[RESOURCE_TYPE.DEPLOYMENT]
  const canScaleLive = deploymentActions.includes(RESOURCE_ACTION.ScaleLive)
  const canScaleNonLive = deploymentActions.includes(RESOURCE_ACTION.ScaleNonLive)
  const { state: GlobalContextState } = React.useContext(GlobalContext)
  const { userRoles = [] } = GlobalContextState || {}

  const { state: ApplicationContextState } = React.useContext(ApplicationContext)
  const { selectedEnvironment } = ApplicationContextState

  const isLiveEnv = selectedEnvironment?.toUpperCase() === 'LIVE'

  const [hpaRulesEnable, setHpaRulesEnable] = React.useState(false)

  const getSpecialClusterList = React.useCallback(async () => {
    const specialClusterList = (await clusterControllerListSpecialClusterNames()) ?? []
    setSpecialClusterList(specialClusterList)
  }, [])

  const getSduHpaRuleStatus = React.useCallback(async () => {
    const { lists: hpaList } = await hpaControllerListHPARules({
      tenantId: application.tenantId,
      projectName: application.projectName,
      appName: application.name
    })
    hpaList.forEach(item => {
      if (item.meta.az === initialValues.name && item.meta.sdu === initialValues.sduName) {
        setHpaRulesEnable(!!item.spec.status)
      }
    })
  }, [application.name, application.projectName, application.tenantId, initialValues.name, initialValues.sduName])

  React.useEffect(() => {
    getSpecialClusterList()
    getSduHpaRuleStatus()
  }, [getSpecialClusterList, getSduHpaRuleStatus])

  const canScaleWithoutCreateTicket = () => {
    const clusterName = getClusterNameById(clusterId)
    if (specialClusterList.includes(clusterName)) {
      const values = form.getFieldsValue()
      const { canaryCount: targetCanaryPodCount = 0, releaseCount: targetReleasePodCount = 0 } = values
      if (targetCanaryPodCount + targetReleasePodCount <= currentCanaryPodCount + currentReleasePodCount) {
        return true
      }
      return userRoles.find(role => role.roleId === PLATFORM_USER_ROLE.PLATFORM_ADMIN)
    } else {
      return isLiveEnv ? canScaleLive : canScaleNonLive
    }
  }

  const [, fetchWithoutTicketFn] = useAsyncFn(deploymentsControllerScaleApplicationDeploys)
  const [, fetchWithTicketFn] = useAsyncFn(ticketControllerCreateTicket)

  const submitScaleWithoutCreateTicket = () => {
    const values = form.getFieldsValue()
    const { canaryCount, clusterId, sduName: name, releaseCount } = values
    fetchWithoutTicketFn({
      tenantId: Number(tenantId),
      projectName,
      appName,
      payload: {
        deploys: [
          {
            name,
            clusterId,
            canaryCount,
            releaseCount,
            canaryValid: phase === PHASE_CANARY || phase === CANARY_PHASE,
            appInstanceName
          }
        ]
      }
    }).then(() => {
      message.success(`${DEPLOYMENT_ACTIONS.SCALE} ${values.name} successful!`)
      onSuccess?.()
    })

    afterFinished()
  }

  const submitScaleWithCreateTicket = () => {
    const values = form.getFieldsValue()
    const {
      canaryCount: targetCanaryPodCount,
      clusterId,
      sduName: name,
      releaseCount: targetReleasePodCount,
      purpose = ''
    } = values
    fetchWithTicketFn({
      payload: {
        type: AUTH_TYPE.DEPLOYMENT_SCALE,
        title: TICKET_TITLE[AUTH_TYPE.DEPLOYMENT_SCALE],
        scaleDeploymentTicketForm: {
          deployment: name,
          clusterId,
          currentReleasePodCount,
          targetReleasePodCount,
          currentCanaryPodCount,
          targetCanaryPodCount,
          purpose
        },
        scaleDeploymentTicketExtraInfo: {
          tenantId: tenantId?.toString(),
          projectName,
          appName,
          appInstanceName,
          canaryValid: phase === PHASE_CANARY || phase === CANARY_PHASE,
          phase
        }
      }
    }).then(() => {
      message.success('Your application has been submitted')
      onSuccess?.()
    })

    afterFinished()
  }

  const submitScale = () => {
    if (canScaleWithoutCreateTicket()) {
      submitScaleWithoutCreateTicket()
    } else {
      submitScaleWithCreateTicket()
    }
  }
  return (
    <BaseForm
      enableGotIt={true}
      form={form}
      initialValues={initialValues}
      id={DEPLOYMENT_ACTIONS.SCALE}
      deployConfigEnable={deployConfigEnable}
      onFinish={submitScale}
      onValuesChange={onValuesChange}
      confirmConfig={{
        title: null,
        content: (
          <>
            <TitleWrapper>
              <IconWrapper>
                <InfoCircleOutlined style={{ fontSize: '21px', color: '#08c' }} />
              </IconWrapper>
              <HorizontalDivider size='18px' />
              <Title>Scale Change Confirmation</Title>
            </TitleWrapper>
            <VerticalDivider size='8px' />
            <ContentWrapper>
              <Text type='secondary'>Change From:</Text>
              <Text>Runtime Release Pod Count: {currentReleasePodCount}</Text>
              <Text>Runtime Canary Pod Count: {currentCanaryPodCount}</Text>
              <Text type='secondary'>To:</Text>
              <Text>Runtime Release Pod Count: {form.getFieldsValue().releaseCount}</Text>
              {form.getFieldsValue().canaryCount !== undefined && (
                <Text>Runtime Canary Pod Count: {form.getFieldsValue().canaryCount}</Text>
              )}
            </ContentWrapper>
          </>
        )
      }}
    >
      {hpaRulesEnable && (
        <>
          <Alert
            message='HPA Rules for the deployment is enabled now. BE CAREFUL: manual scaling will be affect by HPA rules.'
            type='warning'
            showIcon
          />
          <VerticalDivider size='24px' />
        </>
      )}
      <Form.Item label={<Label>Deployment Name</Label>} name='sduName'>
        <Input disabled />
      </Form.Item>
      <Form.Item label={<Label>Cluster</Label>} name='clusterId'>
        <Input disabled />
      </Form.Item>
      <Scale phase={phase} />
      <Form.Item
        label={<Label>Purpose</Label>}
        name='purpose'
        help='Your application will be sent to the approver, and you can check the current progress in the Ticket Center.'
      >
        <TextArea placeholder='Please enter the background of your operation.' autoSize />
      </Form.Item>
    </BaseForm>
  )
}

export default ScaleForm
