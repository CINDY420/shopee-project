import React, { useState, useEffect, useCallback } from 'react'
import parser from 'cron-parser'

import { StyledModal, Title, StyledTable, StyledFormItem as Item, StyledAlert, RequiredKey } from './style'
import { Form, message, Popover, Switch, Input } from 'infrad'
import { IQuestionMark } from 'infra-design-icons'
import ProfilingSettingForm from 'components/App/ApplicationsManagement/Common/ProfilingSettingForm'
import { pprofControllerGetPprofCronjob, pprofControllerCreatePprofCronjob } from 'swagger-api/v3/apis/Pprof'
import { IGetPprofCronjobData } from 'swagger-api/v3/models'

import { TABS, AZ_TYPE_QUERY_KEY } from 'constants/deployment'
import { buildDeployDetailRoute } from 'constants/routes/routes'
import history from 'helpers/history'

const { confirm } = StyledModal

interface IScheduleProfiling {
  deployment: any
  visible: boolean
  onClose: () => void
  azType?: string
}

const ScheculeProfiling: React.FC<IScheduleProfiling> = ({ deployment, visible, onClose, azType }) => {
  const {
    name: deployName,
    tenantId,
    projectName,
    appName,
    info: { clusterId, env }
  } = deployment || {}

  const [form] = Form.useForm()

  const [profileEnable, setProfileEnable] = useState<boolean>(false)
  const [hasEdit, setHasEdit] = useState<boolean>(false)

  const profilingHistoryListRoute = `${buildDeployDetailRoute({
    tenantId,
    projectName,
    applicationName: appName,
    deployName,
    clusterId
  })}?selectedTab=${TABS.PROFILING_HISTORY}&${AZ_TYPE_QUERY_KEY}=${azType}`

  const setProfileCronJobDetail = useCallback(
    (profileCronJob: IGetPprofCronjobData) => {
      const { enable = false, sampleTime, object, cpuLimit, memoryLimit, scheduler } = profileCronJob || {}
      form.setFieldsValue({ enable, sampleTime, object, cpuLimit, memoryLimit, scheduler })
      setProfileEnable(enable)
    },
    [form]
  )

  const getProfileCronJobDetail = useCallback(async () => {
    try {
      const { data: profileCronJob } = await pprofControllerGetPprofCronjob({
        tenantId,
        projectName,
        appName,
        deployName,
        cluster: clusterId
      })
      setProfileCronJobDetail(profileCronJob)
    } catch (err) {
      err.message && message.error(err.message)
    }
  }, [tenantId, projectName, appName, deployName, setProfileCronJobDetail, clusterId])

  useEffect(() => {
    getProfileCronJobDetail()
  }, [getProfileCronJobDetail])

  const handleProfileFormSubmit = async () => {
    const values = await form.validateFields()
    try {
      await pprofControllerCreatePprofCronjob({
        tenantId,
        projectName,
        appName,
        deployName,
        payload: {
          ...values,
          deployName
        }
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

  const handleValuesChange = async () => {
    setHasEdit(true)
  }

  const saveNotice = () =>
    confirm({
      title: 'Notice',
      content: 'Your operation has not been saved, sure to leave？',
      okText: 'Confirm',
      icon: null,
      onOk() {
        handleCancel()
      }
    })

  const details = [
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
        <Item name='env' initialValue={env} noStyle>
          {env}
        </Item>
      )
    },
    {
      key: 'Deployment Name',
      value: (
        <Item name='deployName' initialValue={deployName} noStyle>
          {deployName}
        </Item>
      )
    }
  ]

  return (
    <StyledModal
      title='Schedule Profiling'
      visible={visible}
      onCancel={hasEdit ? saveNotice : handleCancel}
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
      <Form form={form} onValuesChange={handleValuesChange} requiredMark={false}>
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
        <StyledTable bordered={false}>
          <tbody>
            <tr>
              <td className='required-key'>
                <div style={{ marginTop: '-24px' }}>Schedule Profiling</div>
              </td>
              <td>
                <Form.Item name='enable' initialValue={false} style={{ display: 'inline-block' }}>
                  <Switch onChange={setProfileEnable} checked={profileEnable} />
                </Form.Item>
                <span style={{ marginLeft: '16px', fontWeight: 500 }}>{profileEnable ? 'Enabled' : 'Disabled'}</span>
              </td>
            </tr>
            {profileEnable && (
              <tr>
                {profileEnable && (
                  <td className='required-key'>
                    <RequiredKey>
                      Cron Scheduler
                      <Popover
                        content={
                          <>
                            Cron expression is a string consisting of six or seven subexpressions (fields) that describe
                            individual details of the schedule.
                            <a href='https://confluence.shopee.io/pages/viewpage.action?spaceKey=SPDEV&title=Cron+Expression+Format'>
                              View Detail
                            </a>
                          </>
                        }
                      >
                        <IQuestionMark style={{ color: '#B7B7B7', marginLeft: 5, cursor: 'pointer' }} />
                      </Popover>
                    </RequiredKey>
                  </td>
                )}
                <td>
                  <Form.Item
                    name='scheduler'
                    rules={[
                      {
                        validator: (_, value) => {
                          try {
                            parser.parseExpression(value)
                            return Promise.resolve()
                          } catch {
                            return Promise.reject(new Error('Please enter according to cron rules.'))
                          }
                        }
                      }
                    ]}
                  >
                    <Input placeholder='Example：0 3 * * 2-6' style={{ width: '160px' }} />
                  </Form.Item>
                </td>
              </tr>
            )}
          </tbody>
        </StyledTable>
        {profileEnable && (
          <ProfilingSettingForm
            form={form}
            tenantId={tenantId}
            projectName={projectName}
            appName={appName}
            deployName={deployName}
          />
        )}
      </Form>
    </StyledModal>
  )
}

export default ScheculeProfiling
