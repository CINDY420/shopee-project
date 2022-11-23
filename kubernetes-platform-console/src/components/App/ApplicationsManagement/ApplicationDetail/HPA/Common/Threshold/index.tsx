import React from 'react'
import { Form, FormInstance, FormItemProps, Row, Col, InputNumber } from 'infrad'
import InfoToolTip from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/InfoToolTip'
import { ThresholdWrapper } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/Threshold/style'
import { CSSProperties } from 'styled-components'
import { sduControllerGetSduAzs } from 'swagger-api/v1/apis/SDU'
import { IGetApplicationResponse } from 'swagger-api/v1/models'
import { useRecoilValue } from 'recoil'
import { selectedApplication } from 'states/applicationState/application'
import { HPA_RULE_DRAWER_TYPE } from 'constants/application'

const { Item } = Form

interface IThresholdProps extends FormItemProps {
  form: FormInstance
  fatherNamePath: string[]
  style?: CSSProperties
  crudType?: HPA_RULE_DRAWER_TYPE
}

const Threshold: React.FC<IThresholdProps> = ({ form, fatherNamePath, crudType, ...others }) => {
  const [defaultMinInstanceValue, setDefaultMinInstanceValue] = React.useState<number>()
  const application: IGetApplicationResponse = useRecoilValue(selectedApplication)
  const { name: appName, tenantId, projectName } = application

  const selectedDeployment = form.getFieldValue('deployment') && form.getFieldValue('deployment')[1]

  const getDefaultMinInstanceValue = React.useCallback(async () => {
    if (selectedDeployment !== undefined) {
      const { sdu } = await sduControllerGetSduAzs({ tenantId, projectName, appName, sduName: selectedDeployment })
      const { instancesCount } = sdu
      setDefaultMinInstanceValue(instancesCount)
    }
  }, [appName, projectName, selectedDeployment, tenantId])

  React.useEffect(() => {
    if (crudType === HPA_RULE_DRAWER_TYPE.CREATE) {
      getDefaultMinInstanceValue()
      form.setFieldsValue({
        threshold: {
          minReplicaCount: defaultMinInstanceValue
        }
      })
    }
  }, [crudType, defaultMinInstanceValue, form, getDefaultMinInstanceValue])

  return (
    <Item {...others}>
      <ThresholdWrapper>
        <Row>
          <Col span={12}>
            <InfoToolTip title='Max Instance' info='Threshold for scaling up.' placement='top' isRequired={true} /> :
          </Col>
          <Item
            name={[...fatherNamePath, 'maxReplicaCount']}
            validateFirst={true}
            rules={[
              { required: true, type: 'integer', min: 1, message: 'Must be positive integer.' },
              { required: true, type: 'integer', max: 200, message: 'Must be no more than 200.' }
            ]}
          >
            <InputNumber />
          </Item>
        </Row>
        <Row>
          <Col span={12}>
            <InfoToolTip title='Min Instance' info='Threshold for scaling down.' placement='top' isRequired={true} /> :
          </Col>
          <Item
            name={[...fatherNamePath, 'minReplicaCount']}
            validateFirst={true}
            rules={[
              { required: true, type: 'integer', min: 1, message: 'Must be positive integer.' },
              {
                required: true,
                type: 'integer',
                warningOnly: true,
                min: 2,
                message: (
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {'Make sure the min \n instances can be \n less than 2.'}
                  </div>
                )
              }
            ]}
          >
            <InputNumber />
          </Item>
        </Row>
      </ThresholdWrapper>
    </Item>
  )
}

export default Threshold
