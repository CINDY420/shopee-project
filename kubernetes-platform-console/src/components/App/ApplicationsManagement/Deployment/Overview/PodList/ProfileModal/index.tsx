import React from 'react'
import { StyledModal, Title, StyledTable, StyledFormItem as Item, StyledAlert } from './style'
import { Form, Select, message } from 'infrad'
import ProfilingSettingForm from 'components/App/ApplicationsManagement/Common/ProfilingSettingForm'

import { IIContainerResponse, IIPodBaseResponse, IGetPodDetailResponseDto } from 'swagger-api/v3/models'
import { pprofControllerCreatePprof } from 'swagger-api/v3/apis/Pprof'

import { TABS } from 'constants/deployment'
import { buildDeployDetailRoute } from 'constants/routes/routes'
import history from 'helpers/history'

interface IProfileModal {
  pod: IGetPodDetailResponseDto | IIPodBaseResponse
  visible: boolean
  deployName: string
  onClose: () => void
}

const ProfileModal: React.FC<IProfileModal> = ({ pod, visible, deployName, onClose }) => {
  const { tenantId, projectName, appName, name, clusterId = '', environment, podIP, containers = [], namespace } =
    pod || {}
  const [form] = Form.useForm()

  const profilingHistoryListRoute = `${buildDeployDetailRoute({
    tenantId,
    projectName,
    applicationName: appName,
    deployName,
    clusterId
  })}?selectedTab=${TABS.PROFILING_HISTORY}`

  const handleProfileFormSubmit = async () => {
    const values = await form.validateFields()
    const { env, podName, podIP, port, sampleTime, object, ...others } = values
    try {
      await pprofControllerCreatePprof({
        tenantId: tenantId.toString(),
        projectName,
        appName,
        deployName,
        payload: { env, podName, podIP, port, sampleTime, object, namespace, ...others }
      })
      message.success('Create Successfully!')
      history.push(profilingHistoryListRoute)
    } catch (err) {
      err.message && message.error(err.message)
    }
    handleCancel()
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  const isStringArray = (arg: any): arg is string[] => {
    const isArray = (item: any): item is string => {
      return typeof item === 'string'
    }
    return Array.isArray(arg) && arg.every(isArray)
  }

  const renderContainersFn = (containers: string[] | IIContainerResponse[]) => {
    if (isStringArray(containers)) {
      return containers.map(item => (
        <Select.Option value={item} key={item}>
          {item}
        </Select.Option>
      ))
    } else {
      return containers.map(({ name }) => (
        <Select.Option value={name} key={name}>
          {name}
        </Select.Option>
      ))
    }
  }

  const details = [
    {
      key: 'Pod Name',
      value: (
        <Item name='podName' initialValue={name} noStyle>
          {name}
        </Item>
      )
    },
    {
      key: 'Cluster Name',
      value: (
        <Item name='cluster' initialValue={clusterId} noStyle>
          {clusterId}
        </Item>
      )
    },
    {
      key: 'Environment',
      value: (
        <Item name='env' initialValue={environment} noStyle>
          {environment}
        </Item>
      )
    },
    {
      key: 'Pod IP',
      value: (
        <Item name='podIP' initialValue={podIP} noStyle>
          {podIP}
        </Item>
      )
    },
    {
      key: 'Container',
      value: (
        <Item
          name='container'
          initialValue={isStringArray(containers) ? containers?.[0] : containers?.[0]?.name}
          noStyle={containers.length < 2}
        >
          {containers.length > 1 ? (
            <Select style={{ width: '400px' }}>{renderContainersFn(containers)}</Select>
          ) : isStringArray(containers) ? (
            containers?.[0]
          ) : (
            containers?.[0]?.name
          )}
        </Item>
      )
    }
  ]

  return (
    <StyledModal
      title='Profile Container Performance'
      visible={visible}
      onCancel={handleCancel}
      onOk={handleProfileFormSubmit}
      okText='Confirm'
      getContainer={() => document.body}
      centered={true}
      closable={false}
      maskClosable={false}
      bodyStyle={{ padding: '12px 24px' }}
    >
      <StyledAlert
        showIcon
        type='warning'
        message='The data will be available in 15 days. Pprof will take up about 5% of the resources, please use it with caution when the CPU/ Memory exceeds 80%.'
      />
      <Form form={form} requiredMark={false}>
        <Title>Details</Title>
        <StyledTable>
          <tbody>
            {details.map(({ key, value }) => {
              return (
                <tr key={key}>
                  <td className='key'>{key}</td>
                  <td>{value}</td>
                </tr>
              )
            })}
          </tbody>
        </StyledTable>
        <Title>Profile Setting</Title>
        <ProfilingSettingForm
          form={form}
          tenantId={tenantId}
          projectName={projectName}
          appName={appName}
          deployName={deployName}
        />
      </Form>
    </StyledModal>
  )
}

export default ProfileModal
