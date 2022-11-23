import * as React from 'react'
import { Location } from 'history'
import accessControl from 'hocs/accessControl'
import { PERMISSION_SCOPE, RESOURCE_TYPE } from 'constants/accessControl'
import { Layout as AntdLayout } from 'infrad'
import styled from 'styled-components'
import * as R from 'ramda'

import { LOGIN, RBAC_ACTION_KEY, POD_FLAME_GRAPH } from 'constants/routes/routes'
import { getSession, unauthorizedCb, removeSession } from 'helpers/session'
import { sessionsControllerRemove } from 'swagger-api/v3/apis/Sessions'
import history from 'helpers/history'
import Content from 'components/App/Layout/Content'
import Header from 'components/App/Layout/Header/index'
import RBACActionDrawer from 'components/App/Layout/RBACActionDrawer'
import Feedback from 'components/App/Layout/Feedback'

import { RBACActionType } from 'constants/rbacActions'

import FeatureModal from 'components/App/Layout/FeatureModal'

import { useQueryParam, StringParam } from 'use-query-params'

import { GlobalContext, initialState, reducer } from 'hocs/useGlobalContext'
import { GOOGLE_CLIENT_ID } from 'constants/auth'
import { HEADER_HEIGHT } from 'constants/layout'
import { useGoogleLogout } from 'react-google-login'

import { useRouteMatch } from 'react-router-dom'

import { cookiePolicy } from 'constants/server'
import Announcements from 'components/App/Layout/Announcements'

const { Header: AntdHeader, Content: AntdContent } = AntdLayout
const AccessControlHeader = accessControl(Header, PERMISSION_SCOPE.GLOBAL, [
  RESOURCE_TYPE.CLUSTER,
  RESOURCE_TYPE.OPERATION_LOG,
  RESOURCE_TYPE.ACCESS_TICKET
])
const AccessControlContent = accessControl(Content, PERMISSION_SCOPE.GLOBAL, [RESOURCE_TYPE.CLUSTER])

const StyledLayout = styled(AntdLayout)`
  min-height: 100vh !important;
  min-width: 1336px;
  height: 100%;
  background-color: #eee;
  display: flex;
  flex-direction: column;

  /* .ant-layout-content {
    overflow-x: visible !important;
  } */
`

const StyledContentLayout = styled(AntdLayout)`
  height: calc(100vh - 56px);
  position: relative;
  overflow: hidden;
`

const StyledHeader = styled(AntdHeader)`
  width: 100%;
  height: ${HEADER_HEIGHT + 'px'};
  line-height: ${HEADER_HEIGHT + 'px'};
  padding: 0;
`

const PageWrapper = styled(AntdContent)`
  width: 100%;
  min-width: 800px;
  height: 100%;
  /* padding: 0 32px 64px; */
  overflow: hidden;
`

export interface IAppProps {
  location: Location
}

const App: React.FC<IAppProps> = (props: IAppProps) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const loginedUser = getSession()

  if (R.isEmpty(loginedUser)) {
    unauthorizedCb()
    return null
  }

  const logoutHandler = () => {
    removeSession()
    history.replace(LOGIN)
    sessionsControllerRemove()
  }

  const { signOut, loaded } = useGoogleLogout({
    clientId: GOOGLE_CLIENT_ID,
    cookiePolicy: cookiePolicy,
    onLogoutSuccess: logoutHandler
  })
  const handleLogout = () => {
    if (loaded) {
      signOut()
    }
  }

  const [actionType, setActionType] = useQueryParam(RBAC_ACTION_KEY, StringParam)

  const handleChangeRole = () => {
    const changeRoleType = RBACActionType.CHANGE_ROLE
    if (actionType !== changeRoleType) {
      setActionType(changeRoleType)
    }
  }

  const flameGraphRouteMatch = useRouteMatch(POD_FLAME_GRAPH)

  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      <StyledLayout>
        <Announcements />
        {!flameGraphRouteMatch && (
          <StyledHeader>
            <AccessControlHeader
              location={location}
              loginedUser={loginedUser}
              onLogout={handleLogout}
              onChangeRole={handleChangeRole}
            />
          </StyledHeader>
        )}
        <StyledContentLayout>
          <PageWrapper>
            <AccessControlContent />
          </PageWrapper>
          {/* <VersionController /> */}
          <RBACActionDrawer />
          {!flameGraphRouteMatch && <Feedback />}
        </StyledContentLayout>
        <FeatureModal />
      </StyledLayout>
    </GlobalContext.Provider>
  )
}

export default App
