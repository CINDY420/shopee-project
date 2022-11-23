import * as React from 'react'
import { List } from 'infrad'
import { Link } from 'react-router-dom'
import { AutoSizer, List as VList } from 'react-virtualized'

import { RESOURCE_TYPES } from './index'
import { IIGlobalApplication, IIGlobalPod } from 'swagger-api/v3/models'
import { buildApplicationDetailRoute, buildPodDetailRoute } from 'constants/routes/routes'

import { ResourceName, ResourceRemark, ResourceContainer, StyledListItem } from './style'

interface IProps {
  type: RESOURCE_TYPES
  resources: any[]
}

const VirtualList: React.FC<IProps> = ({ type, resources }) => {
  const listItems = React.useMemo(
    () => ({
      [RESOURCE_TYPES.APPLICATIONS]: (resource: IIGlobalApplication, itemParams) => {
        const { appName, tenantId, tenantName, projectName } = resource
        return (
          <StyledListItem {...itemParams}>
            <Link
              style={{ width: '100%' }}
              to={buildApplicationDetailRoute({ tenantId, projectName, applicationName: appName })}
            >
              <ResourceContainer>
                <ResourceName>{appName}</ResourceName>
                <ResourceRemark>{`${tenantName}/${projectName}`}</ResourceRemark>
              </ResourceContainer>
            </Link>
          </StyledListItem>
        )
      },
      [RESOURCE_TYPES.PODS]: (resource: IIGlobalPod, itemParams) => {
        const { podName, podIP, appName, tenantId, projectName, deployName, clusterId } = resource
        return (
          <StyledListItem {...itemParams}>
            <Link
              style={{ width: '100%' }}
              to={buildPodDetailRoute({
                tenantId,
                projectName,
                applicationName: appName,
                deployName,
                podName,
                clusterName: clusterId
              })}
            >
              <ResourceContainer>
                <ResourceName>{podName}</ResourceName>
                <ResourceRemark>IP: {podIP || '-'}</ResourceRemark>
              </ResourceContainer>
            </Link>
          </StyledListItem>
        )
      }
    }),
    []
  )

  const renderItems = React.useCallback(
    params => {
      const item = resources[params.index]
      return listItems[type](item, params)
    },
    [listItems, resources, type]
  )

  return (
    <List>
      <AutoSizer disableHeight>
        {({ width }) => (
          <VList
            height={resources.length > 5 ? 250 : resources.length * 50}
            width={width}
            overscanRowCount={2}
            rowCount={resources.length}
            rowHeight={50}
            rowRenderer={renderItems}
          />
        )}
      </AutoSizer>
    </List>
  )
}

export default VirtualList
