import * as React from 'react'
import { List, Input } from 'infrad'
import { DownOutlined, SearchOutlined } from 'infra-design-icons'
import { matchPath, useLocation } from 'react-router-dom'

import history from 'helpers/history'
import useAsyncFn from 'hooks/useAsyncFn'
import { searchResources } from 'helpers/api'
import {
  APPLICATIONS,
  buildGroupDetailRoute,
  buildProjectDetailRoute,
  buildApplicationDetailRoute
} from 'constants/routes/routes'
import { throttle } from 'helpers/functionUtils'
import { RESOURCE_TYPES } from 'constants/breadcrumb'

import useMountedState from 'hooks/useMountedState'

import { Wrapper, Dropdown, StyledList, ListWrapper, Item, Note } from './style'
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

  const { pathname } = useLocation()

  const path = React.useMemo(() => {
    const match = matchPath(pathname, {
      path: rawMatch,
      exact: false,
      strict: false
    })

    const { url: rawPathWithPrefix } = match

    const rawPath = rawPathWithPrefix.replace(APPLICATIONS, '')

    const path = rawPath.replace(/\/(?:.(?!\/))+$/, '').substr(1)
    return path
  }, [pathname, rawMatch])

  const getMounted = useMountedState()

  const fetchResources = React.useCallback(
    async (path: string, searchBy?: string) => {
      const result = await listResourcesFn({ path, searchBy })
      const resources = result[resourceType]
      if (getMounted()) {
        setList(resources)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [listResourcesFn, resourceType]
  )

  const throttledFetchResources = React.useMemo(() => throttle(300, fetchResources, false, true), [fetchResources])

  React.useEffect(() => {
    throttledFetchResources(path)
  }, [path, throttledFetchResources])

  const handleClick = React.useCallback(
    (params: IParams) => {
      const { name, tenantId, id, projectName } = params
      const realTenantId = tenantId || id
      switch (resourceType) {
        case RESOURCE_TYPES.TENANTS:
          history.push(buildGroupDetailRoute({ tenantId: realTenantId }))
          break
        case RESOURCE_TYPES.PROJECTS:
          history.push(buildProjectDetailRoute({ tenantId: realTenantId, projectName: name }))
          break
        case RESOURCE_TYPES.APPLICATIONS:
          history.push(buildApplicationDetailRoute({ tenantId: realTenantId, projectName, applicationName: name }))
          break
        default:
          break
      }
    },
    [resourceType]
  )

  const isLoading = listResourcesState.loading

  return (
    <Wrapper onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <DownOutlined onClick={() => setIsOpen(!isOpen)} style={{ fontSize: '10px' }} />
      <Dropdown open={isOpen}>
        <Input
          size='small'
          prefix={<SearchOutlined />}
          placeholder={`Search ${resourceType}`}
          onPressEnter={(e: any) => throttledFetchResources(path, e.target.value)}
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
                    handleClick(item)
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
