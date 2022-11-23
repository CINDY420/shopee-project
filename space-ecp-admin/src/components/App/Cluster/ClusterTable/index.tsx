import React, { useState } from 'react'
import {
  StyledLayout,
  ContentWrapper,
  StyledContent,
  StyledPageHeader,
} from 'src/common-styles/layout'
import { Button, Input, Dropdown, Menu } from 'infrad'

import { SearchWrapper } from 'src/components/App/Cluster/ClusterTable/style'
import { Link } from 'react-router-dom'
import { ADD_EKS_CLUSTER, ADD_OTHER_CLUSTER } from 'src/constants/routes/routes'
import CommonClusterTable from 'src/components/Common/ClusterTable'

const addNewClusterMenu = (
  <Menu
    items={[
      {
        key: 'eks-cluster',
        label: <Link to={ADD_EKS_CLUSTER}>EKS Cluster</Link>,
      },
      {
        key: 'other-cluster',
        label: <Link to={ADD_OTHER_CLUSTER}>Other Cluster</Link>,
      },
    ]}
  />
)

const ClusterTable: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>()

  return (
    <StyledLayout>
      <StyledPageHeader
        title="Cluster"
        extra={[
          <Dropdown key="add-new-cluster" overlay={addNewClusterMenu} trigger={['click']}>
            <Button type="primary" key="add-new-cluster">
              Add New Cluster
            </Button>
          </Dropdown>,
        ]}
      />
      <ContentWrapper>
        <StyledContent>
          <SearchWrapper>
            <Input.Search
              allowClear
              onSearch={(value) => setSearchValue(value)}
              style={{ width: 400 }}
              placeholder="Search by Display Name/Cluster ID"
            />
          </SearchWrapper>
          <CommonClusterTable searchValue={searchValue} />
        </StyledContent>
      </ContentWrapper>
    </StyledLayout>
  )
}

export default ClusterTable
