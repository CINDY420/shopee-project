import React, { useEffect, useCallback } from 'react'
import { ErrorTip } from 'common-styles/tipWrapper'
import { selectedDeployment } from 'states/applicationState/deployment'
import { useRecoilValue } from 'recoil'
import { deploymentsControllerGetDeploymentEvents } from 'swagger-api/v3/apis/Deployments'
import { IIDeploymentLatestEvents } from 'swagger-api/v3/models'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { EDIT_REFRESH_RATE } from 'constants/time'
import history from 'helpers/history'
import { buildApplicationName } from 'constants/routes/name'
import { APPLICATIONS } from 'constants/routes/routes'
import { EVENT_QUERY_KEYS, searchAllMap, DEPLOYMENT_EVENT_TYPE } from 'constants/deployment'

import { Button } from 'infrad'

interface IEventAlert {
  isRunningUnHealth: boolean
}

const EventAlert: React.FC<IEventAlert> = ({ isRunningUnHealth }) => {
  const [latestAbnormalEvents, setLatestAbnormalEvents] = React.useState<IIDeploymentLatestEvents>()
  const deployment = useRecoilValue(selectedDeployment)

  const { events = [] } = latestAbnormalEvents || {}

  const { tenantId, projectName, appName, name: deployName, clusterId, info } = deployment || {}

  const { phase = '' } = info || {}

  const getLatestAbnormalEventFn = useCallback(async () => {
    const response = await deploymentsControllerGetDeploymentEvents({
      tenantId,
      projectName,
      appName,
      deployName,
      clusterId,
      phase,
      types: isRunningUnHealth
        ? `${DEPLOYMENT_EVENT_TYPE.PROBE_FAILED};${DEPLOYMENT_EVENT_TYPE.FAILED_SCHEDULING}`
        : DEPLOYMENT_EVENT_TYPE.FAILED_SCHEDULING
    })
    setLatestAbnormalEvents(response)
  }, [appName, clusterId, deployName, phase, projectName, tenantId, isRunningUnHealth])

  const onRefresh = async () => {
    return await getLatestAbnormalEventFn()
  }

  const [, callBack, setStartIntervalCallback] = useAsyncIntervalFn(onRefresh, {
    enableIntervalCallback: true,
    refreshRate: EDIT_REFRESH_RATE,
    errorHandle: () => undefined // ignore error
  })

  useEffect(() => {
    callBack()
    setStartIntervalCallback(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setStartIntervalCallback])

  return (
    <>
      {events.map(typeEvent => {
        const { type, event, totalCount } = typeEvent
        const { message, namespace } = event || {}

        const searchAllValue = searchAllMap[type]

        const applicationEventQuery = `${APPLICATIONS}/${buildApplicationName(
          tenantId,
          projectName,
          appName
        )}?selectedTab=Event&${EVENT_QUERY_KEYS.NAMESPACE}=${namespace}&${
          EVENT_QUERY_KEYS.SEARCH_ALL
        }=${searchAllValue}`

        const handleClickMore = () => {
          history.push(applicationEventQuery)
        }

        const Text = () => (
          <span>
            {message}.
            {totalCount > 1 && (
              <Button onClick={handleClickMore} type='link'>
                <span style={{ textDecoration: 'underline' }}>More</span>
              </Button>
            )}
          </span>
        )
        return totalCount ? (
          <ErrorTip key={type} type='error' message={`${type}: `} description={<Text />} showIcon />
        ) : null
      })}
    </>
  )
}

export default EventAlert
