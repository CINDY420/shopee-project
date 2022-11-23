import * as React from 'react'

import moment from 'moment-timezone'
import {
  Purpose,
  Link,
  StyledContentTag,
  TicketId,
  StyledPopOver,
  StyledQuestionCircleOutlined,
  StyledWarnSpan
} from 'components/App/RequestAndApproval/Common/TableColumns/style'
import TicketStage from 'components/App/RequestAndApproval/Common/TicketStage'
import { ITicket } from 'swagger-api/v1/models'
import { AUTH_TYPE, TERMINAL_TYPE } from 'constants/approval'
import { isElasticsearchTicket, isShopeeScaleDeploymentTicket } from 'helpers/ticket/determineTicketType'

const DEFAULT_PLACEHOLDER = '--'

const id = {
  title: 'Ticket ID',
  dataIndex: ['metaInfo', 'displayId'],
  key: 'ticketId',
  render: (ticketId: string) => {
    return <TicketId> {ticketId}</TicketId>
  }
}

const buildType = goToRequestDetailPage => ({
  title: 'Type',
  dataIndex: ['metaInfo', 'ticketType'],
  key: 'metaInfo.ticketType',
  filters: Object.entries(AUTH_TYPE).map(([value, key]) => ({ text: key, value })),
  filterMultiple: false,
  render: (type: string, item: any) => {
    return <Link onClick={() => goToRequestDetailPage(item)}>{AUTH_TYPE[type] || AUTH_TYPE.TERMINAL}</Link>
  }
})

const renderContentItem = (name: string, value: string | React.ReactNode) => (
  <div>
    <StyledContentTag>{name}: </StyledContentTag>
    {value ?? DEFAULT_PLACEHOLDER}
  </div>
)

const scaleDeploymentRequestContent = (record: ITicket) => {
  const { extraInfo } = record
  if (isShopeeScaleDeploymentTicket(extraInfo)) {
    const { variables } = extraInfo || {}
    const {
      deployment,
      clusterId,
      runtimeReleasePodCount,
      currentReleasePodCount,
      targetReleasePodCount,
      runtimeCanaryPodCount,
      currentCanaryPodCount,
      targetCanaryPodCount
    } = variables

    const getWarnPodCount = (count: number, comparedCount: number) => {
      return isNaN(count) ? (
        DEFAULT_PLACEHOLDER
      ) : (
        <StyledWarnSpan isMarked={count !== comparedCount}>{count}</StyledWarnSpan>
      )
    }

    return (
      <>
        {renderContentItem('Deployment', deployment)}
        {renderContentItem('Cluster', clusterId)}
        {renderContentItem(
          'Runtime Release Pod Count',
          getWarnPodCount(runtimeReleasePodCount, currentReleasePodCount)
        )}
        {renderContentItem('Current Release Pod Count', currentReleasePodCount)}
        {renderContentItem('Target Release Pod Count', targetReleasePodCount)}
        {!isNaN(runtimeCanaryPodCount) &&
          renderContentItem('Runtime Canary Pod Count', getWarnPodCount(runtimeCanaryPodCount, currentCanaryPodCount))}
        {!isNaN(currentCanaryPodCount) && renderContentItem('Current Canary Pod Count', currentCanaryPodCount)}
        {!isNaN(targetCanaryPodCount) && renderContentItem('Target Canary Pod Count', targetCanaryPodCount)}
      </>
    )
  } else {
    return null
  }
}

const contents = {
  title: (
    <>
      Contents
      <StyledPopOver content='Runtime Pod Count means that it is the accurate value at runtime. Current Pod Count means that it is the value when he applied.'>
        <StyledQuestionCircleOutlined />
      </StyledPopOver>
    </>
  ),
  dataIndex: ['extraInfo', 'tenantName'],
  key: 'tenantName',
  render: (tenantName: string, record: ITicket) => {
    const { extraInfo, metaInfo } = record
    const { ticketType } = metaInfo || {}
    const project = isElasticsearchTicket(extraInfo) ? extraInfo.project : DEFAULT_PLACEHOLDER
    const permissionGroupName = isElasticsearchTicket(extraInfo) ? extraInfo.permissionGroupName : DEFAULT_PLACEHOLDER

    if (!ticketType || ticketType === TERMINAL_TYPE) {
      return renderContentItem('Project', project)
    } else if (ticketType === AUTH_TYPE.DEPLOYMENT_SCALE) {
      return scaleDeploymentRequestContent(record)
    } else {
      return (
        <>
          {renderContentItem('Tenant', tenantName)}
          {renderContentItem('Permission Group', permissionGroupName)}
        </>
      )
    }
  }
}

const applicant = {
  title: 'Applicant',
  dataIndex: ['metaInfo', 'applicantName'],
  key: 'applicantName',
  render: applicantName => applicantName || DEFAULT_PLACEHOLDER
}

const createdAt = {
  title: 'Applied Time',
  dataIndex: ['metaInfo', 'createTime'],
  key: 'metaInfo.createTime',
  sorter: true,
  render: (createTime: string) => (createTime ? moment(createTime).format('YYYY-MM-DD HH:mm:ss') : DEFAULT_PLACEHOLDER)
}

const purpose = {
  title: 'Purpose',
  dataIndex: ['metaInfo', 'purpose'],
  key: 'purpose',
  render: (purpose: string) => <Purpose>{purpose || DEFAULT_PLACEHOLDER}</Purpose>
}

export const buildApprovalColumns = goToRequestDetailPage => [
  id,
  buildType(goToRequestDetailPage),
  contents,
  applicant,
  createdAt,
  purpose
]

export const buildRequestColumns = goToRequestDetailPage => [
  id,
  buildType(goToRequestDetailPage),
  contents,
  purpose,
  {
    title: 'Approver',
    dataIndex: ['metaInfo', 'approverList'],
    key: 'approverList',
    render: (approver: string[]) => approver?.[0] || DEFAULT_PLACEHOLDER
  },
  {
    title: 'Status',
    dataIndex: ['metaInfo', 'stage'],
    key: 'stage',
    render: (stage: string) => <TicketStage stage={stage} />
  }
]
