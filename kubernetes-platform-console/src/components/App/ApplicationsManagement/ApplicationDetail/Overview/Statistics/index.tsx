import * as React from 'react'
import PodStatistic from './PodStatistic'
import { IApplication } from 'api/types/application/application'

import { Root } from './style'

interface IStatisticsProps {
  application: IApplication
  onClick: () => void
}

const Statistics: React.FC<IStatisticsProps> = ({ application, onClick }) => {
  const { envs, envPods } = application

  const count = envs.length

  return (
    <Root count={count}>
      {envs.map(env => {
        const { normalPodCount, abnormalPodCount } = envPods[env]
        return (
          <PodStatistic
            key={env}
            environment={env}
            abnormalPodCount={abnormalPodCount}
            normalPodCount={normalPodCount}
            count={count}
            onClick={onClick}
          />
        )
      })}
    </Root>
  )
}

export default Statistics
