import React from 'react'

import Text from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/TableExpand/Text'
import { Col, Divider, Row, Space, Typography } from 'infrad'
import { IHPAWithId } from 'swagger-api/v1/models'
import AutoscalingRulesTable from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/AutoscalingRulesTable'
import CronRulesTable from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/CronRulesTable'
import {
  ScaleDirectionCard,
  SCALE_TYPE
} from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/ScaleDirectionCard'

const { Title, Text: TypographyText } = Typography

interface IProps {
  record: IHPAWithId
}

const Expand: React.FC<IProps> = ({ record }) => {
  const { meta, spec } = record
  const { sdu } = meta
  const { notifyChannels, rules, scaleDirection, autoscalingLogic, threshold } = spec
  const { autoscalingRules = [], cronRules = [] } = rules || {}
  const { scaleUp, scaleDown } = scaleDirection || {}

  return (
    <>
      <Row gutter={24}>
        <Col span={3}>
          <Title level={5}>Basic Information</Title>
        </Col>
        <Col span={21}>
          <Space direction='vertical' size={24}>
            <Text title='Deployment' value={sdu} />
            <Text title='Notify Channel' value={notifyChannels.join('; ')} />
          </Space>
        </Col>
      </Row>
      <Divider />
      <Row gutter={24}>
        <Col span={3}>
          <Title level={5}>Rules</Title>
        </Col>
        {autoscalingRules.length > 0 && (
          <Col span={7}>
            <Space direction='vertical' size={24}>
              <AutoscalingRulesTable autoscalingRules={autoscalingRules} autoscalingLogic={autoscalingLogic} />
            </Space>
          </Col>
        )}
        {cronRules.length > 0 && (
          <Col>
            <Space direction='vertical' size={24}>
              <CronRulesTable cronRules={cronRules} />
            </Space>
          </Col>
        )}
      </Row>
      <Divider />
      <Row gutter={24}>
        <Col span={3}>
          <Title level={5}>Threshold</Title>
        </Col>
        <Col>
          <Space direction='vertical' size={24}>
            <Text
              title={<TypographyText type='secondary'>Max Instance</TypographyText>}
              value={threshold.maxReplicaCount}
            />
            <Text
              title={<TypographyText type='secondary'>Min Instance</TypographyText>}
              value={threshold.minReplicaCount}
            />
          </Space>
        </Col>
      </Row>
      <Divider />
      <Row gutter={24}>
        <Col span={3}>
          <Title level={5}>Scale Direction</Title>
        </Col>
        {scaleUp?.selected && (
          <Col span={7}>
            <ScaleDirectionCard type={SCALE_TYPE.SCALE_UP} scaleUpValues={scaleUp} />
          </Col>
        )}
        {scaleDown?.selected && (
          <Col>
            <ScaleDirectionCard type={SCALE_TYPE.SCALE_DOWN} scaleDownValues={scaleDown} />
          </Col>
        )}
      </Row>
    </>
  )
}

export default Expand
