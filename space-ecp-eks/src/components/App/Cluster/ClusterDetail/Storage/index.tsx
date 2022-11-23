import React from 'react'
import { Card, Tabs } from 'infrad'
import PVCTable from 'src/components/App/Cluster/ClusterDetail/Storage/PVCTable'
import PVTable from 'src/components/App/Cluster/ClusterDetail/Storage/PVTable'
import { StyledTabs } from 'src/components/App/Cluster/ClusterDetail/common-styles/tabs'

const { TabPane } = Tabs

const Storage: React.FC = () => (
  <Card style={{ margin: '24px' }}>
    <StyledTabs defaultActiveKey="pvc">
      <TabPane tab="PVC" key="pvc">
        <PVCTable />
      </TabPane>
      <TabPane tab="PV" key="pv">
        <PVTable />
      </TabPane>
    </StyledTabs>
  </Card>
)
export default Storage
