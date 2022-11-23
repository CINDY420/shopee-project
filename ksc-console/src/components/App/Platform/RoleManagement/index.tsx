import * as React from 'react'

import { StyledInput, StyledButton } from './style'
import { Row, Col, Space, Tag } from 'infrad'
import { SearchOutlined } from 'infra-design-icons'
import { Table } from 'common-styles/table'
import { VerticalDivider } from 'common-styles/divider'

interface IMockRoleManagementData {
  /* eslint-disable @typescript-eslint/naming-convention -- for mock  */
  Role: string
  Description: string
  Permissions: string
  /* eslint-enable @typescript-eslint/naming-convention  */
}

const RoleManagement: React.FC = () => {
  const [searchValue, setSearchValue] = React.useState('')

  // TODO:删除测试数据@wenwen.wu.shopee.com
  const roleManagementDataList: Array<IMockRoleManagementData> = []
  for (let i = 0; i < 20; i++)
    roleManagementDataList.push({
      /* eslint-disable @typescript-eslint/naming-convention -- for mock  */
      Role: 'Platform Admin',
      Description: 'this is a description...',
      Permissions: 'this is a description...',
    })
  /* eslint-enable @typescript-eslint/naming-convention  */

  const columns = [
    {
      title: 'Role',
      key: 'role',
      dataIndex: 'Role',
      render: (text, record) => <Tag>{record.Role}</Tag>,
    },
    {
      title: 'Description',
      key: 'description',
      dataIndex: 'Description',
    },
    {
      title: 'Permissions',
      key: 'permissions',
      dataIndex: 'Permissions',
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      render: () => (
        <Space size={16}>
          <StyledButton type="link">Edit</StyledButton>
          <StyledButton type="link">Delete</StyledButton>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Row justify="space-between">
        <Col>
          <StyledInput
            value={searchValue}
            allowClear
            placeholder="Search..."
            onChange={(event) => setSearchValue(event.target.value)}
            suffix={<SearchOutlined />}
          />
        </Col>
        <Col>
          <StyledButton type="primary" width="89px">
            Add Role
          </StyledButton>
        </Col>
      </Row>
      <VerticalDivider size="24px" />
      <Table dataSource={roleManagementDataList} columns={columns} />
    </>
  )
}

export default RoleManagement
