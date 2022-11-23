import * as React from 'react'

import { Table } from 'common-styles/table'
import { IPod } from 'api/types/application/pod'
import { ColumnsType } from 'infrad/lib/table'
import { Tag } from 'infrad'

import { Header, Title } from './style'

interface IVolumesProps {
  pod: IPod
}

const columns: ColumnsType = [
  {
    title: 'Volume Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Volume Type',
    dataIndex: 'type',
    key: 'type'
  },
  {
    title: 'Source',
    dataIndex: 'source',
    key: 'source'
  },
  {
    title: 'Mount Point',
    dataIndex: 'mountPoint',
    key: 'mountPoint'
  },
  {
    title: 'Read-Only',
    dataIndex: 'readonly',
    key: 'readonly',
    render: (readonly: string) => <Tag>{readonly}</Tag>
  }
]

const Volumes: React.FC<IVolumesProps> = ({ pod }) => {
  const { volumes } = pod

  return (
    <>
      <Header>
        <Title>Volumes</Title>
      </Header>
      <Table rowKey='name' columns={columns} dataSource={volumes} pagination={false} />
    </>
  )
}

export default Volumes
