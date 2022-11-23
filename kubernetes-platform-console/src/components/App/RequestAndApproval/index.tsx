import * as React from 'react'
import { useSetRecoilState, useRecoilValue } from 'recoil'
import { Switch, Redirect, Route } from 'react-router-dom'
import routeResourceDetectorHOC from 'react-resource-detector'

import { ticketControllerGetTicket } from 'swagger-api/v1/apis/Ticket'

import { useRemoteRecoil } from 'hooks/useRecoil'
import {
  selectedRequest,
  ticketCenterSelectedTreeNodes,
  ticketCenterSelectedExpandedNodes
} from 'states/requestAndApproval'
import { selectedTenant } from 'states/applicationState/tenant'

import { getMatchResourceHandler } from 'helpers/routes'
import {
  TICKET_CENTER,
  TICKET_CENTER_KEY,
  TICKET_DETAIL,
  TICKET_LIST,
  TICKET_LIST_KEY,
  PENDING_MY_ACTION_LIST,
  MY_REQUESTS_LIST
} from 'constants/routes/routes'

import { TICKET_ID, TICKET_LIST_TYPE } from 'constants/routes/identifier'
import { TICKET, APPROVAL_AND_REQUEST, buildName } from 'constants/routes/name'

import AsyncRoute, { IAsyncRouteProps } from 'components/Common/AsyncRoute'
import Breadcrumbs from 'components/App/RequestAndApproval/Common/Breadcrumbs'
import { CommonStyledLayout, CommonStyledContent, CommonStyledSider } from 'common-styles/layout'

import Approvals from 'components/App/RequestAndApproval/List/Approvals'
import UserRequests from 'components/App/RequestAndApproval/List/Requests'
import Detail from 'components/App/RequestAndApproval/Detail'
import RequestAndApprovalDirectoryTree from 'components/App/RequestAndApproval/Tree'

import { Root } from 'components/App/RequestAndApproval/style'
import { isElasticsearchTicket } from 'helpers/ticket/determineTicketType'

interface IMatches {
  [key: string]: any
}

// 默认值为terminal access
// let AccessControlDetail = accessControl(Detail, PERMISSION_SCOPE.GLOBAL, [RESOURCE_TYPE], true)

const Requests: React.FC & {
  resourceConfigurations?: object
  routeConfigurations?: object
} = () => {
  const [selectedRequestState, selectedRequestFn] = useRemoteRecoil(ticketControllerGetTicket, selectedRequest)
  const setSelectedGroup = useSetRecoilState(selectedTenant)
  const groupState = useRecoilValue(selectedTenant) || {}

  const setSelectedTreeNodes = useSetRecoilState(ticketCenterSelectedTreeNodes)
  const setSelectedExpandedNodes = useSetRecoilState(ticketCenterSelectedExpandedNodes)

  // 保存当前要approve的group
  if (selectedRequestState.value) {
    const extraInfo = selectedRequestState.value?.extraInfo
    const tenantName = isElasticsearchTicket(extraInfo) ? extraInfo.tenantName : ''
    if (groupState.name !== tenantName) {
      setSelectedGroup({ name: tenantName })
    }
    // if (type && RESOURCE_TYPE[type]) {
    //  AccessControlDetail = accessControl(Detail, RESOURCE_TYPE[type], true)
    // }
  }

  Requests.resourceConfigurations = {
    [APPROVAL_AND_REQUEST]: getMatchResourceHandler((data: IMatches) => {
      const ticketListType = data[TICKET_LIST_TYPE]
      const treeNode = `${buildName(TICKET_LIST_KEY, {
        [TICKET_LIST_TYPE]: ticketListType
      })}`
      setSelectedTreeNodes([treeNode])
      setSelectedExpandedNodes([TICKET_CENTER_KEY, treeNode])
    }),
    [TICKET]: getMatchResourceHandler((data: IMatches) => {
      const accessId = data[TICKET_ID]
      selectedRequestFn({ ticketId: accessId })
    })
  }

  const asyncRoutes: Array<IAsyncRouteProps> = [
    {
      path: TICKET_DETAIL,
      // LazyComponent: AccessControlDetail,
      LazyComponent: Detail,
      asyncState: selectedRequestState
    }
  ]

  return (
    <CommonStyledLayout>
      <CommonStyledSider width={240}>
        <RequestAndApprovalDirectoryTree />
      </CommonStyledSider>
      <CommonStyledContent>
        <Root>
          <Breadcrumbs />
          <Switch>
            <Route exact path={PENDING_MY_ACTION_LIST} component={Approvals} />
            <Route exact path={MY_REQUESTS_LIST} component={UserRequests} />
            {asyncRoutes.map(props => (
              <AsyncRoute exact key={props.path as string} {...props} />
            ))}
            <Redirect from={`${TICKET_CENTER}/*`} to={PENDING_MY_ACTION_LIST} />
          </Switch>
        </Root>
      </CommonStyledContent>
    </CommonStyledLayout>
  )
}

Requests.routeConfigurations = {
  [TICKET_DETAIL]: {
    whiteList: [APPROVAL_AND_REQUEST, TICKET]
  },
  [TICKET_LIST]: {
    whiteList: [APPROVAL_AND_REQUEST]
  }
}

export default routeResourceDetectorHOC(Requests, { shouldDetectResourceForAllRoutes: false })
