import * as React from 'react'
import { Alert } from 'infrad'

interface IScaleNoticeProps {
  isBromoDeployment: boolean
  enabledHpa: boolean
  enabledAutoScale: boolean
  style?: React.CSSProperties
}

const ScaleNotice: React.FC<IScaleNoticeProps> = ({
  isBromoDeployment,
  enabledHpa,
  enabledAutoScale,
  style,
}) => {
  const getNotice = () => {
    if (isBromoDeployment && enabledAutoScale) {
      return 'AutoScaler for this deployment is enabled now. You can not scale mannually.'
    }
    if (!isBromoDeployment && enabledHpa) {
      return 'HPA Rules for the deployment is enabled now. BE CAREFUL: manual scaling will be affect by HPA rules.'
    }
    return null
  }

  return getNotice() ? <Alert style={style} message={getNotice()} type="warning" showIcon /> : null
}

export default ScaleNotice
