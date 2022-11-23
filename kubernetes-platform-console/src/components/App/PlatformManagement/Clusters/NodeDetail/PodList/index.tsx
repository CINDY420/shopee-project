import * as React from 'react'
import { SearchOutlined } from 'infra-design-icons'

import useAntdTable from 'hooks/table/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'

import { REFRESH_RATE } from 'constants/time'
import { nodesControllerGetNodePodList } from 'swagger-api/v3/apis/Nodes'

import { getFilterUrlParam, getFilterItem, filterTypes } from 'helpers/queryParams'
import { throttle } from 'helpers/functionUtils'

import PodTable from 'components/Common/PodTable'

import { PodListWrapper, Title, SearchRow, StyledInput } from './style'
import { POD_TABLE_CONTEXT } from 'constants/common'

interface IPodListProps {
  clusterName: string
  name: string
}

const PodList: React.FC<IPodListProps> = ({ clusterName, name }) => {
  const [searchVal, setSearchVal] = React.useState('')

  const listPodsWithResource = React.useCallback(
    args => {
      const { filterBy } = args || {}

      const extraFilterBy = getFilterUrlParam(
        {
          name: getFilterItem('name', searchVal, filterTypes.contain),
          podIP: getFilterItem('podIP', searchVal, filterTypes.contain)
        },
        { or: true }
      )

      return nodesControllerGetNodePodList({
        ...args,
        clusterName,
        nodeName: name,
        filterBy: filterBy ? `${filterBy}${extraFilterBy ? `;${extraFilterBy}` : ''}` : extraFilterBy
      })
    },
    [searchVal, clusterName, name]
  )

  const [listPodsState, listPodsFn] = useAsyncIntervalFn<any>(listPodsWithResource, {
    enableIntervalCallback: true,
    refreshRate: REFRESH_RATE
  })

  const useAntdTableResult = useAntdTable({ fetchFn: listPodsFn, shouldFetchOnMounted: false })
  const { refresh } = useAntdTableResult
  const throttledRefresh = React.useMemo(() => throttle(500, refresh, false, true), [refresh])

  React.useEffect(() => {
    throttledRefresh()
  }, [searchVal, throttledRefresh])

  const handleSearchChange = React.useCallback(val => {
    setSearchVal(val)
  }, [])

  return (
    <PodListWrapper data-cy='node-detail-pod-list'>
      <Title>Pod List</Title>
      <SearchRow>
        <StyledInput
          data-cy='node-detail-search-pod'
          allowClear
          value={searchVal}
          placeholder='Search Pod Name/IP...'
          suffix={<SearchOutlined />}
          onChange={event => handleSearchChange(event.target.value)}
        />
      </SearchRow>
      <PodTable
        showActions={false}
        showPhase={false}
        listPodsState={listPodsState}
        useAntdTableResult={useAntdTableResult}
        contextType={POD_TABLE_CONTEXT.NODE}
      />
    </PodListWrapper>
  )
}

export default PodList
