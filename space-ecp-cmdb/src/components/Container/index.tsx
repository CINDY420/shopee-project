import * as React from 'react'
import 'src/bootstrap'
import SduTable from 'src/components/Container/SduTable'
import TitleBar from 'src/components/Container/TitleBar'
import { fetch } from 'src/rapper'
import { IModels } from 'src/rapper/request'
import { Params } from 'ahooks/lib/useAntdTable/types'
import {
  FilterTypes,
  getFilterItem,
  getFilterUrlParam,
  getTableProps,
} from 'src/helpers/tableProps'
import hooks from 'src/sharedModules/cmdb/hooks'
import useTable from 'src/hooks/useTable'
import cmdbComponents from 'src/sharedModules/cmdb/components'
import { useQuery } from '@space/common-hooks'
import { StyledContainer } from 'src/components/Container/style'
import LoopNotice from 'src/components/Common/LoopNotice'
import RouteSetRegion from 'src/components/Common/RouteSetRegion'

const { usePersistQuery, useSelectedService } = hooks
const { SDUFilters } = cmdbComponents
const SDU_SEARCH_KEY = 'sdu_search'
const HOST_FILTER = '_hf'

type SduList = IModels['GET/api/ecp-cmdb/services/{serviceName}/sdus']['Res']['items']

interface IFilter {
  envs?: string[]
  cids?: string[]
  azs?: string[]
}

const Container: React.FC = () => {
  const { selectedService } = useSelectedService()
  const serviceName = selectedService?.path
  const isGroup = !selectedService?.isLeaf

  const [query] = useQuery()
  const { env, cids, azs } = query
  const { setPersistQuery, getPersistQuery } = usePersistQuery()
  const initFilters: IFilter = getPersistQuery(HOST_FILTER) || {}
  const [filteredEnvs, setFilteredEnvs] = React.useState<string[]>(initFilters.envs || env)
  const [filteredCids, setFilteredCids] = React.useState<string[]>(initFilters.cids || cids)
  const [filteredAzs, setFilteredAzs] = React.useState<string[]>(initFilters.azs || azs)
  const [sduSearchKey, setSduSearchKey] = React.useState<string>(getPersistQuery(SDU_SEARCH_KEY))

  const [totalInstances, setTotalInstances] = React.useState(0)
  const [reloadRate, setReloadRate] = React.useState(15000)

  const changeFilteredValue = (type: 'envs' | 'cids' | 'azs', values: string[]) => {
    initFilters[type] = values
    setPersistQuery(HOST_FILTER, initFilters)
    switch (type) {
      case 'envs':
        setFilteredEnvs(values)
        return
      case 'cids':
        setFilteredCids(values)
        return
      case 'azs':
        setFilteredAzs(values)
        return
    }
  }

  const getSduList = async (
    { current, pageSize, filters, sorter }: Params[0],
    params: {
      serviceName: string
      isGroup: boolean
      envs: string[]
      cids: string[]
      azs: string[]
    },
  ): Promise<{
    total: number
    list: SduList
  }> => {
    const { serviceName, isGroup, envs, cids, azs } = params
    if (!serviceName) return { list: [], total: 0 }
    const sduFilterBy =
      getFilterUrlParam({
        envs: getFilterItem('env', envs, FilterTypes.EQUAL),
        cids: getFilterItem('cid', cids, FilterTypes.EQUAL),
      }) ?? ''
    const searchBy = getFilterUrlParam({
      sdu: getFilterItem('sdu', sduSearchKey, FilterTypes.CONTAIN),
    })
    const { offset, limit, filterBy, orderBy } = getTableProps({
      pagination: { current, pageSize },
      filters: Object.assign(filters || {}, { azV1: azs }),
      sorter,
    })

    const { items, total, totalOfInstances } = await fetch[
      'GET/api/ecp-cmdb/services/{serviceName}/sdus'
    ]({
      offset,
      limit,
      serviceName,
      filterBy,
      sduFilterBy,
      orderBy,
      searchBy,
      isGroup,
    })
    setTotalInstances(totalOfInstances)

    return {
      list: items || [],
      total: total || 0,
    }
  }

  const { tableProps, loading, refreshAsync } = useTable(
    (args) =>
      getSduList(args, {
        serviceName,
        isGroup,
        envs: filteredEnvs,
        cids: filteredCids,
        azs: filteredAzs,
      }),
    {
      refreshDeps: [serviceName, isGroup, filteredEnvs, filteredCids, sduSearchKey, filteredAzs],
      reloadRate,
    },
  )

  const handleSearchSdu = (key: string) => {
    setSduSearchKey(key)
    setPersistQuery(SDU_SEARCH_KEY, key)
  }

  return (
    <>
      <RouteSetRegion />
      <LoopNotice closable style={{ marginBottom: 10 }} />
      <StyledContainer>
        <SDUFilters
          filters={[
            {
              filteredValue: filteredEnvs,
              onFilterValueChanged: (value: string[]) => changeFilteredValue('envs', value),
              type: 'env',
            },
            {
              filteredValue: filteredCids,
              onFilterValueChanged: (value: string[]) => changeFilteredValue('cids', value),
              type: 'cid',
            },
            {
              filteredValue: filteredAzs,
              onFilterValueChanged: (value: string[]) => changeFilteredValue('azs', value),
              type: 'az',
            },
          ]}
        />
      </StyledContainer>
      <StyledContainer padding="10px 20px">
        <TitleBar
          count={totalInstances}
          onSearchSdu={handleSearchSdu}
          sduSearchKey={sduSearchKey}
          onReload={refreshAsync}
          onReloadRateChange={setReloadRate}
          reloadRate={reloadRate}
          isGroup={isGroup}
        />
        <SduTable tableProps={tableProps} loading={loading} onRefresh={refreshAsync} />
      </StyledContainer>
    </>
  )
}

export default Container
