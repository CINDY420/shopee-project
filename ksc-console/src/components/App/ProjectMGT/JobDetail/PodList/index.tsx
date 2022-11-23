import React from 'react'
import { useParams } from 'react-router-dom'
import { useDebounce } from 'react-use'
import { Table } from 'common-styles/table'
import TableSearchInput from 'components/Common/TableSearchInput'
import useAntdTable from 'hooks/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { JOB_STATUS, STATUS_COLORS_MAP } from 'constants/projectDetail'
import {
  StyledCard,
  StyledButton,
  StyledModal,
  StyledRow,
} from 'components/App/ProjectMGT/JobDetail/PodList/style'
import { StyledStatusButton } from 'components/App/ProjectMGT/Common/style'
import { podControllerListPods } from 'swagger-api/apis/Pod'
import { IListPodsResponse, IPodListItem } from 'swagger-api/models'
import { ITableParams } from 'types/table'
import { formatUnixTime } from 'helpers/format'
import { ColumnsType } from 'infrad/lib/table'
import TerminalModal from 'components/App/ProjectMGT/JobDetail/PodList/TerminalModal'
import { FullscreenExitOutlined, FullscreenOutlined } from 'infra-design-icons'
import { Button, Col } from 'infrad'
import { getPodServiceUrl } from 'constants/server'

interface IPodListProps {
  clusterName: string
}
const PodList: React.FC<IPodListProps> = ({ clusterName }) => {
  const params = useParams()
  const { tenantId, projectId, jobId } = params
  const [searchVal, setSearchVal] = React.useState<string>()
  const [isTerminalVisible, setIsTerminalVisible] = React.useState<boolean>(false)
  const [isFullScreen, setIsFullScreen] = React.useState(false)
  const [selectedPod, setSelectedPod] = React.useState<IPodListItem | null>(null)

  const listPodsFnWithResource = React.useCallback(
    (tableQueryParams: ITableParams) => {
      if (tenantId && projectId && jobId)
        return podControllerListPods({
          tenantId,
          projectId,
          jobId,
          ...tableQueryParams,
          searchBy: searchVal,
        })
    },
    [tenantId, projectId, jobId, searchVal],
  )
  const [listPodsState, listPodsFn] = useAsyncIntervalFn<IListPodsResponse>(listPodsFnWithResource)
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: listPodsFn })
  const { total, items: podLists } = listPodsState.value || {}

  useDebounce(
    () => {
      searchVal !== undefined && refresh()
    },
    500,
    [searchVal],
  )

  const handleOpenTerminal = (record: IPodListItem) => {
    setSelectedPod(record)
    setIsTerminalVisible(true)
  }

  const handleClickPodService = (record: IPodListItem) => {
    const { namespace, jobName, podName } = record
    const url = getPodServiceUrl({ clusterName, namespace, jobName, podName })
    if (url) {
      window.open(url)
    }
  }

  const columns: ColumnsType<IPodListItem> = [
    {
      title: 'Pod Name',
      dataIndex: 'podName',
      key: 'podName',
    },
    {
      title: 'Task Name',
      dataIndex: 'taskName',
      key: 'taskName',
    },
    {
      title: 'Node IP',
      dataIndex: 'nodeIp',
      key: 'nodeIp',
    },
    {
      title: 'Created Time',
      dataIndex: 'createdAt',
      key: 'created_at',
      sorter: true,
      render: (createdAt: number) => formatUnixTime(createdAt),
    },
    {
      title: 'Status',
      dataIndex: 'podPhase',
      key: 'podPhase',
      render: (value: string) => (
        <StyledStatusButton {...STATUS_COLORS_MAP[value]}>{value}</StyledStatusButton>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <>
          <StyledButton
            type="link"
            onClick={() => handleOpenTerminal(record)}
            disabled={record.podPhase !== JOB_STATUS.RUNNING}
          >
            Terminal
          </StyledButton>
          <StyledButton type="link" onClick={() => handleClickPodService(record)}>
            PodService
          </StyledButton>
        </>
      ),
    },
  ]

  const handleSearchChange = (value: string) => {
    setSearchVal(value)
  }
  return (
    <StyledCard title="Pod List" bordered={false}>
      <TableSearchInput
        placeholder="Search Pod..."
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <Table
        rowKey="podName"
        columns={columns}
        dataSource={podLists}
        onChange={handleTableChange}
        pagination={{
          ...pagination,
          ...TABLE_PAGINATION_OPTION,
          total,
        }}
      />
      <StyledModal
        visible={isTerminalVisible}
        title={
          <StyledRow justify="space-between" align="middle">
            <Col>Terminal</Col>
            <Col>
              <Button
                icon={
                  isFullScreen ? (
                    <FullscreenExitOutlined onClick={() => setIsFullScreen(false)} />
                  ) : (
                    <FullscreenOutlined onClick={() => setIsFullScreen(true)} />
                  )
                }
                type="text"
              />
            </Col>
          </StyledRow>
        }
        isFullScreen={isFullScreen}
        width={isFullScreen ? '100%' : 1024}
        getContainer={document.body}
        footer={null}
        bodyStyle={{ padding: '5px 0 0' }}
        destroyOnClose
        onCancel={() => setIsTerminalVisible(false)}
      >
        {selectedPod && tenantId && projectId && (
          <TerminalModal selectedPod={selectedPod} tenantId={tenantId} projectId={projectId} />
        )}
      </StyledModal>
    </StyledCard>
  )
}

export default PodList
