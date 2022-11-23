import * as React from 'react'

import useAsyncFn from 'hooks/useAsyncFn'

import { ApplicationContext, initialState, reducer, getDispatchers } from './useApplicationContext'
import { applicationControllerGetApplication } from 'swagger-api/v1/apis/Application'

// import Statistics from './Statistics'
import DeploymentList from './DeploymentList'
import { Card } from 'common-styles/cardWrapper'

// import { StyledCard } from './style'

interface IOverviewProps {
  application: any
}

const Overview: React.FC<IOverviewProps> = ({ application = {} }) => {
  const { name, tenantId, projectName } = application

  const [state, dispatch] = React.useReducer(reducer, initialState)
  const dispatchers = React.useMemo(() => getDispatchers(dispatch), [])

  const scrollElement = React.useRef<HTMLDivElement>(null)
  const [getDeployFilterInfoState, getDeployFilterInfoFn] = useAsyncFn(applicationControllerGetApplication)

  React.useEffect(() => {
    getDeployFilterInfoFn({ tenantId, projectName, appName: name })
  }, [getDeployFilterInfoFn, tenantId, name, projectName])

  React.useEffect(() => {
    if (getDeployFilterInfoState.value) {
      dispatchers.updateFilters({ ...getDeployFilterInfoState.value })
    }
  }, [dispatchers, getDeployFilterInfoState.value])

  // const handleClick = React.useCallback(() => {
  //   scrollElement.current && scrollElement.current.scrollIntoView({ behavior: 'smooth' })
  // }, [])

  return (
    <ApplicationContext.Provider value={{ state, dispatch }}>
      {/* Disable statistic for Leap deployments have no data */}
      {/* <StyledCard>
        <Statistics application={application} onClick={handleClick} />
      </StyledCard> */}
      <Card style={{ marginTop: '16px' }}>
        <DeploymentList application={application} ref={scrollElement} />
      </Card>
    </ApplicationContext.Provider>
  )
}

export default Overview
