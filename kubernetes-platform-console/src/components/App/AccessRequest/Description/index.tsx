import React from 'react'

import { AUTH_STATUS } from 'constants/accessRequest'
import { StyledSpan } from '../style'
import { Tooltip } from 'infrad'

interface IDescription {
  status: AUTH_STATUS
  manager: string
  requestDetailLink: string
  hasRoles: boolean
}

const Description: React.FC<IDescription> = ({ status, manager, requestDetailLink, hasRoles }) => {
  const PendingText = (
    <div>
      Your new permission application is pending, please wait for approval!
      <br />
      Or you can remind <StyledSpan> {manager}</StyledSpan> to approve by sending him the{' '}
      <Tooltip title={requestDetailLink}>
        <StyledSpan>link</StyledSpan>
      </Tooltip>
      .
    </div>
  )

  const RejectText = (
    <div>
      Your latest new permission request has been rejected by <StyledSpan> {manager}</StyledSpan>, please request again!
    </div>
  )
  const CancelText = <div>Your latest new permission request has been cancelled, please request again!</div>

  const descriptionMap = {
    [AUTH_STATUS.NOTFOUND]: <div>Please access request for a new permission first!</div>,
    [AUTH_STATUS.PENDING]: PendingText,
    [AUTH_STATUS.REJECTED]: RejectText,
    [AUTH_STATUS.CANCELLED]: CancelText
  }

  if (!hasRoles && status === AUTH_STATUS.APPROVED) {
    return descriptionMap[AUTH_STATUS.NOTFOUND]
  }

  const StatusDescription = descriptionMap[status]

  return StatusDescription || <></>
}

export default Description
