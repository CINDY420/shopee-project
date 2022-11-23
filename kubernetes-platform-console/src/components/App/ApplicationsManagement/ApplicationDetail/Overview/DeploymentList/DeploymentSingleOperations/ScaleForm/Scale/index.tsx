import * as React from 'react'

import { PHASE_CANARY, CANARY_PHASE } from 'constants/deployment'

import CanaryScale from './CanaryScale'
import ReleaseOrFTEScale from './ReleaseOrFTEScale'

interface IProps {
  phase: string
}

const Scale: React.FC<IProps> = ({ phase }) => {
  const isCanary = phase === PHASE_CANARY || phase === CANARY_PHASE
  return isCanary ? <CanaryScale /> : <ReleaseOrFTEScale phase={phase} />
}

export default Scale
