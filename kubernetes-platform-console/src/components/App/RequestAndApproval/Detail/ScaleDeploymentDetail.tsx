import * as React from 'react'

import { useRecoilValue } from 'recoil'
import { selectedRequest } from 'states/requestAndApproval'
import { TICKET_STATUS } from 'constants/requestAndApproval'

import { Descriptions, Typography } from 'infrad'
import {
  StyledPopOver,
  StyledQuestionCircleOutlined
} from 'components/App/RequestAndApproval/Common/TableColumns/style'
import moment from 'moment'

const { Paragraph, Text } = Typography

enum POD_PHASE_TYPE {
  RUNTIME = 'Runtime',
  CURRENT = 'Current',
  TARGET = 'Target'
}

const NOTICE_MAPPING = {
  [POD_PHASE_TYPE.RUNTIME]: 'Runtime Pod Count means that it is the accurate value at runtime.',
  [POD_PHASE_TYPE.CURRENT]: 'Current Pod Count means that it is the value when he applied.'
}

interface ScaleDeploymentDetailProps {
  inputAuditResponse: string
  onAuditResponseChange: (auditResponse: string) => void
}

const ScaleDeploymentDetail: React.FC<ScaleDeploymentDetailProps> = ({ inputAuditResponse, onAuditResponseChange }) => {
  const request = useRecoilValue(selectedRequest)
  const { status, applicantName, createTime, ticketType, purpose, assigneeList } = request?.metaInfo || {}
  const {
    deployment,
    clusterId,
    auditResponse,
    currentReleasePodCount,
    targetReleasePodCount,
    runtimeReleasePodCount,
    currentCanaryPodCount,
    targetCanaryPodCount,
    runtimeCanaryPodCount
  } = request?.extraInfo?.variables || {}

  const podCountNotice = (podPhaseType: POD_PHASE_TYPE) => {
    if (NOTICE_MAPPING[podPhaseType]) {
      return (
        <>
          <StyledPopOver content={NOTICE_MAPPING[podPhaseType]}>
            <StyledQuestionCircleOutlined />
          </StyledPopOver>
        </>
      )
    }
  }

  const displayPodCount = (releasePodCount: number, canaryPodCount: number, type: POD_PHASE_TYPE) => {
    if (isNaN(canaryPodCount)) {
      return (
        <Descriptions.Item label={`${type} Release Pod Count`} span={2}>
          {releasePodCount}
        </Descriptions.Item>
      )
    } else {
      const isRuntime = type === POD_PHASE_TYPE.RUNTIME
      const releasePodCountColor = isRuntime && releasePodCount !== currentReleasePodCount ? '#ff4a0f' : 'unset'
      const canaryPodCountColor = isRuntime && canaryPodCount !== currentCanaryPodCount ? '#ff4a0f' : 'unset'
      return (
        <>
          <Descriptions.Item
            contentStyle={{ color: releasePodCountColor }}
            label={
              <>
                {type} Release Pod Count{podCountNotice(type)}
              </>
            }
          >
            {releasePodCount}
          </Descriptions.Item>
          <Descriptions.Item
            contentStyle={{ color: canaryPodCountColor }}
            label={
              <>
                {type} Canary Pod Count{podCountNotice(type)}
              </>
            }
          >
            {canaryPodCount}
          </Descriptions.Item>
        </>
      )
    }
  }

  const displayAuditResponse = () => {
    if (status === TICKET_STATUS.CLOSED) {
      return auditResponse
    } else {
      return (
        <Paragraph editable={{ onChange: onAuditResponseChange }} style={{ marginBottom: 0 }}>
          {inputAuditResponse || <Text type='secondary'>Input audit response there</Text>}
        </Paragraph>
      )
    }
  }

  return (
    <>
      <Descriptions.Item label='Applicant'>{applicantName}</Descriptions.Item>
      <Descriptions.Item label='Applied Time'>
        {createTime && moment(createTime).format('YYYY-MM-DD HH:mm:ss')}
      </Descriptions.Item>
      <Descriptions.Item label='Deployment'>{deployment}</Descriptions.Item>
      <Descriptions.Item label='Cluster'>{clusterId}</Descriptions.Item>
      <Descriptions.Item label='Type' span={2}>
        {ticketType}
      </Descriptions.Item>
      {status === TICKET_STATUS.OPEN && (
        <Descriptions.Item label='Approver List' span={2}>
          {assigneeList.join(', ')}
        </Descriptions.Item>
      )}
      {displayPodCount(runtimeReleasePodCount, runtimeCanaryPodCount, POD_PHASE_TYPE.RUNTIME)}
      {displayPodCount(currentReleasePodCount, currentCanaryPodCount, POD_PHASE_TYPE.CURRENT)}
      {displayPodCount(targetReleasePodCount, targetCanaryPodCount, POD_PHASE_TYPE.TARGET)}
      <Descriptions.Item label='Purpose' span={2}>
        {purpose}
      </Descriptions.Item>
      <Descriptions.Item label='Audit Response' span={2}>
        {displayAuditResponse()}
      </Descriptions.Item>
    </>
  )
}

export default ScaleDeploymentDetail
