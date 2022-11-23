import * as React from 'react'
import { CaretRightOutlined, CaretDownOutlined } from 'infra-design-icons'
import history from 'helpers/history'
import { Tooltip } from 'infrad'

import ClusterList from '../ClusterList'
import { Table } from 'common-styles/table'

import { useRecoilValue } from 'recoil'
import { selectedTenant } from 'states/applicationState/tenant'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'

import { StyledTag } from './style'

interface IProjectsTableProps {
  onTableChange: any
  listProjectsState: any
  pagination: any
}

const ProjectsTable: React.FC<IProjectsTableProps> = ({ onTableChange, listProjectsState, pagination }) => {
  const group = useRecoilValue(selectedTenant)
  const { cids = [], envs = [], clusters = [] } = group || {}
  const { projects = [], totalCount, tenantId } = listProjectsState.value || {}

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
      render: (name: string) => (
        <a
          style={{ color: '#333', fontWeight: 500 }}
          onClick={() => {
            history.push(`/applications/tenants/${tenantId}/projects/${name}`)
          }}
        >
          {name}
        </a>
      )
    },
    {
      title: 'Environment',
      dataIndex: 'envs',
      key: 'envs',
      filters: envs.map((item: string) => ({ text: item, value: item })),
      render: (_, record: any) => (record.envs ? record.envs.join(', ') : '-')
    },
    {
      title: 'CID',
      dataIndex: 'cids',
      key: 'cids',
      filters: cids.map((item: string) => ({ text: item, value: item })),
      render: (_, record: any) => (record.cids ? record.cids.join(', ') : '-')
    },
    {
      title: 'Clusters',
      dataIndex: 'clusters',
      key: 'clusters',
      filters: clusters.map((item: string) => ({ text: item, value: item })),
      render: (_, record: any) =>
        record.clusters
          ? record.clusters.map((cluster, index) => (
              <Tooltip key={`${cluster}-${index}`} title={cluster} getPopupContainer={() => document.body}>
                <StyledTag>{cluster}</StyledTag>
              </Tooltip>
            ))
          : '-'
    }
  ]

  return (
    <Table
      rowKey='name'
      columns={columns}
      loading={listProjectsState.loading}
      dataSource={projects}
      onChange={onTableChange}
      expandable={{
        expandedRowRender: (record: any, _index, _indent, expanded: boolean) =>
          expanded && <ClusterList tenantId={tenantId} projectName={record.name} />,
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
            <CaretDownOutlined onClick={e => onExpand(record, e)} />
          ) : (
            <CaretRightOutlined onClick={e => onExpand(record, e)} />
          )
      }}
      pagination={{
        ...pagination,
        ...TABLE_PAGINATION_OPTION,
        total: totalCount
      }}
    />
  )
}

export default ProjectsTable
