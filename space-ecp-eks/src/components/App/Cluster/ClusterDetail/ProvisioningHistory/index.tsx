import { Badge, Card, Popover } from 'infrad'
import { timestampToLocalTime } from 'src/helpers/time'
import { Table } from 'src/common-styles/table'
import { ReactComponent as ProvisioningSvg } from 'src/assets/provisioning.svg'
import Icon, { InfoCircleOutlined } from 'infra-design-icons'
import { eksJobController_litJobs } from 'src/swagger-api/apis/EksJob'
import { listFnWrapper } from 'src/helpers/table'
import { useTable } from 'src/hooks/useTable'
import { IEksJobItem } from 'src/swagger-api/models'
import { ColumnsType } from 'antd/lib/table'
import { TABLE_PAGINATION_OPTION } from 'src/constants/pagination'

enum JobStatusTypes {
  SUCCEED = 'Succeed',
  PROVISIONING = 'Provisioning',
  PENDING = 'Pending',
  FAILED = 'Failed',
  UNKNOWN = 'Unknown',
}

const statusColorMap: Record<string, string> = {
  [JobStatusTypes.SUCCEED]: '#52C41A',
  [JobStatusTypes.PENDING]: '#722ED1',
  [JobStatusTypes.FAILED]: '#FF4D4F',
  [JobStatusTypes.UNKNOWN]: '##BFBFBF',
}

enum JobConditionStatusTypes {
  RUNNING = 'Running',
  PENDING = 'Pending',
  SUCCEED = 'Succeed',
  FAILED = 'Failed',
  UNKNOWN = 'Unknown',
}

const jobConditionStatusColorMap: Record<string, string> = {
  [JobConditionStatusTypes.RUNNING]: '##13C2C2',
  [JobConditionStatusTypes.PENDING]: '#722ED1',
  [JobConditionStatusTypes.SUCCEED]: '##52C41A',
  [JobConditionStatusTypes.FAILED]: '#FF4D4F',
  [JobConditionStatusTypes.UNKNOWN]: '#BFBFBF',
}

interface IProvisioningHistoryProps {
  clusterId: string
}

const jobStatusConditionColumns = [
  {
    title: 'Type',
    dataIndex: 'type',
    width: 140,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 100,
    render: (status: string) => <Badge color={jobConditionStatusColorMap[status]} text={status} />,
  },
]

const columns: ColumnsType<IEksJobItem> = [
  {
    title: 'ID',
    dataIndex: 'jobId',
  },
  {
    title: 'Event',
    dataIndex: 'event',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (status: string, record) => {
      const { condition = [] } = record
      return (
        <div style={{ whiteSpace: 'nowrap' }}>
          {status === JobStatusTypes.PROVISIONING ? (
            <span style={{ marginLeft: '-8px' }}>
              <Icon component={ProvisioningSvg} style={{ marginRight: '8px' }} />
              {status}
            </span>
          ) : (
            <Badge color={statusColorMap[status]} text={status} />
          )}
          <Popover
            title="Condition"
            content={
              <Table
                columns={jobStatusConditionColumns}
                dataSource={condition}
                pagination={false}
                style={{ width: '240px' }}
              />
            }
            placement="right"
          >
            <InfoCircleOutlined style={{ color: 'rgba(0, 0, 0, 0.45)', marginLeft: 6 }} />
          </Popover>
        </div>
      )
    },
  },
  {
    title: 'Start Time',
    dataIndex: 'startTime',
    render: (value: string) => timestampToLocalTime(value),
  },
  {
    title: 'Update Time',
    dataIndex: 'updateTime',
    render: (value: string) => timestampToLocalTime(value),
  },
]

const ProvisioningHistory: React.FC<IProvisioningHistoryProps> = ({ clusterId }) => {
  const listNodeFn = listFnWrapper(async (args) => {
    const values = await eksJobController_litJobs({
      ...args,
      clusterId: Number(clusterId),
    })
    const { items, total } = values
    return {
      list: items || [],
      total: total || 0,
    }
  })

  const { tableProps } = useTable(listNodeFn, {
    refreshDeps: [clusterId],
    reloadRate: 15000,
  })

  const { pagination } = tableProps

  return (
    <Card style={{ margin: '24px' }}>
      <Table
        {...tableProps}
        columns={columns}
        rowKey="jobId"
        pagination={{
          ...pagination,
          ...TABLE_PAGINATION_OPTION,
        }}
      />
    </Card>
  )
}

export default ProvisioningHistory
