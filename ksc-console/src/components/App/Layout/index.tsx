import * as React from 'react'
import { StyledLayout, StyledHeader, StyledContentLayout, StyledSider, PageWrapper } from './style'
import Header from 'components/App/Layout/Header'
import Sider from 'components/App/Layout/Sider'
import Content from 'components/App/Layout/Content'
import * as ramda from 'ramda'
import { removeSession, getSession, redirectToLoginPage } from 'helpers/session'
import { LOGIN, ACCESS_APPLY } from 'constants/routes/route'
import { sessionControllerRemoveSession } from 'swagger-api/apis/Session'
import { useGoogleLogout } from 'react-google-login'
import { cookiePolicy } from 'constants/server'
import { GOOGLE_CLIENT_ID } from 'constants/googleAuth'
import { matchPath } from 'react-router-dom'
import { globalAuthState } from 'states'
import { useRecoilValue } from 'recoil'

const App: React.FC = () => {
  const { roles } = useRecoilValue(globalAuthState)
  const loginedUser = getSession()

  if (ramda.isEmpty(loginedUser)) redirectToLoginPage()

  const handleLogoutSuccess = () => {
    removeSession()
    window.location.replace(LOGIN)
    sessionControllerRemoveSession()
  }

  const { signOut, loaded: isLoaded } = useGoogleLogout({
    clientId: GOOGLE_CLIENT_ID,
    cookiePolicy,
    onLogoutSuccess: handleLogoutSuccess,
  })
  const handleLogout = () => {
    if (isLoaded) signOut()
  }

  const accessApplyMatch = matchPath(ACCESS_APPLY, location.pathname)

  return (
    <StyledLayout>
      <StyledHeader>
        <Header onLogout={handleLogout} loginedUser={loginedUser} />
      </StyledHeader>
      <StyledContentLayout>
        {!accessApplyMatch && (
          <StyledSider>
            <Sider roles={roles} />
          </StyledSider>
        )}
        <PageWrapper>
          <Content />
        </PageWrapper>
      </StyledContentLayout>
    </StyledLayout>
  )
}

export default App
