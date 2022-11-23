import React from 'react'
import { Tag, Space } from 'infrad'
import { Table } from 'src/common-styles/table'
import { ColumnsType } from 'infrad/lib/table'
import { IModels } from 'src/rapper/request'
import { EMPTY_PLACEHOLDER } from 'src/components/Container/SduTable'

export type Deployment =
  IModels['GET/api/ecp-cmdb/services/{serviceName}/sdus']['Res']['items'][0]['deployments'][0]

interface IEditFormTableProps {
  deployments: Deployment[]
  onGetFormValues: (deployIds: string[]) => void
  selectedDeploymentIds: string[]
}

export const columns: ColumnsType<Deployment> = [
  {
    title: 'AZ',
    dataIndex: 'azV1',
  },
  {
    title: 'WorkloadType & Orchestrator',
    dataIndex: 'componentType',
    render: (componentType: string, record) => {
      const { status } = record
      const { orchestrator } = status
      return (
        <>
          {componentType || EMPTY_PLACEHOLDER}
          <br />
          {orchestrator && <Tag>{orchestrator}</Tag>}
        </>
      )
    },
  },
  {
    title: 'Strategy',
    dataIndex: ['status', 'containers'],
    key: 'containers',
    render: (containers: Deployment['status']['containers']) => {
      const phases = containers.map((container) => container.phase)
      const deduplicatedPhases = Array.from(new Set(phases))
      return (
        <Space size={4}>
          {deduplicatedPhases.map((phase, index) => (
            <Space size={4} key={phase}>
              {phase}
              {index !== deduplicatedPhases.length - 1 && <span>/</span>}
            </Space>
          ))}
        </Space>
      )
    },
  },
]

const EditFormTable: React.FC<IEditFormTableProps> = (props) => {
  const { deployments, onGetFormValues: getFormValues, selectedDeploymentIds } = props

  const handleSelectRows = (newSelectedRows: string[]) => {
    getFormValues(newSelectedRows)
  }

  const rowSelection = {
    onChange: handleSelectRows,
    selectedRowKeys: selectedDeploymentIds,
  }

  return (
    <Table
      rowKey="deployId"
      columns={columns}
      dataSource={deployments}
      pagination={false}
      rowSelection={rowSelection}
      bordered
    />
  )
}

export default EditFormTable
