import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Input, Menu, Dropdown, Tooltip, Select, message } from 'infrad'
import Icon, {
  CheckCircleFilled,
  LoadingOutlined,
  CloseCircleFilled,
  LineChartOutlined,
  DownloadOutlined,
  DownOutlined
} from 'infra-design-icons'

import { Root, Title, SearchWrapper, styledButton as Button, FailedReason, StyledTable } from './style'

import { pprofControllerGetPprofList, pprofControllerGetPprofObject } from 'swagger-api/v3/apis/Pprof'
import { IPprof } from 'swagger-api/v3/models'

import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/table/useAntdTable'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'

import { selectedDeployment } from 'states/applicationState/deployment'
import { useRecoilValue } from 'recoil'
import { generateFilter } from 'helpers/table/generateFilter'
import { getFilterUrlParam, getFilterItem, filterTypes } from 'helpers/queryParams'

import { buildFlameGraphRoute } from 'constants/routes/routes'
import { Link } from 'react-router-dom'
import { addProtocol } from 'helpers/routes'
import { forceDownload } from 'helpers/download'
import { formatTime } from 'helpers/format'

import { CopyToClipboard } from 'react-copy-to-clipboard'

import CopySvg from 'assets/copy.antd.svg?component'
import CopyDisabledSvg from 'assets/copyDisabled.antd.svg?component'

const { Option } = Select

interface IDeployDetail {
  tenantId: string
  projectName: string
  appName: string
  clusterId: string
  name: string
}

enum STATUS {
  SUCCEED = 'Succeeded',
  PROFILING = 'Running',
  FAIL = 'Failed'
}

const StatusIconMap = {
  [STATUS.SUCCEED]: <CheckCircleFilled style={{ color: '#55CC77' }} />,
  [STATUS.PROFILING]: <LoadingOutlined style={{ color: '#2673DD' }} spin />,
  [STATUS.FAIL]: <CloseCircleFilled style={{ color: '#FF4742' }} />
}

const searchValueMap = {
  podName: 'Pod Name',
  env: 'Env',
  operator: 'Operator'
}
type SEARCH_KEY = keyof typeof searchValueMap

enum FLAME_GRAPH_ACTIONS {
  View,
  Download
}

const ProfilingHistory: React.FC = () => {
  const deployment: IDeployDetail = useRecoilValue(selectedDeployment)
  const { tenantId, projectName, appName, name: deployName, clusterId } = deployment

  const [selectedProfile, setSelectedProfile] = useState<IPprof>()
  const [objectList, setObjectList] = useState<string[]>([])

  const getObjectList = useCallback(async () => {
    const { data: objects } = await pprofControllerGetPprofObject({ tenantId, projectName, appName, deployName })
    setObjectList(objects || [])
  }, [appName, deployName, projectName, tenantId])

  useEffect(() => {
    getObjectList()
  }, [getObjectList])

  const selectedProfileFlameGraphRoute = useMemo(() => {
    const { podName, profileId } = selectedProfile || {}
    const selectedProfileFlameGraphRoute = buildFlameGraphRoute({
      tenantId,
      projectName,
      applicationName: appName,
      deployName,
      clusterId,
      podName,
      profileId
    })
    return selectedProfileFlameGraphRoute
  }, [appName, clusterId, deployName, projectName, selectedProfile, tenantId])

  const handleFlameGraphSelect = (profile: IPprof) => setSelectedProfile(profile)

  const handleFlameGraphDownload = () => {
    const { graphs = [] } = selectedProfile || {}
    graphs.forEach(url => {
      forceDownload(addProtocol(url), 'flameGraph')
    })
  }

  const handleProfileDataDownload = (profile: string) => {
    forceDownload(addProtocol(profile), 'profileData')
  }

  const handleCopy = () => {
    message.success('Copy Successfully!')
  }

  const menu = (
    <Menu>
      <Menu.Item key={FLAME_GRAPH_ACTIONS.View}>
        <Link target='_blank' to={selectedProfileFlameGraphRoute}>
          View
        </Link>
      </Menu.Item>
      <Menu.Item key={FLAME_GRAPH_ACTIONS.Download} onClick={handleFlameGraphDownload}>
        Download
      </Menu.Item>
    </Menu>
  )

  const columns = [
    {
      key: 'profileId',
      title: 'Profile ID',
      dataIndex: 'profileId'
    },
    {
      key: 'podName',
      title: 'Pod Name',
      dataIndex: 'podName'
    },
    {
      key: 'env',
      title: 'Env',
      dataIndex: 'env'
    },
    {
      key: 'operator',
      title: 'Operator',
      dataIndex: 'operator'
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      filterMultiple: false,
      filters: Object.values(STATUS).map(status => ({ text: status, value: status })),
      render: (status: string, record: IPprof) => (
        <>
          {StatusIconMap[status]} <span style={{ marginLeft: '5px' }}>{status}</span>
          {status === STATUS.FAIL && (
            <Tooltip overlayInnerStyle={{ whiteSpace: 'pre-wrap' }} title={record.message}>
              <FailedReason>{record.message}</FailedReason>
            </Tooltip>
          )}
        </>
      )
    },
    {
      key: 'createdTime',
      title: 'Create Time',
      dataIndex: 'createdTime',
      sorter: true,
      defaultSortOrder: 'descend',
      render: t => formatTime(t)
    },
    {
      key: 'sampleTime',
      title: 'Sample Time',
      dataIndex: 'sampleTime'
    },
    {
      key: 'object',
      title: 'Object',
      dataIndex: 'object',
      filterMultiple: false,
      filters: objectList.map(objectType => ({ text: objectType, value: objectType }))
    },
    {
      key: 'action',
      title: 'Action',
      render: (_, record: IPprof) => {
        const { object, profile, graphs = [] } = record || {}
        return (
          <div>
            <Dropdown overlay={menu} trigger={['click']} disabled={object === 'Trace' || graphs.length === 0}>
              <Button type='link' icon={<LineChartOutlined />} onClick={() => handleFlameGraphSelect(record)}>
                Flame Graph <DownOutlined />
              </Button>
            </Dropdown>
            <CopyToClipboard onCopy={handleCopy} text={profile}>
              <Button type='link' icon={<Icon component={profile ? CopySvg : CopyDisabledSvg} />} disabled={!profile}>
                Copy Profile Link
              </Button>
            </CopyToClipboard>
            <Button
              type='link'
              icon={<DownloadOutlined />}
              onClick={() => handleProfileDataDownload(profile)}
              disabled={!profile}
            >
              Download Profile Data
            </Button>
          </div>
        )
      }
    }
  ]

  const [selectedSearchKey, setSelectedSearchKey] = useState<SEARCH_KEY>('podName')
  const [searchValue, setSearchValue] = useState<string>()

  const listProfileWithParams = args => {
    const { filterBy, ...others } = args || {}
    const extraFilterBy = getFilterUrlParam({
      [selectedSearchKey]: getFilterItem(selectedSearchKey, searchValue, filterTypes.contain)
    })
    return pprofControllerGetPprofList({
      tenantId,
      projectName,
      appName,
      deployName,
      filterBy: generateFilter([filterBy ? `${filterBy}${extraFilterBy ? `;${extraFilterBy}` : ''}` : extraFilterBy]),
      orderBy: 'createdTime desc',
      ...others
    })
  }
  const [listProfileState, listProfileFn] = useAsyncIntervalFn(listProfileWithParams, {
    enableIntervalCallback: true,
    refreshRate: 10000
  })
  const { handleTableChange, pagination, refresh } = useAntdTable({
    fetchFn: listProfileFn,
    orderDefault: 'createdTime desc'
  })
  const { loading, value } = listProfileState || {}
  const { data: profileDatas } = value || {}
  const { total, list } = profileDatas || {}

  const handleSearch = (searchValue: string) => {
    setSearchValue(searchValue)
  }

  useEffect(() => {
    refresh()
  }, [refresh, selectedSearchKey, searchValue])

  return (
    <Root>
      <Title>Profile List</Title>
      <SearchWrapper>
        <Input.Group compact>
          <Select
            defaultValue={selectedSearchKey}
            style={{ width: '120px' }}
            onSelect={option => setSelectedSearchKey(option)}
          >
            {Object.entries(searchValueMap).map(([option, displayName]) => (
              <Option key={option} value={option}>
                {displayName}
              </Option>
            ))}
          </Select>
          <Input.Search style={{ width: '240px' }} placeholder='Search' onSearch={handleSearch} />
        </Input.Group>
      </SearchWrapper>
      <StyledTable
        rowKey='profileId'
        columns={columns}
        dataSource={list}
        loading={loading}
        onChange={handleTableChange}
        pagination={{
          ...pagination,
          ...TABLE_PAGINATION_OPTION,
          showQuickJumper: true,
          total
        }}
      />
    </Root>
  )
}

export default ProfilingHistory
