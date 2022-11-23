import {
  StyleColKey,
  StyleColValue,
  StyleRow,
} from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content/Preview/style'
import {
  StyleUnits,
  StyleValues,
} from 'components/App/ProjectMGT/ProjectDetail/Content/PeriodicJobList/CreatePeriodicJob/Content/Preview/TaskContent/style'
import { RESOURCE_CONFIG_LIST } from 'constants/resource'
import { Space, Table } from 'infrad'
import { ColumnsType } from 'infrad/lib/table'
import {
  IPeriodicJobTemplateTaskContainerResource,
  IPeriodicJobTemplateTaskContainerVolumeMounts,
} from 'swagger-api/models'
import * as ramda from 'ramda'
import { generateContainerEnv, ITaskContainers, ITasks } from 'helpers/job'

const TASK_INFORMATION = [
  { displayName: 'Task Name', formNamePath: 'taskName' },
  { displayName: 'Replica', formNamePath: 'replicas' },
  { displayName: 'Pod Retry Limit', formNamePath: 'retryLimit' },
]

interface IColumns extends ITaskContainers {
  index: number
}

interface IPreviewTaskContentProps {
  taskInfo: ITasks
}
const PreviewTaskContent: React.FC<IPreviewTaskContentProps> = ({ taskInfo }) => {
  const columns: ColumnsType<IColumns> = [
    {
      title: 'Item',
      dataIndex: 'index',
    },
    {
      title: 'Init',
      dataIndex: 'isInitContainer',
      render: (isInitContainer: boolean) => (isInitContainer ? 'Yes' : 'No'),
    },
    {
      title: 'Launch-cmd',
      dataIndex: 'command',
    },
    {
      title: 'Environments',
      dataIndex: 'env',
      render: (env: string) => {
        const formatEnvs: Record<string, string> = generateContainerEnv(env)
        if (ramda.isEmpty(formatEnvs)) {
          return '--'
        }
        return Object.entries(formatEnvs).map(([key, value]) => (
          <div key={key}>
            {key}: {value}
          </div>
        ))
      },
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
        const { requests } = resource
        return (
          <Space>
            {RESOURCE_CONFIG_LIST.map((resourceConfig) => (
              <Space key={resourceConfig.key} direction="vertical" style={{ width: '100px' }}>
                <div>{resourceConfig.before}</div>
                <div>
                  <StyleValues>{Number(requests[resourceConfig.key]).toFixed(2)}</StyleValues>
                  <StyleUnits>{resourceConfig.suffix}</StyleUnits>
                </div>
              </Space>
            ))}
          </Space>
        )
      },
    },
  ]
  return (
    <>
      {TASK_INFORMATION.map((info) => (
        <StyleRow key={info.displayName}>
          <StyleColKey>{info.displayName}</StyleColKey>
          <StyleColValue>{taskInfo[info.formNamePath]}</StyleColValue>
        </StyleRow>
      ))}
      <StyleRow>
        <StyleColKey>Container</StyleColKey>
        <StyleColValue>
          {taskInfo.containers?.length > 0 ? (
            <Table
              rowKey="index"
              bordered
              columns={columns}
              dataSource={taskInfo.containers.map((container, index) => ({
                index,
                ...container,
              }))}
              pagination={false}
              scroll={{ x: true }}
            />
          ) : (
            '--'
          )}
        </StyleColValue>
      </StyleRow>
    </>
  )
}

export default PreviewTaskContent
