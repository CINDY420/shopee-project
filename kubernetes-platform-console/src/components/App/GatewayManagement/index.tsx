import * as React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import { Spin } from 'infrad'

import { GATEWAYS, GATEWAY_SERVICES, GATEWAY_LOAD_BALANCE, GATEWAY_INGRESS } from 'constants/routes/gateway/routes'

import { CenterWrapper } from 'common-styles/flexWrapper'
import { CommonStyledLayout, CommonStyledSider, CommonStyledContent } from 'common-styles/layout'

import Services from './Services'
import LoadBalance from './LoadBalance'
import Ingress from './Ingress'
import GatewayDirectoryTree from './GatewayDirectoryTree'

const { Suspense } = React

const GatewayManagement: React.FC = () => {
  return (
    <Suspense
      fallback={
        <CenterWrapper>
          <Spin />
        </CenterWrapper>
      }
    >
      <CommonStyledLayout>
        <CommonStyledSider width={240}>
          <GatewayDirectoryTree />
        </CommonStyledSider>
        <CommonStyledContent>
          <Switch>
            <Route path={GATEWAY_SERVICES} component={Services} />
            <Route path={GATEWAY_LOAD_BALANCE} component={LoadBalance} />
            <Route path={GATEWAY_INGRESS} component={Ingress} />
            <Redirect from='/' to={GATEWAYS} />
          </Switch>
        </CommonStyledContent>
      </CommonStyledLayout>
    </Suspense>
  )
}

export default GatewayManagement
