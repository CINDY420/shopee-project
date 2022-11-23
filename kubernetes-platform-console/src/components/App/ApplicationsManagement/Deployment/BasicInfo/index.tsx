import * as React from 'react'

import { deploymentsControllerGetDeploymentBasicInfo } from 'swagger-api/v3/apis/Deployments'
import { IDeployClusterInfoList } from 'api/types/application/deploy'

import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { STRATEGY_TYPE } from 'constants/deployment'

import Item from './Item'
import PhaseCard from './PhaseCard'
import StrategyCard from './StrategyCard'

import { Card } from 'common-styles/cardWrapper'
import { Title, CardWrap, Root, PodWrap, Pod } from './style'

interface IProps {
  deployment: IDeployClusterInfoList
  clusterName: string
  clusterId: string
  isCanary: boolean
}

const BasicInfo: React.FC<IProps> = ({ deployment, clusterName, clusterId, isCanary }) => {
  const getDeployBasicInfo = React.useCallback(
    args => {
      const { tenantId, projectName, appName, name: deployName } = deployment

      return deploymentsControllerGetDeploymentBasicInfo({
        tenantId,
        projectName,
        appName,
        deployName,
        clusterName,
        clusterId,
        isCanary
      })
    },
    [deployment, clusterName, clusterId, isCanary]
  )

  const [getDeployBasicInfoState, getDeployBasicInfoFn] = useAsyncIntervalFn<any>(getDeployBasicInfo, {})

  React.useEffect(() => {
    getDeployBasicInfoFn()
  }, [getDeployBasicInfoFn])

  const { name, pods = {}, phase = {}, strategy, rollingUpdateStrategy } = getDeployBasicInfoState.value || {}

  const { RELEASE: release = 0, CANARY: canary = 0 } = pods
  const phaseKeys = Object.keys(phase)

  return (
    <Card>
      <Root>
        <Item label='Deployment Name'>
          <Title>{name}</Title>
        </Item>
        <Item label='Desired Pods'>
          <PodWrap>
            {isCanary ? (
              <>
                <Pod>
                  <span>RELEASE: </span>
                  {release}
                </Pod>
                <Pod>
                  <span>CANARY: </span>
                  {canary}
                </Pod>
                <Pod>
                  <span>Total: </span>
                  {release + canary}
                </Pod>
              </>
            ) : (
              Object.entries(pods).map(([phaseName, count = 0]: any) => {
                return (
                  <Pod key={phaseName}>
                    <span>{`${phaseName}: `}</span>
                    {count}
                  </Pod>
                )
              })
            )}
          </PodWrap>
        </Item>
        <Item label='StrategyType'>
          <CardWrap>
            <Title>{strategy}</Title>
            {strategy && strategy.strategy !== STRATEGY_TYPE.ReCreate && (
              <StrategyCard strategy={rollingUpdateStrategy} />
            )}
          </CardWrap>
        </Item>
        <Item label='Phase'>
          {isCanary ? (
            <>
              <CardWrap>
                <Title>RELEASE</Title>
                {(phase.RELEASE || []).map((phase, index) => (
                  <PhaseCard phase={phase} key={phase.name} index={index} />
                ))}
              </CardWrap>
              <CardWrap>
                <Title>CANARY</Title>
                {(phase.CANARY || []).map((phase, index) => (
                  <PhaseCard phase={phase} key={phase.name} index={index} />
                ))}
              </CardWrap>
            </>
          ) : (
            phaseKeys.map(keyName => {
              const phaseList = phase[keyName] || []

              return (
                <CardWrap key={keyName}>
                  <Title>{keyName}</Title>
                  {phaseList.map((phase, index) => (
                    <PhaseCard phase={phase} key={phase.name} index={index} />
                  ))}
                </CardWrap>
              )
            })
          )}
        </Item>
      </Root>
    </Card>
  )
}

export default BasicInfo
