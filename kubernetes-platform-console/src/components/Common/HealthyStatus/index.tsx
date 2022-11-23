import * as React from 'react'
import { CheckCircleOutlined, ExclamationCircleOutlined, QuestionCircleOutlined } from 'infra-design-icons'

import { CLUSTER_STATUS as STATUS } from 'constants/cluster'
import { DangerWrapper, SuccessWrapper, UnknownWrapper } from 'common-styles/colorWrapper'

interface IHealthyStatusProps {
  /** There are three states: healthy, unhealthy, unknown */
  status: string
}

/**
 * HealthyStatus is used for status display
 */
const HealthyStatus: React.FC<IHealthyStatusProps> = props => {
  const { status } = props

  const statusComponents = {
    [STATUS.healthy]: () => (
      <SuccessWrapper>
        <CheckCircleOutlined />
        {` ${STATUS.healthy}`}
      </SuccessWrapper>
    ),
    [STATUS.unhealthy]: () => (
      <DangerWrapper>
        <ExclamationCircleOutlined />
        {` ${STATUS.unhealthy}`}
        {props.children}
      </DangerWrapper>
    ),
    [STATUS.unknown]: () => (
      <UnknownWrapper>
        <QuestionCircleOutlined />
        {` ${STATUS.unknown}`}
      </UnknownWrapper>
    )
  }

  return statusComponents[status]()
}

export default HealthyStatus
