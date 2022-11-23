import * as React from 'react'
import GoogleLogin from 'react-google-login'
import { message, Typography } from 'infrad'
import { GoogleOutlined } from 'infra-design-icons'
import * as R from 'ramda'

import { checkIsWechatBrowser } from 'helpers/useragent'
import { GOOGLE_CLIENT_ID } from 'constants/auth'
import { sessionsControllerCreate } from 'swagger-api/v3/apis/Sessions'
import { setSession, authorizedCb, getSession } from 'helpers/session'
import WechatGuidePage from './WechatGuidePage'
import { LoginWrapper, Logo, LoginButton } from './style'

import { cookiePolicy } from 'constants/server'

const googleLoginErrors: any = {
  popup_closed_by_user: 'The google login popup is closed.',
  access_denied: 'The permission to the scopes required has been denied.',
  immediate_failed: 'Unknown error.'
}
const { Title } = Typography

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = React.useState(false)
  const handleLoginSuccess = async (resp: any) => {
    const accessToken = resp.getAuthResponse(true).access_token
    setIsLogin(true)
    try {
      const session = await sessionsControllerCreate({ payload: { googleAccessToken: accessToken } })
      setSession(session)
      authorizedCb()
    } catch (error) {
      const { code, details = [] } = error

      if (code === 307 && details[0]) {
        window.location.replace(details[0])
      } else {
        error.message && code !== 401 && message.error(error.message)
      }
    } finally {
      setIsLogin(false)
    }
  }

  const handleLoginSuccessFailure = ({ error }: any) => {
    setIsLogin(false)
    message.error(googleLoginErrors[error])
  }

  if (!R.isEmpty(getSession())) {
    authorizedCb()
    return null
  }

  if (checkIsWechatBrowser()) {
    return <WechatGuidePage />
  }

  return (
    <LoginWrapper>
      <div>
        <Logo>
          <div />
          <Title level={1}>Kubernetes Platform</Title>
        </Logo>
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          isSignedIn={true}
          prompt='select_account'
          cookiePolicy={cookiePolicy}
          render={renderProps => (
            <LoginButton size='large' onClick={renderProps.onClick} disabled={renderProps.disabled} loading={isLogin}>
              <GoogleOutlined style={{ fontSize: '28px' }} />
              Sign in with Google
            </LoginButton>
          )}
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginSuccessFailure}
        />
      </div>
    </LoginWrapper>
  )
}

export default Login
