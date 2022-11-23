import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import GoogleLogin, { GoogleLoginResponse } from 'react-google-login'
import { message, Typography } from 'infrad'
import { GoogleOutlined } from 'infra-design-icons'
import * as ramda from 'ramda'
import { sessionControllerCreateSession } from 'swagger-api/apis/Session'
import { accountControllerGetUserDetail } from 'swagger-api/apis/Account'
import { GOOGLE_CLIENT_ID } from 'constants/googleAuth'
import { loginSuccessRedirect, getSession, setSession } from 'helpers/session'
import { LoginWrapper, Logo, LoginButton } from './style'

import { cookiePolicy } from 'constants/server'

const googleLoginErrors: Record<string, string> = {
  /* eslint-disable @typescript-eslint/naming-convention -- for backend naming convention */
  popup_closed_by_user: 'The google login popup is closed.',
  access_denied: 'The permission to the scopes required has been denied.',
  immediate_failed: 'Unknown error.',
  /* eslint-enable @typescript-eslint/naming-convention */
}
const { Title } = Typography

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = React.useState(false)
  const handleLoginSuccess = async (resp: GoogleLoginResponse) => {
    const accessToken = resp.getAuthResponse(true).access_token
    try {
      const session = await sessionControllerCreateSession({
        payload: { googleAccessToken: accessToken },
      })
      const { permissions, roles } = await accountControllerGetUserDetail({
        userId: session.userId,
      })
      setSession({ permissions, roles, ...session })
      setIsLogin(true)
      loginSuccessRedirect()
    } catch (error) {
      const { code, details = [] } = error

      if (code === 307 && details[0]) navigate(details[0], { replace: true })
      else error.message && code !== 401 && message.error(error.message)
    } finally {
      setIsLogin(false)
    }
  }

  const handleLoginFailure = ({ error = 'immediate_failed' }) => {
    setIsLogin(false)
    message.error(googleLoginErrors[error] || 'login error')
  }

  if (!ramda.isEmpty(getSession())) {
    loginSuccessRedirect()
    return null
  }

  return (
    <LoginWrapper>
      <div>
        <Logo>
          <div />
          <Title level={1}>KSC Platform</Title>
        </Logo>
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          isSignedIn
          prompt="select_account"
          cookiePolicy={cookiePolicy}
          render={(renderProps) => (
            <LoginButton
              size="large"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              loading={isLogin}
            >
              <GoogleOutlined style={{ fontSize: '28px' }} />
              Sign in with Google
            </LoginButton>
          )}
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
        />
      </div>
    </LoginWrapper>
  )
}

export default Login
