import { Table } from 'common-styles/table'
import InformationCommonList from 'components/Common/InformationCommonList'
import {
  IJobResponseTask,
  IJobResponseTaskContainer,
  IJobResponseTaskContainerVolumeMounts,
  IJobResponseOverview,
} from 'swagger-api/models'
import { RESOURCE_CONFIG_LIST } from 'constants/resource'
import {
  StyledResource,
  StyledInput,
} from 'components/App/ProjectMGT/JobDetail/JobTabs/JobBasicInformation/TaskInfo/TaskInfoTab/style'

interface ITaskInfoTabProps {
  taskInfoData: IJobResponseTask
}

const INFO_CONFIG_LIST = [
  {
    name: 'Task Name',
    key: 'taskName',
  },
  {
    name: 'Replica',
    key: 'replicas',
  },
  {
    name: 'Pod Retry Limit',
    key: 'retryLimit',
  },
  {
    name: 'Container',
    key: 'container',
  },
]
const generateTableData = (originData: IJobResponseTaskContainer[], isInit?: boolean) =>
  originData.map((item, index) => ({
    index: index + 1,
    init: isInit ? 'Yes' : 'No',
    launchCmd: item.command.join(', '),
    envs: item.env,
    // TODO tiancheng.zhang 接口这里返回的数据有问题，需要去掉单位 @tiancheng.zhang@shopee.com
    resource: item.resource,
    image: item.image,
    volumeMounts: item.volumeMounts,
  }))
const TaskInfoTab = ({ taskInfoData }: ITaskInfoTabProps) => {
  const { containers, initContainers, replicas, retryLimit, taskName } = taskInfoData
  const tableDataList = generateTableData(containers).concat(
    generateTableData(initContainers, true),
  )
  const columns = [
    {
      title: 'Item',
      dataIndex: 'index',
      key: 'index',
    },
    {
      title: 'Init',
      dataIndex: 'init',
      key: 'init',
    },
    {
      title: 'Launch-cmd',
      dataIndex: 'launchCmd',
      key: 'launchCmd',
    },
    {
      title: 'Environments',
      dataIndex: 'envs',
      key: 'envs',
      render: (env: IJobResponseOverview) =>
        Object.keys(env)
          .map((key) => `${key}: ${env[key]}`)
          .join('; '),
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
    },
    {
      title: 'Volume Mounts',
      dataIndex: 'volumeMounts',
      key: 'volumeMounts',
      render: (volumnMounts: Array<IJobResponseTaskContainerVolumeMounts>) =>
        volumnMounts.map((item) => `${item.mountPath}${item.subPath}`).join('; '),
    },
    {
      title: 'Resource Applied(Quota)',
      dataIndex: 'resource',
      key: 'resource',
      render: (resource: IJobResponseTaskContainer['resource']) => (
        <StyledResource>
          {RESOURCE_CONFIG_LIST.map((item) => (
            <StyledInput
              key={item.key}
              addonBefore={item.before}
              suffix={item.suffix}
              value={resource?.requests?.[item.key]}
              disabled
            />
          ))}
        </StyledResource>
      ),
    },
  ]
  const data = {
    container: (
      <Table
        rowKey="index"
        bordered
        columns={columns}
        dataSource={tableDataList}
        pagination={false}
        scroll={{ x: true }}
      />
    ),
    taskName,
    retryLimit,
    replicas,
  }
  return <InformationCommonList nameMaps={INFO_CONFIG_LIST} data={data} />
}

export default TaskInfoTab
