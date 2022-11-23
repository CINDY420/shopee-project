import * as React from 'react'
import { Typography, Radio } from 'infrad'
import { useQueryParam, StringParam } from 'use-query-params'

import history from 'helpers/history'
import { buildRequestColumns } from 'components/App/RequestAndApproval/Common/TableColumns'
import { Table } from 'common-styles/table'
import { Root } from 'components/App/RequestAndApproval/style'
import Breadcrumbs from 'components/App/RequestAndApproval/Common/Breadcrumbs'

import { ticketControllerListTickets } from 'swagger-api/v1/apis/Ticket'
import { IGetTicketsResponse, ITicket } from 'swagger-api/v1/models'

import useAntdTable from 'hooks/table/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { MY_REQUESTS_LIST, TICKET_DETAIL_KEY } from 'constants/routes/routes'

import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { REFRESH_RATE } from 'constants/time'
import { TICKET_STATUS, TICKET_PERSPECTIVE } from 'constants/requestAndApproval'

import {
  StyledActionBar,
  TicketStageFilterWrapper,
  StyledSpan
} from 'components/App/RequestAndApproval/List/Requests/style'

const { Title } = Typography

enum TABS {
  ALL = 'All',
  PENDING = 'Pending',
  FINISHED = 'Finished'
}

const TICKET_STATUS_MAPPING = {
  [TABS.ALL]: undefined,
  [TABS.PENDING]: TICKET_STATUS.OPEN,
  [TABS.FINISHED]: TICKET_STATUS.CLOSED
}

const goToRequestDetailPage = (ticket: ITicket) => {
  history.push(`${MY_REQUESTS_LIST}/${TICKET_DETAIL_KEY}/${ticket?.metaInfo?.ticketId}`)
}

const columns = buildRequestColumns(goToRequestDetailPage)

const Requests: React.FC = () => {
  const [selectedTab, setSelectedTab] = useQueryParam('selectedTab', StringParam)
  const [listType, setListType] = React.useState(selectedTab || TABS.ALL)

  const ticketTotalReducer = (state: { [key in TABS]: number }, action: { type: TABS; count: number }) => {
    const { type, count } = action

    switch (type) {
      case TABS.ALL:
        return { ...state, [TABS.ALL]: count }
      case TABS.PENDING:
        return { ...state, [TABS.PENDING]: count }
      case TABS.FINISHED:
        return { ...state, [TABS.FINISHED]: count }
      default:
        return state
    }
  }
  const [ticketTotalState, dispatchTicketTotal] = React.useReducer(ticketTotalReducer, {
    [TABS.ALL]: 0,
    [TABS.PENDING]: 0,
    [TABS.FINISHED]: 0
  })

  const handleRadioChange = React.useCallback(
    event => {
      const value = event.target.value
      setSelectedTab(value)
      setListType(value)
    },
    [setSelectedTab]
  )

  const fetchFn = React.useCallback(
    args => {
      return ticketControllerListTickets({
        ...args,
        perspective: TICKET_PERSPECTIVE.STARTER,
        ticketStatus: TICKET_STATUS_MAPPING[listType]
      })
    },
    [listType]
  )

  const getEachStageTIcketCount = React.useCallback(() => {
    Object.values(TABS).forEach(async tab => {
      const { total = 0 } = await ticketControllerListTickets({
        perspective: TICKET_PERSPECTIVE.STARTER,
        ticketStatus: TICKET_STATUS_MAPPING[tab]
      })
      dispatchTicketTotal({ type: tab, count: total })
    })
  }, [])

  React.useEffect(() => {
    getEachStageTIcketCount()
  }, [getEachStageTIcketCount])

  const [listPendingRequestsState, listPendingRequestsFn] = useAsyncIntervalFn<IGetTicketsResponse>(fetchFn, {
    enableIntervalCallback: false,
    refreshRate: REFRESH_RATE
  })

  const { pagination, handleTableChange, refresh } = useAntdTable({
    fetchFn: listPendingRequestsFn,
    orderDefault: 'metaInfo.createTime desc'
  })
  const { items: tickets, total } = listPendingRequestsState.value || {}

  React.useEffect(() => {
    refresh()
  }, [listType, refresh])

  return (
    <Root>
      <Breadcrumbs />
      <Title level={4}>My Requests</Title>
      <StyledActionBar>
        <TicketStageFilterWrapper>
          <Radio.Group value={listType} onChange={handleRadioChange}>
            {Object.entries(TABS).map(([key, value]) => (
              <Radio.Button key={key} value={value}>
                {value}
                <StyledSpan isChcked={listType === value}> {ticketTotalState[value]}</StyledSpan>
              </Radio.Button>
            ))}
          </Radio.Group>
        </TicketStageFilterWrapper>
      </StyledActionBar>
      <Table
        rowKey='id'
        loading={listPendingRequestsState.loading}
        columns={columns}
        dataSource={tickets}
        onChange={handleTableChange}
        pagination={{ ...TABLE_PAGINATION_OPTION, ...pagination, total }}
      />
    </Root>
  )
}

export default Requests
