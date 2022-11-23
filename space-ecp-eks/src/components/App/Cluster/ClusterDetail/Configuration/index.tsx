import React, { ReactNode } from 'react'
import { Root } from 'src/components/App/Cluster/ClusterDetail/Configuration/style'
import SecretTable from 'src/components/App/Cluster/ClusterDetail/Configuration/SecretTable'
import { StyledTabs } from 'src/components/App/Cluster/ClusterDetail/common-styles/tabs'

const tabs: { title: string; key: string; component: ReactNode }[] = [
  {
    title: 'Secret',
    key: 'Secret',
    component: <SecretTable />,
  },
]
const defaultSelectedTabKey = 'Secret'

const Configuration: React.FC = () => (
  <Root>
    <StyledTabs defaultActiveKey={defaultSelectedTabKey}>
      {tabs.map(({ title, component, key }) => (
        <StyledTabs.TabPane tab={title} key={key}>
          {component}
        </StyledTabs.TabPane>
      ))}
    </StyledTabs>
  </Root>
)

export default Configuration
