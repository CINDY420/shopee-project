import * as React from 'react'
import { List } from 'infrad'
import { DownOutlined } from 'infra-design-icons'
import { matchPath, useLocation } from 'react-router-dom'

import history from 'helpers/history'
import useAsyncFn from 'hooks/useAsyncFn'
import { searchResources } from 'helpers/api'
import { buildGatewayGroupRoute, buildGatewayProjectRoute } from 'constants/routes/gateway/routes'
import { throttle } from 'helpers/functionUtils'
import { RESOURCE_TYPES } from 'constants/breadcrumb'

import { Wrapper, Dropdown, StyledList, ListWrapper, StyledSearch, Item, Note } from './style'
interface IParams {
  name: string
  tenantName?: string
  tenantId?: number
  id?: number
  projectName?: string
  clusterId?: string[]
}

interface IProps {
  match: string
  resourceType: string
}

const Overlay: React.FC<IProps> = ({ match: rawMatch, resourceType }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [list, setList] = React.useState([])
  const [listResourcesState, listResourcesFn] = useAsyncFn(searchResources)
  const [gatewayType, setGatewayType] = React.useState('')

  const { pathname } = useLocation()

  const path = React.useMemo(() => {
    const match = matchPath(pathname, {
      path: rawMatch,
      exact: false,
      strict: false
    })

    const { url: rawPathWithPrefix, params } = match
    const { gatewayName } = params as any

    setGatewayType(gatewayName)

    const rawPath = rawPathWithPrefix.replace(/\/gateways\/[^\/]*\//, '')
    const path = rawPath.replace(/\/(?:.(?!\/))+$/, '')

    return path
  }, [pathname, rawMatch])

  const removeEmptyGroup = React.useCallback(
    async tenants => {
      const fns = tenants.map(async tenant => {
        return listResourcesFn({ path: `tenants/${tenant.id}/projects` })
      })

      const tenantProjects = await Promise.all(fns).then(responses => {
        return responses.filter((projects: { totalCount: number }) => {
          const { totalCount } = projects
          return totalCount !== 0
        })
      })

      return tenants.filter(tenant => {
        return tenantProjects.find((item: { tenantId: number }) => item.tenantId === tenant.id)
      })
    },
    [listResourcesFn]
  )

  const fetchResources = React.useCallback(
    async (path: string, searchBy?: string) => {
      const result = await listResourcesFn({ path, searchBy })
      const resources = result[resourceType]
      const list = resourceType === RESOURCE_TYPES.TENANTS ? await removeEmptyGroup(resources) : resources
      setList(list)
    },
    [listResourcesFn, removeEmptyGroup, resourceType]
  )

  const throttledFetchResources = React.useMemo(() => throttle(300, fetchResources, false, true), [fetchResources])

  React.useEffect(() => {
    throttledFetchResources(path)
  }, [path, throttledFetchResources])

  const handleClick = React.useCallback(
    (resourceName: string, params: IParams) => {
      const { id, tenantId } = params
      const realTenantId = tenantId || id

      switch (resourceType) {
        case RESOURCE_TYPES.TENANTS:
          history.push(buildGatewayGroupRoute({ tenantId: realTenantId, gatewayType }))
          break
        case RESOURCE_TYPES.PROJECTS:
          history.push(buildGatewayProjectRoute({ tenantId: realTenantId, projectName: resourceName, gatewayType }))
          break
        default:
          break
      }
    },
    [gatewayType, resourceType]
  )

  const isLoading = listResourcesState.loading

  return (
    <Wrapper onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <DownOutlined onClick={() => setIsOpen(!isOpen)} style={{ fontSize: '10px' }} />
      <Dropdown open={isOpen}>
        <StyledSearch
          size='small'
          placeholder={`Search ${resourceType}`}
          onSearch={value => throttledFetchResources(path, value)}
          onChange={e => throttledFetchResources(path, e.target.value)}
        />
        <ListWrapper>
          <StyledList
            loading={isLoading}
            split={false}
            dataSource={list}
            renderItem={(item: IParams) => {
              const { clusterId, name } = item
              return (
                <List.Item
                  onClick={() => {
                    handleClick(name, item)
                    setIsOpen(false)
                  }}
                >
                  <div>
                    <Item>{name}</Item>
                    {clusterId && <Note>{clusterId}</Note>}
                  </div>
                </List.Item>
              )
            }}
          />
        </ListWrapper>
      </Dropdown>
    </Wrapper>
  )
}

export default Overlay
