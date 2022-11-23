import { StyledTable } from 'components/App/ResourceManagement/Summary/style'
import * as React from 'react'
import { COLUMNS } from 'components/App/ResourceManagement/Summary/columnGroups'
import { ColumnsType } from 'infrad/lib/table'
import ActionBar from 'components/App/ResourceManagement/Summary/ActionBar'
import SummaryBatchOperation from 'components/App/ResourceManagement/Summary/SummaryBatchOperation'
import { Radio, RadioChangeEvent } from 'infrad'
import {
  ISduResourceControllerListSummaryParams,
  sduResourceControllerListSummary
} from 'swagger-api/v1/apis/SduResource'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/table/useAntdTable'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { ISummaryData } from 'swagger-api/v1/models'
import PromptCreator from 'components/Common/PromptCreator'
import { GlobalContext } from 'hocs/useGlobalContext'
import { PLATFORM_USER_ROLE } from 'constants/rbacActions'

const { Prompt } = PromptCreator({
  content: "The changes you made haven't been saved."
})

export enum TAB {
  LEVEL_1_PROJECT = 'Level 1 Project',
  LEVEL_2_PROJECT = 'Level 2 Project',
  LEVEL_3_PROJECT = 'Level 3 Project',
  DETAILED_SUMMARY = 'Detailed Summary'
}

export const GROUP_BY_MAPPING = {
  [TAB.LEVEL_1_PROJECT]: 'level1',
  [TAB.LEVEL_2_PROJECT]: 'level2',
  [TAB.LEVEL_3_PROJECT]: 'level3',
  [TAB.DETAILED_SUMMARY]: 'detail'
}

export interface ISearchValues extends Omit<ISduResourceControllerListSummaryParams, 'limit' | 'offset'> {}

const projectColumns: ColumnsType = [
  {
    title: TAB.LEVEL_1_PROJECT,
    dataIndex: 'level1DisplayName',
    fixed: 'left',
    width: 140
  },
  {
    title: TAB.LEVEL_2_PROJECT,
    dataIndex: 'level2DisplayName',
    fixed: 'left',
    width: 140
  },
  {
    title: TAB.LEVEL_3_PROJECT,
    dataIndex: 'level3DisplayName',
    fixed: 'left',
    width: 140
  }
]
const detailedSummaryColumns: ColumnsType = [
  {
    title: 'AZ',
    dataIndex: 'az',
    fixed: 'left',
    width: 80
  },
  {
    title: 'Env',
    dataIndex: 'displayEnv',
    fixed: 'left',
    width: 80
  }
]

const Summary: React.FC = () => {
  const { state: globalContextState } = React.useContext(GlobalContext)
  const { userRoles = [] } = globalContextState || {}
  const isPlatformAdmin = userRoles.some(role => role.roleId === PLATFORM_USER_ROLE.PLATFORM_ADMIN)

  const [selectedProjectColumns, setSelectedProjectColumns] = React.useState<ColumnsType>(projectColumns.slice(0, 1))
  const [selectedTab, setSelectedTab] = React.useState<TAB>(TAB.LEVEL_1_PROJECT)
  const [selectedRows, setSelectedRows] = React.useState([])

  const [searchValues, setSearchValues] = React.useState<ISearchValues>({
    groupBy: GROUP_BY_MAPPING[TAB.LEVEL_1_PROJECT]
  })
  const [isBatchOperating, setIsBatchOperating] = React.useState(false)

  const handleTabChange = (e: RadioChangeEvent) => {
    const tab = e.target.value
    setSelectedTab(tab)
    switch (tab) {
      case TAB.LEVEL_1_PROJECT:
        setSelectedProjectColumns(projectColumns.slice(0, 1))
        setSearchValues({ ...searchValues, groupBy: GROUP_BY_MAPPING[TAB.LEVEL_1_PROJECT] })
        break
      case TAB.LEVEL_2_PROJECT:
        setSelectedProjectColumns(projectColumns.slice(0, 2))
        setSearchValues({ ...searchValues, groupBy: GROUP_BY_MAPPING[TAB.LEVEL_2_PROJECT] })
        break
      case TAB.LEVEL_3_PROJECT:
        setSelectedProjectColumns(projectColumns.slice(0, 3))
        setSearchValues({ ...searchValues, groupBy: GROUP_BY_MAPPING[TAB.LEVEL_3_PROJECT] })
        break
      case TAB.DETAILED_SUMMARY:
        const machineModelColumn: ColumnsType = [
          {
            title: 'Machine Model',
            dataIndex: 'machineModel',
            fixed: 'left',
            width: 80
          }
        ]
        const newDetailedSummaryColumns = isPlatformAdmin
          ? detailedSummaryColumns.concat(machineModelColumn)
          : detailedSummaryColumns
        setSelectedProjectColumns(projectColumns.slice(0, 3).concat(newDetailedSummaryColumns))
        setSearchValues({ ...searchValues, groupBy: GROUP_BY_MAPPING[TAB.DETAILED_SUMMARY] })
        break
      default:
        break
    }
  }

  const fetchFn = React.useCallback(
    args => {
      return sduResourceControllerListSummary({
        ...searchValues,
        ...args
      })
    },
    [searchValues]
  )

  const [summaryListState, summaryListFn] = useAsyncIntervalFn(fetchFn)
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: summaryListFn })
  const { summaries = [], total = 0 } = summaryListState.value || {}
  React.useEffect(() => {
    refresh()
  }, [refresh, searchValues])

  const rowSelection = {
    selectedRows,
    preserveSelectedRowKeys: true,
    onChange: (_, rows) => {
      setSelectedRows(rows)
    }
  }

  React.useEffect(() => {
    if (!isBatchOperating) {
      setSelectedRows([])
    }
  }, [isBatchOperating])

  const getSearchValues = (comingSearchValues: Omit<ISearchValues, 'groupBy'>) => {
    const { groupBy } = searchValues
    setSearchValues({ groupBy, ...comingSearchValues })
  }

  return (
    <>
      <Radio.Group onChange={handleTabChange} value={selectedTab} disabled={isBatchOperating}>
        {Object.values(TAB).map(item => (
          <Radio.Button key={item} value={item}>
            {item}
          </Radio.Button>
        ))}
      </Radio.Group>
      <ActionBar isBatchOperating={isBatchOperating} tab={selectedTab} getSearchValues={getSearchValues}>
        <SummaryBatchOperation
          tab={selectedTab}
          isBatchOperating={isBatchOperating}
          onBatchOperationStatusChange={setIsBatchOperating}
          selectedTableRows={selectedRows}
          searchAllValues={Object.assign(searchValues || {}, {
            limit: total,
            offset: 0,
            groupBy: GROUP_BY_MAPPING[selectedTab]
          })}
        />
      </ActionBar>
      <Prompt when={isBatchOperating} onlyPathname={false}>
        <StyledTable
          loading={summaryListState.loading}
          rowKey={(record: ISummaryData) =>
            `${record.level1DisplayName}${record.level2DisplayName}${record.level3DisplayName}${record.az}${record.displayEnv}${record.machineModel}`
          }
          rowSelection={isBatchOperating ? rowSelection : undefined}
          columns={selectedProjectColumns.concat(COLUMNS(selectedTab === TAB.DETAILED_SUMMARY))}
          dataSource={summaries}
          bordered
          size='middle'
          scroll={{ x: 'max-content' }}
          onChange={handleTableChange}
          pagination={{
            ...TABLE_PAGINATION_OPTION,
            ...pagination,
            total
          }}
        />
      </Prompt>
    </>
  )
}

export default Summary
