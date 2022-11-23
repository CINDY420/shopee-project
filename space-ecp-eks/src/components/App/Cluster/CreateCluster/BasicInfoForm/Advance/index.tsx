import React from 'react'
import {
  Card,
  Divider,
  Row,
  Col,
  Switch,
  Form,
  Input,
  Button,
  Space,
  Select,
  FormInstance,
} from 'infrad'
import SubCard from 'src/components/App/Cluster/CreateCluster/Common/SubCard'
import {
  RuntimeContent,
  StyledTable,
  CertificateWrapper,
  ObservabilityContent,
  OperatorWrapper,
} from 'src/components/App/Cluster/CreateCluster/BasicInfoForm/Advance/style'
import InfoTooltip from 'src/components/Common/InfoTooltip'
import TableFormList, { IColumns, IActionRender } from 'src/components/Common/TableFormList'
import {
  ADVANCE_ITEM_NAME,
  ADVANCE_EVENT_ETCD_ITEM_NAME,
  ADVANCE_EXTRA_ARGS_KEY_ITEM_NAME,
  ADVANCE_EXTRA_ARGS_VALUE_ITEM_NAME,
} from 'src/components/App/Cluster/CreateCluster/constant'
import { antdFormIPV4ListValidator } from 'src/components/App/Cluster/CreateCluster/helper'

const actionRender: IActionRender = (triggerRemove) => (
  <Button onClick={triggerRemove} type="link" style={{ marginBottom: '24px' }}>
    Delete
  </Button>
)
const handleHeaderRow = () => ({
  style: {
    color: 'rgba(0, 0, 0, 0.85)',
  },
})
const extraTableFormListStyle = { backgroundColor: '#ffffff', padding: 0 }
const generateExtraArgsColumns = (title: string) => {
  const extraArgsColumns: IColumns = [
    {
      title,
      width: '46%',
      key: 'extraArgs-key',
      render: (_, record) => (
        <Form.Item
          normalize={(value: string) => value.trim()}
          name={[record.name, ADVANCE_EXTRA_ARGS_KEY_ITEM_NAME]}
          rules={[{ required: true, message: 'Please enter' }]}
        >
          <Input />
        </Form.Item>
      ),
    },
    {
      key: 'operation',
      render: () => <OperatorWrapper>=</OperatorWrapper>,
    },
    {
      key: 'extraArgs-value',
      render: (_, record) => (
        <Form.Item
          normalize={(value: string) => value.trim()}
          name={[record.name, ADVANCE_EXTRA_ARGS_VALUE_ITEM_NAME]}
          rules={[{ required: true, message: 'Please enter' }]}
        >
          <Input />
        </Form.Item>
      ),
    },
  ]
  return extraArgsColumns
}
const apiServerExtraArgsColumns = generateExtraArgsColumns('apiserver-extraArgs')
const controllerManagementExtraArgsColumns = generateExtraArgsColumns(
  'controllerManagement-extraArgs',
)
const schedulerExtraArgsColumns = generateExtraArgsColumns('scheduler-extraArgs')

interface IAdvanceProps {
  form: FormInstance
}

const Advance: React.FC<IAdvanceProps> = ({ form }) => {
  const handleBeforeAddNew = async (formListName: string[]) => {
    const extraArgs = form.getFieldValue(formListName)
    if (!extraArgs || extraArgs?.length <= 0) return
    const lastItemIndex = extraArgs.length - 1
    const extraArgKeyItemFormNames = [
      ...formListName,
      lastItemIndex,
      ADVANCE_EXTRA_ARGS_KEY_ITEM_NAME,
    ]
    const extraArgValueItemFormNames = [
      ...formListName,
      lastItemIndex,
      ADVANCE_EXTRA_ARGS_VALUE_ITEM_NAME,
    ]

    await form.validateFields([extraArgKeyItemFormNames, extraArgValueItemFormNames])
  }
  return (
    <Card title="Advance">
      <SubCard title="Runtime">
        <RuntimeContent>
          <Row gutter={[0, 9]}>
            <Col span={12}>Dragonfly</Col>
            <Col span={12}>
              GPU <InfoTooltip info="Configure the GPU in container." />
            </Col>
            <Col span={12}>
              <Form.Item name={ADVANCE_ITEM_NAME.ENABLE_DRAGONFLY} valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={ADVANCE_ITEM_NAME.ENABLE_GPU} valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </RuntimeContent>
      </SubCard>
      <Divider />
      <SubCard title="Control Plane" titleStyle={{ paddingBottom: 0 }}>
        <Space size={12} direction="vertical" style={{ width: '100%' }}>
          <TableFormList
            name={ADVANCE_ITEM_NAME.API_SERVER_EXTRA_ARGS}
            columns={apiServerExtraArgsColumns}
            actionRender={actionRender}
            style={extraTableFormListStyle}
            onHeaderRow={handleHeaderRow}
            AntdTable={StyledTable}
            beforeAddNew={() => handleBeforeAddNew(ADVANCE_ITEM_NAME.API_SERVER_EXTRA_ARGS)}
          />
          <TableFormList
            name={ADVANCE_ITEM_NAME.CONTROLLER_MANAGEMENT_EXTRA_ARGS}
            columns={controllerManagementExtraArgsColumns}
            actionRender={actionRender}
            style={extraTableFormListStyle}
            onHeaderRow={handleHeaderRow}
            AntdTable={StyledTable}
            beforeAddNew={() =>
              handleBeforeAddNew(ADVANCE_ITEM_NAME.CONTROLLER_MANAGEMENT_EXTRA_ARGS)
            }
          />
          <TableFormList
            name={ADVANCE_ITEM_NAME.SCHEDULER_EXTRA_ARGS}
            columns={schedulerExtraArgsColumns}
            actionRender={actionRender}
            style={extraTableFormListStyle}
            onHeaderRow={handleHeaderRow}
            AntdTable={StyledTable}
            beforeAddNew={() => handleBeforeAddNew(ADVANCE_ITEM_NAME.SCHEDULER_EXTRA_ARGS)}
          />
        </Space>
      </SubCard>
      <Divider />
      <SubCard title="Event ETCD">
        <Form.Item
          label="Event ETCD IPs"
          name={ADVANCE_EVENT_ETCD_ITEM_NAME.ETCD_IPS}
          normalize={(ips: string[]) => ips.map((ip) => ip.trim())}
          rules={[
            {
              validator: (_, ips: string[]) => antdFormIPV4ListValidator(ips),
            },
          ]}
        >
          <Select
            mode="tags"
            tokenSeparators={[',']}
            open={false}
            allowClear
            placeholder='Please enter the target IPs, separated by commas(",")'
          />
        </Form.Item>
        <CertificateWrapper>Certificate:</CertificateWrapper>
        <Form.Item
          label="SSL Certificate Authority file"
          name={ADVANCE_EVENT_ETCD_ITEM_NAME.AUTHORITY}
        >
          <Input.TextArea rows={5} disabled />
        </Form.Item>
        <Form.Item
          label="Client SSL certificate file"
          name={ADVANCE_EVENT_ETCD_ITEM_NAME.CERTIFICATION}
        >
          <Input.TextArea rows={5} disabled />
        </Form.Item>
        <Form.Item label="Client SSL key file" name={ADVANCE_EVENT_ETCD_ITEM_NAME.KEY}>
          <Input.TextArea rows={5} disabled />
        </Form.Item>
      </SubCard>
      <Divider />
      <SubCard title="Observability">
        <ObservabilityContent>
          <Row gutter={[0, 9]}>
            <Col span={12}>Log</Col>
            <Col span={12}>Monitoring</Col>
            <Col span={12}>
              <Form.Item name={ADVANCE_ITEM_NAME.ENABLE_LOG} valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={ADVANCE_ITEM_NAME.ENABLE_MONITORING} valuePropName="checked" noStyle>
                <Switch />
              </Form.Item>
            </Col>
          </Row>
        </ObservabilityContent>
      </SubCard>
      <Divider />
      <SubCard title="Internal">
        <Space direction="vertical" size={8}>
          <div>Bromo</div>
          <div>
            <Form.Item name={ADVANCE_ITEM_NAME.ENABLE_BROMO} valuePropName="checked" noStyle>
              <Switch />
            </Form.Item>
          </div>
        </Space>
      </SubCard>
    </Card>
  )
}
export default Advance
