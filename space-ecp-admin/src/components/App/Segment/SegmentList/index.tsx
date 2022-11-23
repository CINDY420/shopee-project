import React, { useCallback, useEffect, useState } from 'react'
import {
  StyledProgressStatus,
  StyledSelector,
  StyledSelectorLabel,
  StyledColumnTitle,
} from 'src/components/App/Segment/SegmentList/style'
import {
  ContentWrapper,
  StyledContent,
  StyledLayout,
  StyledPageHeader,
} from 'src/common-styles/layout'
import ResourceStatus from 'src/components/App/Segment/SegmentList/ResourceStatus'
import { Cascader, Progress, TableColumnType, Tag, Tooltip } from 'infrad'
import { Models, fetch } from 'src/rapper'
import useAntdTable, {
  FilterTypes,
  getFilterUrlParam,
  IFilterParams,
} from 'src/hooks/table/useAntdTable'
import { Table } from 'src/common-styles/table'
import { DEFAULT_TABLE_PAGINATION } from 'src/constants/pagination'
import { Link } from 'react-router-dom'
import { SEGMENT_LIST } from 'src/constants/routes/routes'
import { InfoCircleOutlined } from 'infra-design-icons'
import { ByteToGiB, formatCpu } from 'src/helpers/unit'

type Segment = Models['GET/ecpadmin/segments']['Res']['items'][0]
type ListSegmentsRequest = Models['GET/ecpadmin/segments']['Req']
type ListSegmentsResponse = Models['GET/ecpadmin/segments']['Res']

interface IOption {
  value: string
  label: string
  children: IOption[]
}
interface IFilter {
  value: string
  text: string
}

const SegmentList: React.FC = () => {
  const [data, setData] = useState<ListSegmentsResponse>()
  const [selectedPath, setSelectedPath] = useState<(string | number)[]>([])
  const [regionsFilters, setRegionsFilters] = useState<IFilter[]>([])
  const [segmentsOptions, setSegmentsOptions] = useState<IOption[]>([])
  const [propertyFilters, setPropertyFilters] = useState<IFilter[]>([])
  const [typeFilters, setTypeFilters] = useState<IFilter[]>([])

  const columns: TableColumnType<Segment>[] = [
    {
      title: 'AZ/Segment',
      dataIndex: 'segment',
      key: 'segment',
      render: (_, segment) => (
        <Link
          to={`${SEGMENT_LIST}/${segment.segmentId}`}
        >{`${segment.azName}/${segment.name}`}</Link>
      ),
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      filters: regionsFilters,
    },
    {
      title: 'Resource Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { value: 'High', text: 'High' },
        { value: 'Low', text: 'Low' },
        { value: 'Normal', text: 'Normal' },
      ],
      render: (status: Segment['status'], segment) => {
        const cpu = segment.cpu
        /*
         * TODO xiaocong.dong change to memory after rapper fix its code generation bug
         * @ts-expect-error issues from rapper, wait for rapper to fix this
         */
        const memory: Segment['cpu'] = segment.memory
        const cpuPercentage = Math.round((cpu.applied / cpu.total) * 100)
        const memoryPercentage = Math.round((memory.applied / memory.total) * 100)

        return (
          <ResourceStatus
            status={status}
            cpuPercentage={cpuPercentage}
            memoryPercentage={memoryPercentage}
          />
        )
      },
    },
    {
      title: 'Property',
      dataIndex: 'property',
      key: 'property',
      filters: propertyFilters,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: typeFilters,
    },
    {
      title: 'Label',
      dataIndex: 'labels',
      key: 'labels',
      render: (labels: string[]) => labels.map((label) => <Tag key={label}>{label}</Tag>),
    },
    {
      title: (
        <div>
          <StyledColumnTitle>Used/Applied/TotalCPU</StyledColumnTitle>
          <Tooltip
            title="Used：Sum of cluster usage Assigned: Sum of pod limit Total: Total resource"
            placement="top"
            getPopupContainer={() => document.body}
          >
            <InfoCircleOutlined />
          </Tooltip>
        </div>
      ),
      dataIndex: 'appliedCPUPercentage',
      key: 'appliedCPUPercentage',
      sorter: true,
      render: (
        _,
        { appliedCPUPercentage: appliedPercentage, usedCPUPercentage: usedPercentage, cpu },
      ) => (
        <div>
          <span>
            {formatCpu(cpu?.used)}/{formatCpu(cpu.applied)}/{formatCpu(cpu.total)} Cores
          </span>
          <Progress
            percent={appliedPercentage}
            strokeColor="#B37FEB"
            success={{ percent: usedPercentage, strokeColor: '#A6D4FF' }}
            showInfo={false}
          />
          <StyledProgressStatus>{`${usedPercentage}% / ${appliedPercentage}%`}</StyledProgressStatus>
        </div>
      ),
    },
    {
      title: 'Used/Applied/TotalMemory',
      dataIndex: 'appliedMemoryPercentage',
      key: 'appliedMemoryPercentage',
      sorter: true,
      // TODO xiaocong.dong change to memory after rapper fix its code generation bug
      render: (
        _,
        {
          usedMemoryPercentage: usedPercentage,
          appliedMemoryPercentage: appliedPercentage,
          memory,
        },
      ) => (
        <div>
          <span>
            {ByteToGiB(memory?.used)}/{ByteToGiB(memory.applied)}/{ByteToGiB(memory.total)} GiB
          </span>
          <Progress
            percent={appliedPercentage}
            strokeColor="#B37FEB"
            success={{ percent: usedPercentage, strokeColor: '#A6D4FF' }}
            showInfo={false}
          />
          <StyledProgressStatus>{`${usedPercentage}% / ${appliedPercentage}%`}</StyledProgressStatus>
        </div>
      ),
    },
  ]

  const handleChange = (selectedPath: (string | number)[]) => {
    setSelectedPath(selectedPath)
  }
  const listAZs = useCallback(async () => {
    const response = await fetch['GET/ecpadmin/azs']()
    setSegmentsOptions(
      response.items
        .sort((item1, item2) => {
          if (item1.azName === item2.azName) {
            return 0
          }
          if (item1.azName > item2.azName) {
            return 1
          }
          return -1
        })
        .map((item) => ({
          value: item.azKey,
          label: item.azName,
          children: item?.segments.map((segment) => ({
            value: segment.segmentKey,
            label: segment.segmentName,
            children: [],
          })),
        })),
    )
    const set = new Set<string>()
    response.items.forEach((item) => {
      if (item.region) {
        set.add(item.region)
      }
    })
    setRegionsFilters(
      Array.from(set).map((region) => ({
        value: region,
        text: region,
      })),
    )
  }, [])
  const listAZProperties = useCallback(async () => {
    const response = await fetch['GET/ecpadmin/enums/azProperties']()
    setPropertyFilters(
      response.items.map((property) => ({
        value: property as string,
        text: property as string,
      })),
    )
  }, [])
  const listAZTypes = useCallback(async () => {
    const response = await fetch['GET/ecpadmin/enums/azTypes']()
    setTypeFilters(
      response.items.map((type) => ({
        value: type as string,
        text: type as string,
      })),
    )
  }, [])

  useEffect(() => {
    listAZs()
    listAZProperties()
    listAZTypes()
  }, [])

  let azSegmentFilterBy: string | undefined
  if (selectedPath && selectedPath.length) {
    let filterParams: IFilterParams = {
      azKey: { key: 'azKey', value: selectedPath[0], type: FilterTypes.EQUAL },
    }

    if (selectedPath.length > 1) {
      filterParams = {
        ...filterParams,
        segmentKey: { key: 'segmentKey', value: selectedPath[1], type: FilterTypes.EQUAL },
      }
    }

    azSegmentFilterBy = getFilterUrlParam(filterParams)
  }

  const listSegmentsFn = useCallback(
    async (args: ListSegmentsRequest) => {
      let { filterBy } = args
      if (azSegmentFilterBy) {
        filterBy = filterBy ? `${filterBy};${azSegmentFilterBy}` : azSegmentFilterBy
      }
      const response = await fetch['GET/ecpadmin/segments']({
        ...args,
        filterBy,
      })
      setData(response)
    },
    [azSegmentFilterBy],
  )
  const { pagination, handleTableChange, refresh } = useAntdTable({
    fetchFn: listSegmentsFn,
    shouldFetchOnMounted: false,
  })

  useEffect(() => {
    refresh()
  }, [refresh, selectedPath])

  return (
    <StyledLayout>
      <StyledPageHeader title="Segment" />
      <ContentWrapper>
        <StyledContent>
          <StyledSelector>
            <StyledSelectorLabel>AZ/Segment:</StyledSelectorLabel>
            <Cascader
              showSearch
              options={segmentsOptions}
              onChange={handleChange}
              changeOnSelect
              dropdownMenuColumnStyle={{
                maxWidth: '150px',
              }}
            />
          </StyledSelector>
          <Table
            dataSource={data?.items}
            columns={columns}
            onChange={handleTableChange}
            pagination={{ ...pagination, ...DEFAULT_TABLE_PAGINATION, total: data?.total }}
          />
        </StyledContent>
      </ContentWrapper>
    </StyledLayout>
  )
}

export default SegmentList
