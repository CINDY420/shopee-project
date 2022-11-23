import * as React from 'react'
import { useSetRecoilState } from 'recoil'

import history from 'helpers/history'
import { PENDING_MY_ACTION_LIST, TICKET_DETAIL_KEY } from 'constants/routes/routes'
import { ticketControllerListTickets } from 'swagger-api/v1/apis/Ticket'
import { IGetTicketsResponse, ITicket } from 'swagger-api/v1/models'
import { APPROVAL_ACTION_TYPE, TICKET_PERSPECTIVE, TICKET_STATUS } from 'constants/requestAndApproval'
import { pendingApprovalCount } from 'states/requestAndApproval'
import useAntdTable from 'hooks/table/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { buildApprovalColumns } from 'components/App/RequestAndApproval/Common/TableColumns'

import Action from 'components/App/RequestAndApproval/List/Approvals/Action'
import { Table } from 'common-styles/table'
import { StyledDiv } from 'components/App/RequestAndApproval/List/Approvals/style'

import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { REFRESH_RATE } from 'constants/time'

const goToRequestDetailPage = (ticket: ITicket) => {
  history.push(`${PENDING_MY_ACTION_LIST}/${TICKET_DETAIL_KEY}/${ticket?.metaInfo?.ticketId}`)
}

const OpenRequestList: React.FC = () => {
  const setRecoilValue = useSetRecoilState(pendingApprovalCount)

  const fetchFn = React.useCallback(args => {
    return ticketControllerListTickets({
      ...args,
      perspective: TICKET_PERSPECTIVE.APPROVER,
      ticketStatus: TICKET_STATUS.OPEN
    })
  }, [])

  const [listPendingApprovalsState, listPendingApprovalsFn] = useAsyncIntervalFn<IGetTicketsResponse>(fetchFn, {
    enableIntervalCallback: true,
    refreshRate: REFRESH_RATE
  })

  const { pagination, handleTableChange, refresh } = useAntdTable({
    fetchFn: listPendingApprovalsFn,
    orderDefault: 'metaInfo.createTime desc'
  })
  const { items: tickets, total } = listPendingApprovalsState.value || {}

  React.useEffect(() => {
    if (listPendingApprovalsState.value) {
      setRecoilValue(listPendingApprovalsState.value?.total)
    }
  }, [listPendingApprovalsState.value, setRecoilValue])

  const columns = React.useMemo(
    () => [
      ...buildApprovalColumns(goToRequestDetailPage),
      {
        title: 'Actions',
        dataIndex: 'action',
        key: 'action',
        render: (_, ticket: ITicket) => {
          return (
            <StyledDiv>
              <Action
                action={APPROVAL_ACTION_TYPE.REJECT}
                onSuccess={() => refresh(true, pagination)}
                ticket={ticket}
              />
              <Action
                action={APPROVAL_ACTION_TYPE.APPROVE}
                onSuccess={() => refresh(true, pagination)}
                ticket={ticket}
              />
            </StyledDiv>
          )
        }
      }
    ],
    [pagination, refresh]
  )
  return (
    <Table
      rowKey='id'
      loading={listPendingApprovalsState.loading}
      columns={columns}
      dataSource={tickets}
      onChange={handleTableChange}
      pagination={{
        ...TABLE_PAGINATION_OPTION,
        ...pagination,
        total
      }}
    />
  )
}

export default OpenRequestList
