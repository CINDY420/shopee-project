import React from 'react'
import { InputNumber, Checkbox, Row, Col, Form, FormInstance } from 'infrad'
import { FieldWrapper } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/style'
import InfoToolTip from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/InfoToolTip'
import Policies from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/ScaleDirectionItem/Policies'
import { IHpaSpecScale } from 'swagger-api/v1/models'

const { Item } = Form
interface IScaleDownItemsProps {
  fatherNamePath: string[]
  crudType: string
  form: FormInstance
  scaleDownRules: IHpaSpecScale
}

const ScaleDownItems: React.FC<IScaleDownItemsProps> = ({ fatherNamePath, form, scaleDownRules }) => {
  return (
    <FieldWrapper style={{ paddingBottom: 0 }}>
      <Row>
        <Col span={12}>
          <InfoToolTip
            title='stabilizationWindowSeconds'
            info='The stabilization window is used to restrict the flapping of replicas count when the metrics used for scaling keep fluctuating. The autoscaling algorithm uses this window to infer a previous desired state and avoid unwanted changes to workload scale.'
            placement='bottom'
          />{' '}
          :
        </Col>
        <Col span={12}>
          <Item
            name={[...fatherNamePath, 'stabilizationWindowSeconds']}
            rules={[{ required: true, type: 'number', min: 15, max: 300, message: 'Recommended range: 15 ~ 300.' }]}
          >
            <InputNumber />
          </Item>
        </Col>
        <Col span={24}>
          <Policies fatherNamePath={[...fatherNamePath]} form={form} policiesRules={scaleDownRules?.policies} />
        </Col>
        <Col span={24}>
          <Item name={[...fatherNamePath, 'notifyFailed']} valuePropName='checked'>
            <Checkbox disabled>Notify if failed</Checkbox>
          </Item>
        </Col>
      </Row>
    </FieldWrapper>
  )
}

export default ScaleDownItems
