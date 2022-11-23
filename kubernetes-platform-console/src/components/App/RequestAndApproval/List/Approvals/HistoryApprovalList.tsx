import * as React from 'react'

import history from 'helpers/history'
import { PENDING_MY_ACTION_LIST, TICKET_DETAIL_KEY } from 'constants/routes/routes'

import { ticketControllerListTickets } from 'swagger-api/v1/apis/Ticket'
import { IGetTicketsResponse, ITicket } from 'swagger-api/v1/models'

import useAntdTable from 'hooks/table/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'

import TicketStage from 'components/App/RequestAndApproval/Common/TicketStage'
import { buildApprovalColumns } from 'components/App/RequestAndApproval/Common/TableColumns'
import { Table } from 'common-styles/table'

import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { REFRESH_RATE } from 'constants/time'
import { TICKET_STATUS, TICKET_PERSPECTIVE } from 'constants/requestAndApproval'

const goToRequestDetailPage = (ticket: ITicket) => {
  history.push(`${PENDING_MY_ACTION_LIST}/${TICKET_DETAIL_KEY}/${ticket?.metaInfo?.ticketId}`)
}

const columns = [
  ...buildApprovalColumns(goToRequestDetailPage),
  {
    title: 'Status',
    dataIndex: ['metaInfo', 'stage'],
    key: 'status',
    render: (stage: string) => <TicketStage stage={stage} />
  }
]

const HistoryApprovalList: React.FC = () => {
  const fetchFn = React.useCallback(args => {
    return ticketControllerListTickets({
      ...args,
      perspective: TICKET_PERSPECTIVE.APPROVER,
      ticketStatus: TICKET_STATUS.CLOSED
    })
  }, [])

  const [listHistoryApprovalsState, listHistoryApprovalsFn] = useAsyncIntervalFn<IGetTicketsResponse>(fetchFn, {
    enableIntervalCallback: false,
    refreshRate: REFRESH_RATE
  })

  const { pagination, handleTableChange } = useAntdTable({
    fetchFn: listHistoryApprovalsFn,
    orderDefault: 'metaInfo.createTime desc'
  })
  const { items: tickets, total } = listHistoryApprovalsState.value || {}

  return (
    <Table
      rowKey='id'
      loading={listHistoryApprovalsState.loading}
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

export default HistoryApprovalList
