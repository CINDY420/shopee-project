import * as React from 'react'
import { Card } from 'infrad'
import { Table } from 'src/common-styles/table'
import { Container } from 'src/components/Deployment/Action/Rollback'
import { map, merge, keyBy, values, isEqual } from 'lodash'

interface IRollbackContainerPreview {
  name: string
  currentTag: string
  targetTag: string
}

interface IContainerTableProps {
  currentContainers: Container[]
  targetContainers: Container[]
}

const ContainerTable: React.FC<IContainerTableProps> = ({
  currentContainers,
  targetContainers,
}) => {
  const dataSource: IRollbackContainerPreview[] = values(
    merge(
      keyBy(
        map(currentContainers, (container) => {
          const { name, tag } = container
          return {
            name,
            currentTag: tag,
          }
        }),
        'name',
      ),
      keyBy(
        map(targetContainers, (container) => {
          const { name, tag } = container
          return {
            name,
            targetTag: tag,
          }
        }),
        'name',
      ),
    ),
  )

  const columns = [
    {
      title: 'Container',
      dataIndex: 'name',
      render: (value: string) => <span>{value}</span>,
      key: 'name',
      width: 290,
    },
    {
      title: 'Current Tag',
      dataIndex: 'currentTag',
      render: (value: string) => <span>{value}</span>,
      key: 'currentTag',
      width: 169,
    },
    {
      title: 'Target Tag',
      dataIndex: 'targetTag',
      render: (value: string, record: IRollbackContainerPreview) => {
        const { currentTag, targetTag } = record
        const isChanged = !isEqual(currentTag, targetTag)
        return <span style={{ color: isChanged ? '#EE4D2D' : '#333333' }}>{value}</span>
      },
      key: 'targetTag',
      width: 160,
    },
  ]

  return (
    <Card
      bordered={false}
      style={{
        width: '100%',
        padding: '24px 60px',
        background: '#fafafa',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <Table columns={columns} dataSource={dataSource} pagination={false} bordered rowKey="name" />
    </Card>
  )
}
export default ContainerTable
