import React from 'react'
import { Modal, Form, Select, Button, Input } from 'infrad'
import {
  NodeContext,
  getDispatchers,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable/useNodeContext'
import { NodeAction } from 'src/components/App/Cluster/ClusterDetail/NodeTable/constant'
import TableFormList, {
  IColumns,
  IActionRender,
  IAddNewRender,
} from 'src/components/Common/TableFormList'
import {
  StyledNodeTable,
  StyledOperateTable,
  StyledTitle,
  StyleTableCellTitle,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable/NodeActions/LabelAndTaint/style'
import { ColumnsType } from 'infrad/lib/table'
import { IEksNodeItem } from 'src/swagger-api/models'
import { PlusOutlined } from 'infra-design-icons'
import {
  eksNodeController_setNodeLabels,
  eksNodeController_setNodeTiants,
} from 'src/swagger-api/apis/EksNode'
import { useParams } from 'react-router-dom'
import { message } from 'antd'

const OperateList = {
  ADD: 'Add',
  DELETE: 'Delete',
}

const EffectList = {
  NO_SCHEDULE: 'NoSchedule',
  NO_EXECUTE: 'NoExecute',
  PREFER_NO_SCHEDULE: 'PreferNoSchedule',
}

const FormItemHelpMessage =
  'Length is 1 ~63 characters, can only contain numbers, letters, dashes(-) and point(.)'

const LabelAndTaint: React.FC = () => {
  const { state, dispatch } = React.useContext(NodeContext)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [dispatch])
  const { action, selectedNodes } = state
  const modalVisible = action === NodeAction.LABEL || action === NodeAction.TAINT
  const isTaintAction = action === NodeAction.TAINT
  const FormItemName = 'actionData'
  const operateTarget = isTaintAction ? 'taints' : 'labels'

  const { clusterId } = useParams<{
    clusterId: string
  }>()

  const [form] = Form.useForm()
  const operateData = Form.useWatch(FormItemName, form)
  const operateDataLength = operateData?.length ?? 0

  const inputValidator = (key: string) => {
    if (!key) return Promise.resolve()
    if (key.length < 1 || key.length > 63) {
      return Promise.reject('Exceeded character input length')
    }
    const keyItems = key.split('')
    const inputRule = /^[a-zA-Z0-9-_.]+$/
    const numberAndLettersRule = /^[a-zA-Z0-9]+$/
    const start = keyItems.shift()
    const end = keyItems.pop()
    if (!numberAndLettersRule.test(start)) {
      return Promise.reject(`cannot start with ${start === ' ' ? 'blank' : start}`)
    }
    if (!numberAndLettersRule.test(end)) {
      return Promise.reject(`cannot end with ${end === ' ' ? 'blank' : end}`)
    }
    const errors = keyItems.filter((item) => !inputRule.test(item))
    const deduplicatedErrors = Array.from(new Set(errors))
    if (deduplicatedErrors.length > 0) {
      const errors = deduplicatedErrors.map((item) => (item === ' ' ? 'blank' : item))
      return Promise.reject(`Input cannot contain ${errors.join('')}`)
    }
    return Promise.resolve()
  }

  React.useEffect(() => {
    if (!modalVisible) return
    if (isTaintAction) {
      form.setFieldsValue({
        [FormItemName]: [
          {
            operator: OperateList.ADD,
            [operateTarget]: {
              effect: EffectList.NO_SCHEDULE,
            },
          },
        ],
      })
    } else {
      form.setFieldsValue({
        [FormItemName]: [
          {
            operator: OperateList.ADD,
          },
        ],
      })
    }
  }, [form, isTaintAction, modalVisible, operateTarget])

  const labelOperateColumns: IColumns = [
    {
      title: <StyleTableCellTitle>Operate</StyleTableCellTitle>,
      key: 'operator',
      width: '20%',
      render: (_, record) => (
        <Form.Item
          name={[record.name, 'operator']}
          rules={[{ required: true }]}
          initialValue={OperateList.ADD}
        >
          <Select
            onChange={(value) => {
              if (value === OperateList.DELETE) {
                form.resetFields([[FormItemName, record.name, operateTarget, 'value']])
              }
            }}
          >
            {Object.values(OperateList).map((item) => (
              <Select.Option key={item}>{item}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: <StyleTableCellTitle>Key</StyleTableCellTitle>,
      key: 'key',
      render: (_, record, index) => (
        <Form.Item
          name={[record.name, operateTarget, 'key']}
          rules={[
            { required: true, message: 'Key is a required field' },
            {
              validator: (_, key: string) => inputValidator(key),
            },
          ]}
          extra={index === operateDataLength - 1 ? FormItemHelpMessage : undefined}
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      key: 'equal',
      className: 'equalCol',
      render: () => <Form.Item>=</Form.Item>,
    },
    {
      title: 'Value',
      key: 'value',
      render: (_, record) => (
        <Form.Item
          name={[record.name, operateTarget, 'value']}
          rules={[
            {
              validator: (_, key: string) => inputValidator(key),
            },
          ]}
          extra={record.name === operateDataLength - 1 ? FormItemHelpMessage : undefined}
        >
          <Input disabled={operateData?.[record.name]?.operator === OperateList.DELETE} />
        </Form.Item>
      ),
    },
  ]

  const taintOperateColumns = labelOperateColumns.concat({
    title: <StyleTableCellTitle>Effect</StyleTableCellTitle>,
    key: 'effect',
    width: '23%',
    render: (_, record) => (
      <Form.Item
        name={[record.name, operateTarget, 'effect']}
        rules={[{ required: true }]}
        initialValue={EffectList.NO_SCHEDULE}
      >
        <Select>
          {Object.values(EffectList).map((item) => (
            <Select.Option key={item}>{item}</Select.Option>
          ))}
        </Select>
      </Form.Item>
    ),
  })

  const nodeColumns: ColumnsType<IEksNodeItem> = [
    {
      title: 'Node',
      dataIndex: 'nodeName',
    },
    {
      title: 'Private IP',
      dataIndex: 'privateIp',
    },
  ]

  const actionRender: IActionRender = (triggerRemove) => (
    <Button onClick={triggerRemove} type="link" style={{ padding: 0 }}>
      Delete
    </Button>
  )

  const handleCancel = () => {
    form.resetFields()
    dispatchers.exitEdit()
  }

  const handleConfirm = async () => {
    const data = await form.validateFields()
    const actionData = data[FormItemName]
    const nodes = selectedNodes.map((item) => item.nodeName)
    if (isTaintAction) {
      await eksNodeController_setNodeTiants({
        clusterId: Number(clusterId),
        payload: {
          taints: actionData,
          nodes,
        },
      })
    } else {
      await eksNodeController_setNodeLabels({
        clusterId: Number(clusterId),
        payload: {
          labels: actionData,
          nodes,
        },
      })
    }
    message.success('Operation success')
    dispatchers.requestRefresh()
    handleCancel()
  }

  const addNewRender: IAddNewRender = (triggerAdd) => (
    <Button
      type="dashed"
      block
      icon={<PlusOutlined />}
      disabled={operateDataLength >= 30}
      onClick={() => triggerAdd()}
      style={{ padding: 0 }}
    >
      Add ({operateDataLength}/30)
    </Button>
  )

  return (
    <Modal
      title={selectedNodes?.length > 1 ? `Batch ${action}` : action}
      visible={modalVisible}
      onCancel={handleCancel}
      okText="Confirm"
      onOk={handleConfirm}
      getContainer={document.body}
      width={950}
      okButtonProps={{ disabled: operateDataLength === 0 }}
    >
      <Form form={form}>
        <StyledTitle>Operate</StyledTitle>
        <TableFormList
          name={FormItemName}
          initialValue={[undefined]}
          columns={isTaintAction ? taintOperateColumns : labelOperateColumns}
          actionRender={actionRender}
          actionRenderTitle="Action"
          style={{ backgroundColor: '#ffffff', padding: 0 }}
          AntdTable={StyledOperateTable}
          addNewRender={addNewRender}
        />
      </Form>
      <StyledTitle style={{ marginTop: '32px' }}>
        {selectedNodes.length} Node has been selected
      </StyledTitle>
      <StyledNodeTable
        rowKey="nodeName"
        columns={nodeColumns}
        dataSource={selectedNodes}
        pagination={false}
        scroll={{ y: 830 }}
      />
    </Modal>
  )
}

export default LabelAndTaint
