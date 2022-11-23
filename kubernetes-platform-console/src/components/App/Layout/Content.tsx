import * as React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import { Spin } from 'infrad'

import {
  DEFAULT_ROUTE,
  PLATFORM,
  APPLICATIONS,
  OPERATION_LOGS,
  TICKET_CENTER,
  GATEWAYS,
  ACCESS_REQUEST
} from 'constants/routes/routes'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

import { CenterWrapper } from 'common-styles/flexWrapper'
import { AccessControlContext } from 'hooks/useAccessControl'

const { Suspense, lazy } = React

// const PlatformManagement = lazy(() => import('components/App/PlatformManagement'))
const ApplicationsManagement = lazy(() => import('components/App/ApplicationsManagement'))
const OperationLogs = lazy(() => import('components/App/OperationLogs'))
// const RequestAndApproval = lazy(() => import('components/App/RequestAndApproval'))
const GatewayManagement = lazy(() => import('components/App/GatewayManagement'))
const AccessRequest = lazy(() => import('components/App/AccessRequest'))
// const PipelinesManagement = lazy(() => import('components/App/PipelinesManagement'))

export default props => {
  const accessControlContext = React.useContext(AccessControlContext)
  const clusterActions = accessControlContext[RESOURCE_TYPE.CLUSTER] || []
  const canViewClusterTab = clusterActions.includes(RESOURCE_ACTION.View)

  return (
    <Suspense
      fallback={
        <CenterWrapper>
          <Spin />
        </CenterWrapper>
      }
    >
      <Switch>
        <Route path={APPLICATIONS} component={ApplicationsManagement} />
        <Route path={OPERATION_LOGS} component={OperationLogs} />
        <Route path={TICKET_CENTER} component={ApplicationsManagement} />
        <Route path={GATEWAYS} component={GatewayManagement} />
        <Route path={ACCESS_REQUEST} component={AccessRequest} />
        {/* <Route path={PIPELINES} component={PipelinesManagement} />
        <Route path={RELEASE_FREEZES} component={PipelinesManagement} /> */}
        {canViewClusterTab ? <Route path={PLATFORM} component={ApplicationsManagement} /> : null}
        <Redirect from='/' to={DEFAULT_ROUTE} />
      </Switch>
    </Suspense>
  )
}
