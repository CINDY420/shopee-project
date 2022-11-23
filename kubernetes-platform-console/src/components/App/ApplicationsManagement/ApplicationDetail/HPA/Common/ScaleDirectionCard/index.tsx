import React from 'react'
import {
  Header,
  ScaleBehaviorWrapper,
  StyledCol,
  NotifyFailedWrapper
} from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/ScaleDirectionCard/style'
import { IHpaSpecScale } from 'swagger-api/v1/models'

import { Row, Table } from 'infrad'
import { policyTextMap } from 'components/App/ApplicationsManagement/ApplicationDetail/HPA/Common/ScaleDirectionItem/Policies'

export enum SCALE_TYPE {
  SCALE_UP,
  SCALE_DOWN
}
interface IScaleInfo {
  title: string
  instanceTitle: string
  instanceTip: string
}

const typeScaleInfoMap: Record<SCALE_TYPE, IScaleInfo> = {
  [SCALE_TYPE.SCALE_UP]: {
    title: 'Scale Up',
    instanceTitle: 'Max Instance',
    instanceTip: 'Threshold for scaling up.'
  },
  [SCALE_TYPE.SCALE_DOWN]: {
    title: 'Scale Down',
    instanceTitle: 'Min Instance',
    instanceTip: 'Threshold for scaling down.'
  }
}

interface IScaleDirectionCardProps {
  type: SCALE_TYPE
  scaleUpValues?: IHpaSpecScale
  scaleDownValues?: IHpaSpecScale
}

export const ScaleDirectionCard: React.FC<IScaleDirectionCardProps> = ({ type, scaleUpValues, scaleDownValues }) => {
  const scaleInfo = typeScaleInfoMap[type]
  const { title } = scaleInfo || {}

  const scaleUpCardValues = {
    stabilizationWindowSeconds: scaleUpValues?.stabilizationWindowSeconds,
    policies: scaleUpValues?.policies,
    selectPolicy: scaleUpValues?.selectPolicy,
    notifyFailed: scaleUpValues?.notifyFailed
  }

  const scaleDownCardValues = {
    stabilizationWindowSeconds: scaleDownValues?.stabilizationWindowSeconds,
    policies: scaleDownValues?.policies,
    selectPolicy: scaleDownValues?.selectPolicy,
    notifyFailed: scaleDownValues?.notifyFailed
  }

  const { stabilizationWindowSeconds, policies, notifyFailed, selectPolicy } =
    type === SCALE_TYPE.SCALE_UP ? scaleUpCardValues || {} : scaleDownCardValues || {}

  const policyColumn = [
    {
      title: 'Type',
      dataIndex: 'type',
      width: 128
    },
    {
      title: 'Value',
      dataIndex: 'value',
      width: 110,
      render: (value: number, record) =>
        record.type === policyTextMap.PODS ? <span>{value}</span> : <span>{value}%</span>
    },
    {
      title: 'PeriodSeconds',
      dataIndex: 'periodSeconds',
      width: 110
    }
  ]

  return (
    <>
      <ScaleBehaviorWrapper>
        <Header>
          <span style={{ lineHeight: '36px', fontWeight: 500 }}>{title}</span>
        </Header>
        <Row>
          <StyledCol span={18}>stabilizationWindowSeconds:</StyledCol>
          <StyledCol span={6}>{stabilizationWindowSeconds}</StyledCol>
          {selectPolicy && (
            <>
              <StyledCol span={18}>SelectPolicy:</StyledCol>
              <StyledCol span={6}>{selectPolicy}</StyledCol>
            </>
          )}
          <Table
            columns={policyColumn}
            dataSource={policies}
            bordered
            pagination={false}
            style={{ margin: '0 16px' }}
            rowKey='type'
          />
          {notifyFailed && (
            <StyledCol span={24}>
              <NotifyFailedWrapper>Notify if failed</NotifyFailedWrapper>
            </StyledCol>
          )}
        </Row>
      </ScaleBehaviorWrapper>
    </>
  )
}
