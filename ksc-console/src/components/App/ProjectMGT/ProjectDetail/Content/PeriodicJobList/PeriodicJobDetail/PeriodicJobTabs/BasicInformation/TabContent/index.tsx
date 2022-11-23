import {
  StyleUnits,
  StyleValues,
} from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content/Preview/TaskContent/style'
import InformationCommonList from 'components/Common/InformationCommonList'
import { INSTANCE_BASIC_INFORMATION_TASK } from 'constants/periodicJob'
import { RESOURCE_CONFIG_LIST } from 'constants/resource'
import { removeUnitOfMemory } from 'helpers/format'
import { Space, Table } from 'infrad'
import { ColumnsType } from 'infrad/lib/table'
import {
  IPeriodicJobTemplateTask,
  IPeriodicJobTemplateTaskContainer,
  IPeriodicJobTemplateTaskContainerResource,
  IPeriodicJobTemplateTaskContainerVolumeMounts,
} from 'swagger-api/models'

interface ITableData extends Omit<IPeriodicJobTemplateTaskContainer, 'command' | 'env'> {
  index: number
  init: 'Yes' | 'No'
  launchCmd: string
  envs: Record<string, string>
}

const generateTableData = (
  originData?: IPeriodicJobTemplateTaskContainer[],
  isInit?: boolean,
): ITableData[] => {
  if (!originData) {
    return []
  }
  return originData.map((item, index) => ({
    index: index + 1,
    init: isInit ? 'Yes' : 'No',
    launchCmd: item.command.join(', '),
    envs: item.env,
    resource: item.resource,
    image: item.image,
    volumeMounts: item.volumeMounts,
  }))
}

interface IBasicInformationTabContentProps {
  task: IPeriodicJobTemplateTask
}
const BasicInformationTabContent: React.FC<IBasicInformationTabContentProps> = ({ task }) => {
  const { containers, initContainers, replicas, retryLimit, taskName } = task
  const tableData = generateTableData(containers).concat(generateTableData(initContainers, true))
  const columns: ColumnsType<ITableData> = [
    {
      title: 'Item',
      dataIndex: 'index',
    },
    {
      title: 'Init',
      dataIndex: 'init',
    },
    {
      title: 'Launch-cmd',
      dataIndex: 'launchCmd',
    },
    {
      title: 'Environments',
      dataIndex: 'envs',
      render: (env: Record<string, string>) =>
        env
          ? Object.keys(env)
              .map((key) => `${key}: ${env[key]}`)
              .join('; ')
          : '--',
    },
    {
      title: 'Image',
      dataIndex: 'image',
    },
    {
      title: 'Volume Mounts',
      dataIndex: 'volumeMounts',
      render: (volumnMounts: IPeriodicJobTemplateTaskContainerVolumeMounts) => (
        <Space direction="vertical">
          <div>SubPath: {volumnMounts?.[0]?.subPath || '--'}</div>
          <div>MountPath: {volumnMounts?.[0]?.mountPath || '--'}</div>
        </Space>
      ),
    },
    {
      title: 'Resource Applied(Quota)',
      dataIndex: 'resource',
      render: (resource: IPeriodicJobTemplateTaskContainerResource) => {
        const { requests } = resource ?? {}
        return (
          <Space>
            {RESOURCE_CONFIG_LIST.map((resourceConfig) => (
              <Space key={resourceConfig.key} direction="vertical" style={{ width: '100px' }}>
                <div>{resourceConfig.before}</div>
                <div>
                  <StyleValues>
                    {Number(removeUnitOfMemory(requests?.[resourceConfig.key])).toFixed(2)}
                  </StyleValues>
                  <StyleUnits>{resourceConfig.suffix}</StyleUnits>
                </div>
              </Space>
            ))}
          </Space>
        )
      },
    },
  ]
  const data = {
    container: (
      <Table
        rowKey="index"
        bordered
        columns={columns}
        dataSource={tableData}
        pagination={false}
        scroll={{ x: true }}
      />
    ),
    taskName,
    retryLimit,
    replicas,
  }
  return <InformationCommonList nameMaps={INSTANCE_BASIC_INFORMATION_TASK} data={data} />
}

export default BasicInformationTabContent
