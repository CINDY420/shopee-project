import * as React from 'react'
import { useRemoteRecoil } from 'hooks/useRecoil'
import { useParams } from 'react-router-dom'

import {
  TICKET_STAGE,
  APPROVAL_ACTION_TYPE,
  DETAIL_ICON_COLORS,
  DETAIL_ICONS,
  TICKET_STATUS
} from 'constants/requestAndApproval'
import { RESOURCE_TYPE, PERMISSION_SCOPE } from 'constants/accessControl'
import { initialState, reducer, getDispatchers } from 'components/App/RequestAndApproval/Detail/useRequestReducer'
import { ticketControllerGetTicket, ticketControllerCancelTicket } from 'swagger-api/v1/apis/Ticket'

import useAsyncFn from 'hooks/useAsyncFn'

import { selectedRequest } from 'states/requestAndApproval'
import { useRecoilValue } from 'recoil'
import accessControl from 'hocs/accessControl'

import { Root } from 'components/App/RequestAndApproval/style'
import Breadcrumbs from 'components/App/RequestAndApproval/Common/Breadcrumbs'
import DefaultDetail from 'components/App/RequestAndApproval/Detail/DefaultDetail'
import ScaleDeploymentDetail from 'components/App/RequestAndApproval/Detail/ScaleDeploymentDetail'
import Action from 'components/App/RequestAndApproval/List/Approvals/Action'

import { getSession, unauthorizedCb } from 'helpers/session'
import * as R from 'ramda'

import { Descriptions, Typography } from 'infrad'
import {
  Container,
  StyledStatus,
  DescriptionsContainer,
  CancelButton
} from 'components/App/RequestAndApproval/Detail/style'
import { AUTH_TYPE } from 'constants/approval'
import moment from 'moment-timezone'

const { Title } = Typography

const Detail: React.FC = () => {
  const request = useRecoilValue(selectedRequest)

  const { ticketType, status, stage, applicantName, applicantId, updateTime, approverList, assigneeList } =
    request?.metaInfo || {}
  const { auditResponse } = request?.extraInfo?.variables || {}

  const loginedUser = getSession()
  if (R.isEmpty(loginedUser)) {
    unauthorizedCb()
    return null
  }

  const { email, userId } = loginedUser
  const isApprover = assigneeList.includes(email)
  const isApplicant = userId === applicantId
  const isPending = status === TICKET_STATUS.OPEN

  const [cancelTicketState, cancelTicketFn] = useAsyncFn(ticketControllerCancelTicket)

  const [, getRequestFn] = useRemoteRecoil(ticketControllerGetTicket, selectedRequest)

  const [, dispatch] = React.useReducer(reducer, initialState)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [])
  const [inputAuditResponse, setInputAuditresponse] = React.useState(auditResponse)

  const { ticketId } = useParams<{ ticketId: string }>()

  React.useEffect(() => {
    if (request) {
      dispatchers.updateRequest(request)
    }
  }, [dispatchers, request])

  const DetailIcon = DETAIL_ICONS[stage] || 'div'

  const handleCancelTicket = () => {
    cancelTicketFn({
      ticketId
    })
      .then(() => {
        getRequestFn({ ticketId })
        dispatchers.onSuccess(APPROVAL_ACTION_TYPE.CANCEL)
      })
      .catch(e => {
        dispatchers.onError(e)
      })
  }

  const displayTicketOperateDetail = () => {
    const formatUpdateTime = updateTime && moment(updateTime).format('YYYY-MM-DD HH:mm:ss')
    const detail = {
      operatorLabel: 'Approver',
      operatorValue: approverList?.[0],
      operateTimeLabel: 'Approved Time',
      operateTimeValue: formatUpdateTime
    }

    if (stage === TICKET_STAGE.REJECTED) {
      detail.operateTimeLabel = 'Refused Time'
    } else if (stage === TICKET_STAGE.CANCELED) {
      detail.operatorLabel = 'Cancelled By'
      detail.operatorValue = applicantName
      detail.operateTimeLabel = 'Cancelled Time'
    }

    return (
      <>
        <Descriptions.Item label={detail.operatorLabel}>{detail.operatorValue}</Descriptions.Item>
        <Descriptions.Item label={detail.operateTimeLabel}>{detail.operateTimeValue}</Descriptions.Item>
      </>
    )
  }

  const displayTicketDetail = () => {
    const DETAIL_MAPPING = {
      [AUTH_TYPE.DEPLOYMENT_SCALE]: {
        render: ScaleDeploymentDetail,
        props: [
          {
            inputAuditResponse,
            onAuditResponseChange: setInputAuditresponse
          }
        ]
      }
    }

    const detail = DETAIL_MAPPING[ticketType]
    if (!detail) {
      return {
        render: DefaultDetail,
        props: []
      }
    }
    return detail
  }

  return (
    <Root>
      <Breadcrumbs />
      <Title level={4}>Request Detail</Title>
      <Container>
        <DetailIcon style={{ color: DETAIL_ICON_COLORS[stage], fontSize: '3.5em' }} />
        <StyledStatus>{stage}</StyledStatus>
        <DescriptionsContainer bordered column={2}>
          {displayTicketDetail().render(...displayTicketDetail().props)}
          {!isPending && displayTicketOperateDetail()}
        </DescriptionsContainer>
        {isPending && isApplicant && (
          <CancelButton
            key='cancel'
            type='primary'
            size='large'
            loading={cancelTicketState.loading}
            onClick={handleCancelTicket}
          >
            Cancel
          </CancelButton>
        )}
        {isApprover && isPending && (
          <div>
            <Action
              size='large'
              action={APPROVAL_ACTION_TYPE.REJECT}
              onSuccess={() => dispatchers.onSuccess(APPROVAL_ACTION_TYPE.REJECT)}
              ticket={request}
              canInputAuditResponse={false}
              inputAuditResponse={inputAuditResponse}
              onAuditResponseChange={setInputAuditresponse}
            />
            <Action
              size='large'
              action={APPROVAL_ACTION_TYPE.APPROVE}
              onSuccess={() => dispatchers.onSuccess(APPROVAL_ACTION_TYPE.APPROVE)}
              ticket={request}
              canInputAuditResponse={false}
              inputAuditResponse={inputAuditResponse}
              onAuditResponseChange={setInputAuditresponse}
            />
          </div>
        )}
      </Container>
    </Root>
  )
}

export default accessControl(Detail, PERMISSION_SCOPE.GLOBAL, [RESOURCE_TYPE.ACCESS_TICKET])
