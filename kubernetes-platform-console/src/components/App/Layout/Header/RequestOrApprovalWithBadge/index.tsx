import React from 'react'
import { useRecoilState } from 'recoil'
import { ticketControllerListTickets } from 'swagger-api/v1/apis/Ticket'
import { IGetTicketsResponse } from 'swagger-api/v1/models'
import { pendingApprovalCount } from 'states/requestAndApproval'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'

import { StyleBadge } from './style'

import { MessageIcon } from '../CustomIcon'
import { TICKET_PERSPECTIVE, TICKET_STATUS } from 'constants/requestAndApproval'

interface IProps {
  isApprover: boolean
}

const RequestOrApprovalWithBadge: React.FC<IProps> = ({ isApprover }) => {
  const [count, setCount] = useRecoilState(pendingApprovalCount)

  const [listPendingApprovalsState, listPendingApprovalsFn] = useAsyncIntervalFn<IGetTicketsResponse>(
    ticketControllerListTickets
  )

  React.useEffect(() => {
    if (listPendingApprovalsState.value) {
      setCount(listPendingApprovalsState.value?.total || 0)
    }
  }, [listPendingApprovalsState.value, setCount])

  React.useEffect(() => {
    if (isApprover) {
      listPendingApprovalsFn({
        perspective: TICKET_PERSPECTIVE.APPROVER,
        ticketStatus: TICKET_STATUS.OPEN,
        offset: 0
      })
    }
  }, [isApprover, listPendingApprovalsFn])

  return (
    <StyleBadge count={isApprover ? count : 0} overflowCount={99}>
      <MessageIcon style={{ color: 'rgba(255, 255, 255, 0.5)' }} />
    </StyleBadge>
  )
}

export default RequestOrApprovalWithBadge
