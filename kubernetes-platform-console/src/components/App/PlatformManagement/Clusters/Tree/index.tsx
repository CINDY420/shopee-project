import * as React from 'react'
import { Spin, Tree } from 'infrad'
import { matchPath } from 'react-router'

import history from 'helpers/history'
import { useRecoilValue, useRecoilState } from 'recoil'
import { selectedCluster } from 'states/clusterState'
import { clusterTree } from 'states/clusterState/tree'
import useAsyncFn from 'hooks/useAsyncFn'
import { ICluster } from 'api/types/cluster/cluster'
import { clustersControllerListClustersInfo } from 'swagger-api/v3/apis/Cluster'
import { VerticalDivider } from 'common-styles/divider'
import { CLUSTERS, PLATFORMS, TENANTS } from 'constants/routes/routes'
import { DirectoryTreeWrapper } from 'common-styles/directoryWrapper'

import { SpinWrapper } from './style'

const { DirectoryTree } = Tree

const ClusterTree: React.FC<{ location: any }> = ({ location }) => {
  const currentSelectedCluster = useRecoilValue(selectedCluster)
  const [selectedKeys, setSelectedKeys] = React.useState([])
  const [clusters, setClusters] = useRecoilState(clusterTree)
  const [clustersFnState, clustersFn] = useAsyncFn(clustersControllerListClustersInfo)

  const fetchClusterTree = async () => {
    // get all cluster
    const { clusters } = await clustersFn({ offset: 0, limit: 1000 })

    setClusters(clusters || [])
  }

  React.useEffect(() => {
    fetchClusterTree()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    const paths = [CLUSTERS, PLATFORMS, TENANTS]

    paths.forEach(path => {
      const match = matchPath(location.pathname, { path })
      if (match && match.isExact) {
        setSelectedKeys([path])
      }
    })
  }, [location])

  React.useEffect(() => {
    const { name } = currentSelectedCluster

    if (name) {
      setSelectedKeys([`${CLUSTERS}/${name}`])
    }
  }, [currentSelectedCluster])

  const { loading } = clustersFnState

  return loading ? (
    <SpinWrapper>
      <VerticalDivider size='100px' />
      <Spin />
    </SpinWrapper>
  ) : (
    <DirectoryTreeWrapper>
      <DirectoryTree
        style={{ width: '100%' }}
        showIcon={false}
        defaultSelectedKeys={selectedKeys}
        defaultExpandedKeys={[CLUSTERS]}
        selectedKeys={selectedKeys}
        onSelect={(selectedKeys: string[]) => {
          const selectedKey = selectedKeys[0]

          if (selectedKey) {
            setSelectedKeys([selectedKey])
            history.push(selectedKey)
          }
        }}
        treeData={[
          {
            title: 'Cluster Management',
            key: `${CLUSTERS}`,
            children: clusters.map((item: ICluster) => {
              return {
                title: item.name,
                key: `${CLUSTERS}/${item.name}`
              }
            })
          },
          {
            title: 'Platform Management',
            key: PLATFORMS
          },
          {
            title: 'Tenant Management',
            key: TENANTS
          }
        ]}
        expandAction='doubleClick'
      />
    </DirectoryTreeWrapper>
  )
}

export default ClusterTree
