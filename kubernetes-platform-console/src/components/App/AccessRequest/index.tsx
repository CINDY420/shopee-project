import React, { useEffect, useState } from 'react'

import { Button, message } from 'infrad'
import { addQuery, removeQuery } from 'helpers/editUrlQuery'
import { AUTH_STATUS } from 'constants/accessRequest'
import { RBAC_ACTION_KEY, PENDING_MY_ACTION_LIST, TICKET_DETAIL_KEY } from 'constants/routes/routes'
import { RBACActionType } from 'constants/rbacActions'

import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'

import { roleControllerGetLatestNewUserTicketStatus, roleControllerGetRbacUserInfo } from 'swagger-api/v3/apis/UserRole'

import { CopyToClipboard } from 'react-copy-to-clipboard'
import { getSession } from 'helpers/session'

import Description from './Description'

import { AccessRequestBackground, WelcomeWrapper, TitleWrapper, DescriptionWrapper, ButtonWrapper } from './style'
import history from 'helpers/history'

const buttonStyle = {
  padding: '0 62px'
}

const AccessRequest: React.FC = () => {
  const userSession = getSession()
  const { userId } = userSession
  const [initialRequestState, initialRequestFn] = useAsyncIntervalFn(roleControllerGetLatestNewUserTicketStatus, {
    enableIntervalCallback: true,
    refreshRate: 2000
  })

  const { value } = initialRequestState
  const { status, ticketId, users, approver } = value || {}
  const manager = users ? users.map(user => user.email).join(', ') : ''

  const [roles, setRoles] = useState([])
  const hasRoles = roles.length > 0

  useEffect(() => {
    const loginedUser = getSession()
    roleControllerGetRbacUserInfo({ userId: loginedUser.userId })
      .then(response => {
        const roles = response.roles
        setRoles(roles)
      })
      .catch(error => {
        console.error(error)
      })
  }, [status])

  const requestDetailLink = `${window.location.origin}${PENDING_MY_ACTION_LIST}/${TICKET_DETAIL_KEY}/${ticketId}`

  const showRequestDrawer = () => {
    addQuery(history, RBAC_ACTION_KEY, RBACActionType.INITIAL_ACCESS)
  }

  const hideRequestDrawer = () => {
    removeQuery(history, RBAC_ACTION_KEY)
  }

  const handleCopy = () => {
    message.success('Copy Successfully!')
  }

  useEffect(() => {
    initialRequestFn({ userId })
  }, [initialRequestFn, userId])

  useEffect(() => {
    if (hasRoles) {
      history.replace('/')
      window.location.reload()
    } else {
      if (status === AUTH_STATUS.NOTFOUND) {
        showRequestDrawer()
      } else {
        hideRequestDrawer()
      }
    }
  }, [status, hasRoles])

  const FirstRequestButton = (
    <Button type='primary' style={buttonStyle} onClick={showRequestDrawer}>
      Access Request
    </Button>
  )
  const PendingRequestButton = (
    <>
      <CopyToClipboard onCopy={handleCopy} text={requestDetailLink}>
        <Button type='primary'>Copy Link</Button>
      </CopyToClipboard>
    </>
  )

  return (
    <AccessRequestBackground>
      <WelcomeWrapper>
        <TitleWrapper>Welcome To Kubernetes Platform</TitleWrapper>
        <DescriptionWrapper style={{ display: 'flex' }}>
          <Description
            hasRoles={hasRoles}
            status={status}
            manager={manager || approver}
            requestDetailLink={requestDetailLink}
          />
        </DescriptionWrapper>
        <ButtonWrapper style={{ display: hasRoles ? 'none' : 'flex' }}>
          {status === AUTH_STATUS.PENDING ? PendingRequestButton : FirstRequestButton}
        </ButtonWrapper>
      </WelcomeWrapper>
    </AccessRequestBackground>
  )
}

export default AccessRequest
