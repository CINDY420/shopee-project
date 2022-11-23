import React from 'react'
import { Button, Col, Form, FormInstance, Input, Row } from 'infrad'
import { IAdd, ITrash } from 'infra-design-icons'
import {
  StyledIconWrapper,
  StyledRow,
  StyledNumberCol,
  StyledFormListWrapper,
} from 'components/App/ClusterManagement/ClusterDetail/Content/LabelsModalForm/style'
import { INodeListItem } from 'swagger-api/models'

interface ILabelsModalProps {
  form: FormInstance
  currentNodeDetail?: INodeListItem
  isEditingModal: boolean
}

const formItemLayoutWithoutLabelProps = {
  wrapperCol: { span: 24, offset: 2 },
}
const LabelsModalForm: React.FC<ILabelsModalProps> = ({
  form,
  currentNodeDetail,
  isEditingModal,
}) => {
  const setInitialFormData = React.useCallback(() => {
    if (currentNodeDetail) {
      if (isEditingModal) {
        form.setFieldsValue({
          ...form.getFieldsValue(),
          labels: currentNodeDetail.labels,
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
      <Form.Item label="Label(s)" required>
        <StyledFormListWrapper>
          <StyledRow gutter={[16, 16]}>
            <Col span={2}>No.</Col>
            <Col span={10}>Key</Col>
            <Col span={10}>Value</Col>
          </StyledRow>
          <Form.List name="labels">
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ name, ...restField }, index) => (
                  <Row gutter={[16, 16]} key={name}>
                    <StyledNumberCol span={2}>{index + 1}</StyledNumberCol>
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, 'key']}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'Please input key',
                          },
                        ]}
                      >
                        <Input placeholder="Please input key" />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, 'value']}
                        rules={[
                          {
                            required: true,
                            whitespace: true,
                            message: 'Please input value',
                          },
                        ]}
                      >
                        <Input placeholder="Please input value" />
                      </Form.Item>
                    </Col>
                    {fields.length > 1 ? (
                      <Col>
                        <StyledIconWrapper>
                          <ITrash onClick={() => remove(name)} />
                        </StyledIconWrapper>
                      </Col>
                    ) : null}
                  </Row>
                ))}
                <Form.Item {...formItemLayoutWithoutLabelProps}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    style={{ width: '100%' }}
                    icon={<IAdd />}
                  >
                    Add
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </StyledFormListWrapper>
      </Form.Item>
    </Form>
  )
}

export default LabelsModalForm
