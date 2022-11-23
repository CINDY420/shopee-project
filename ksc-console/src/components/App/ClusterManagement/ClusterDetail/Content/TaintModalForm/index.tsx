import React from 'react'
import { Col, Form, FormInstance, Input, Radio, Row } from 'infrad'
import { StyledFormItem } from 'components/App/ClusterManagement/ClusterDetail/Content/TaintModalForm/style'
import { INodeListItem } from 'swagger-api/models'

interface ITaintsModalProps {
  form: FormInstance
  currentNodeDetail?: INodeListItem
  isEditingModal: boolean
}
const EFFECT_RADIOS = ['NoSchedule', 'PreferNoSchedule']
const TaintModalForm: React.FC<ITaintsModalProps> = ({
  form,
  currentNodeDetail,
  isEditingModal,
}) => {
  const setInitialFormData = React.useCallback(() => {
    if (currentNodeDetail) {
      if (isEditingModal) {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          taints: currentNodeDetail.taints,
          nodeName: currentNodeDetail.name,
          nodeId: currentNodeDetail.nodeId,
        })
        return
      }
      form.setFieldsValue({
        ...form.getFieldsValue(),
        nodeName: currentNodeDetail.name,
        nodeId: currentNodeDetail.nodeId,
      })
    }
  }, [currentNodeDetail, form, isEditingModal])

  React.useEffect(() => {
    setInitialFormData()
  }, [setInitialFormData])

  return (
    <Form
      name="addLabel"
      form={form}
      labelCol={{ span: 5 }}
      wrapperCol={{ span: 16 }}
      style={{ marginTop: 32, marginBottom: 32 }}
    >
      <Form.Item noStyle name="nodeId" />
      <Form.Item label="Node Name" name="nodeName">
        <Input disabled />
      </Form.Item>
      <StyledFormItem label="Taint" required>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Form.Item
              name={['taints', 0, 'key']}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input key',
                },
              ]}
            >
              <Input addonBefore="Key" placeholder="Please input key" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name={['taints', 0, 'value']}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'Please input value',
                },
              ]}
            >
              <Input addonBefore="Value" placeholder="Please input value" />
            </Form.Item>
          </Col>
        </Row>
      </StyledFormItem>
      <Form.Item label="Effect" name={['taints', 0, 'effect']} required>
        <Radio.Group>
          {EFFECT_RADIOS.map((effect) => (
            <Radio key={effect} value={effect}>
              {effect}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    </Form>
  )
}

export default TaintModalForm
