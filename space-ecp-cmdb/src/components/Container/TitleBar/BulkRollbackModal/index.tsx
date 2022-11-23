import * as React from 'react'
import { Alert, Collapse, Form, message, Modal, Select, Spin } from 'infrad'
import { isEqual } from 'lodash'
import { fetch } from 'src/rapper'
import { ITriangleDown } from 'infra-design-icons'
import {
  CollapseTale,
  SDUCollapse,
} from 'src/components/Container/TitleBar/BulkRollbackModal/style'
import { IModels } from 'src/rapper/request'
import hooks from 'src/sharedModules/cmdb/hooks'
import { useRequest } from 'ahooks'
import { ColumnsType } from 'infrad/lib/table'
import { EMPTY_PLACEHOLDER } from 'src/components/Container/SduTable'

type DeploymentPreview =
  IModels['GET/api/ecp-cmdb/sdus:rollbackPreview']['Res']['items'][0]['previews'][0]
type RollbackSDUsReq = IModels['POST/api/ecp-cmdb/sdus:rollback']['Req']

const { useSelectedService } = hooks

interface IBulkRollbackModalProps {
  visible: boolean
  onVisibleChange: (visible: boolean) => void
  onReload: () => void
}

interface IBulkRollbackFormValues {
  env: string
  sdus: string[]
  tag: string
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
}

const BulkRollbackModal: React.FC<IBulkRollbackModalProps> = (props) => {
  const { visible, onVisibleChange, onReload } = props
  const { selectedService } = useSelectedService()
  const { service_name: serviceName } = selectedService
  const [form] = Form.useForm<IBulkRollbackFormValues>()

  const columns: ColumnsType<DeploymentPreview> = [
    {
      title: 'AZ',
      dataIndex: 'az',
    },
    {
      title: 'Current Git Tag',
      dataIndex: 'currentTag',
    },
    {
      title: 'Target Git Tag',
      dataIndex: 'targetTag',
      render: (tag: string, record) => {
        const changed = tag !== record?.currentTag
        return (
          <span style={{ color: changed ? '#ee4d2d' : 'unset' }}>{tag || EMPTY_PLACEHOLDER}</span>
        )
      },
    },
    {
      title: 'Current Instance',
      dataIndex: 'currentInstances',
    },
    {
      title: 'Target Instance',
      dataIndex: 'targetInstances',
      render: (instances: number, record) => {
        const changed = instances !== record?.currentInstances
        return (
          <span style={{ color: changed ? '#ee4d2d' : 'unset' }}>
            {instances ?? EMPTY_PLACEHOLDER}
          </span>
        )
      },
    },
  ]

  const { data: envs = [], mutate: setEnv } = useRequest(
    async () => {
      if (visible) {
        const { envs } = await fetch['GET/api/ecp-cmdb/envs']()
        return envs
      }
    },
    {
      refreshDeps: [visible],
      onError: () => {
        setSDUList([])
        setDeploymentsHistories([])
        setSDUsRollbackPreview([])
      },
    },
  )

  const {
    data: sduList = [],
    loading: getSDUListLoading,
    runAsync: getSDUList,
    mutate: setSDUList,
  } = useRequest(
    async (env: string) => {
      const { items } = await fetch['GET/api/ecp-cmdb/services/{serviceName}/sdus:rollbackable']({
        serviceName,
        env,
      })
      return items
    },
    {
      manual: true,
      onError: () => {
        setDeploymentsHistories([])
        setSDUsRollbackPreview([])
      },
    },
  )

  const {
    data: deploymentsHistories = [],
    runAsync: getDeploymentsHistories,
    loading: getDeploymentsHistoriesLoading,
    mutate: setDeploymentsHistories,
  } = useRequest(
    async (sdus: string[]) => {
      const { items } = await fetch['GET/api/ecp-cmdb/sdus:history']({
        sdus,
      })
      return items
    },
    {
      debounceWait: 800,
      manual: true,
      onError: () => {
        setSDUsRollbackPreview([])
      },
    },
  )

  const {
    data: sdusRollbackPreview = [],
    runAsync: getSDUsRollbackPreview,
    loading: getSDUsRollbackPreviewLoading,
    mutate: setSDUsRollbackPreview,
  } = useRequest(
    async (targetTag: string, sdus: string[]) => {
      const { items } = await fetch['GET/api/ecp-cmdb/sdus:rollbackPreview']({
        sdus,
        targetTag,
      })
      return items
    },
    {
      manual: true,
    },
  )

  const handleEnvChange = (env: string) => {
    form.resetFields(['sdus', 'tag'])
    setSDUsRollbackPreview([])
    setSDUList([])
    env && getSDUList(env)
  }

  const handleSDUsChange = () => {
    form.resetFields(['tag'])
    setSDUsRollbackPreview([])
  }

  const handleTargetDeploymentIdChange = (value: string, sdus: string[]) => {
    if (value && sdus?.length) {
      void getSDUsRollbackPreview(value, sdus)
    }
    setSDUsRollbackPreview([])
  }

  const handleCancel = () => {
    onVisibleChange(false)
    form.resetFields()
    setEnv([])
  }

  const { loading: rollbackSDUsLoading, runAsync: rollbackSDUs } = useRequest(
    async (payload: RollbackSDUsReq) => {
      await fetch['POST/api/ecp-cmdb/sdus:rollback'](payload)
    },
    {
      throttleWait: 300,
      manual: true,
      onSuccess: () => {
        void message.success('Rollback succeeded.')
        handleCancel()
        onReload()
      },
    },
  )

  const handleConfirm = async () => {
    const rollbackSDUsData = sdusRollbackPreview.map((item) => {
      const { sdu, previews } = item
      const deployments = previews.map((preview) => ({
        deploymentId: preview.deployId,
        targetDeploymentId: preview.targetDeploymentId,
      }))

      return {
        sdu,
        deployments,
      }
    })
    await rollbackSDUs({ rollbackSDUsData })
  }

  const getHistoryAndPreviewLoading =
    getDeploymentsHistoriesLoading || getSDUsRollbackPreviewLoading

  return (
    <Modal
      title="Bulk Rollback"
      visible={visible}
      onCancel={handleCancel}
      onOk={handleConfirm}
      width={800}
      okText="Confirm"
      confirmLoading={rollbackSDUsLoading}
      okButtonProps={{ disabled: sdusRollbackPreview?.length === 0 }}
    >
      <Alert
        type="warning"
        message="Bulk Rollback is available for bromo deployments only."
        showIcon
        style={{ marginBottom: 24 }}
      />
      <Form form={form} {...formItemLayout}>
        <Form.Item
          label="Environment"
          name="env"
          rules={[{ required: true, message: 'Please select env.' }]}
        >
          <Select onChange={handleEnvChange} allowClear>
            {envs.map((env) => (
              <Select.Option key={env} value={env}>
                {env.toLocaleUpperCase()}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="SDUs"
          name="sdus"
          shouldUpdate={(prev: IBulkRollbackFormValues, curr: IBulkRollbackFormValues) =>
            !isEqual(prev.sdus, curr.sdus)
          }
          rules={[
            { required: true, message: 'Please select SDUs.' },
            {
              validator: async (_, sdus: string[]) => {
                if (!sdus.length) return Promise.resolve()
                const historiesList = await getDeploymentsHistories(sdus)
                if (!historiesList.length) {
                  return Promise.reject()
                }
                return Promise.resolve()
              },
              message: 'Current selected SDU(s) do not have history deployment to rollback.',
            },
          ]}
        >
          <Select
            mode="multiple"
            loading={getSDUListLoading}
            dropdownRender={(menu: React.ReactElement) => (getSDUListLoading ? <Spin /> : menu)}
            dropdownStyle={{ textAlign: getSDUListLoading ? 'center' : 'unset' }}
            onChange={handleSDUsChange}
            allowClear
          >
            {sduList.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValue: IBulkRollbackFormValues, curValue: IBulkRollbackFormValues) =>
            !isEqual(prevValue.sdus, curValue.sdus) || prevValue.env !== curValue.env
          }
        >
          {({ getFieldValue }) => {
            const sdus = getFieldValue('sdus')
            if (!deploymentsHistories?.length || !sdus?.length) return
            return (
              <Form.Item
                label="Git Tag"
                name="tag"
                rules={[{ required: true, message: 'Please Select Git Tag.' }]}
              >
                <Select
                  onChange={(value: string) => handleTargetDeploymentIdChange(value, sdus)}
                  allowClear
                >
                  {deploymentsHistories.map((item) => (
                    <Select.Option key={item} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )
          }}
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) => {
            const sdus: string[] = getFieldValue('sdus')
            const tag = getFieldValue('tag')
            if (!tag) return
            return (
              <SDUCollapse
                defaultActiveKey={sdus}
                ghost
                expandIcon={({ isActive }) => <ITriangleDown rotate={isActive ? 0 : -90} />}
              >
                {sdusRollbackPreview?.map((item) => (
                  <Collapse.Panel header={item?.sdu} key={item?.sdu}>
                    <CollapseTale
                      columns={columns}
                      dataSource={item?.previews}
                      rowKey="az"
                      size="small"
                      pagination={false}
                      locale={{
                        emptyText: (
                          <span style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
                            No history deployment for current commit + idc to rollback
                          </span>
                        ),
                      }}
                    />
                  </Collapse.Panel>
                ))}
              </SDUCollapse>
            )
          }}
        </Form.Item>
        {getHistoryAndPreviewLoading && <Spin style={{ width: '100%' }} />}
      </Form>
    </Modal>
  )
}

export default BulkRollbackModal
