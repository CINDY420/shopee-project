import React from 'react'

import { ExclamationCircleFilled } from 'infra-design-icons'
import { NoticeContainer, FreezeDetail, FreezeTitle, FreezeTime } from './style'

interface IReleaseFreezeNotice {
  startTime: string
  endTime: string
  reason: string
  env: string
}

const ReleaseFreezeNotice: React.FC<IReleaseFreezeNotice> = ({ startTime, endTime, reason, env }) => {
  return (
    <NoticeContainer>
      <FreezeTitle>
        <ExclamationCircleFilled />
        Release Freeze Now
      </FreezeTitle>
      <FreezeDetail>
        {'Freeze time: '}
        <FreezeTime>{`${startTime} - ${endTime}. `}</FreezeTime>
        {`Reason: ${reason || '-'}. Env: ${env || '-'}. Adhoc release please contact SRE.`}
      </FreezeDetail>
    </NoticeContainer>
  )
}

export default ReleaseFreezeNotice
