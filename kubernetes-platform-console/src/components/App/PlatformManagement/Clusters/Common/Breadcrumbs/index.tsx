import * as React from 'react'
import BreadcrumbsBanner from 'components/Common/BreadcrumbsBanner'
import history from 'helpers/history'

import { selectedCluster } from 'states/clusterState'
import { selectedNode } from 'states/clusterState/node'
import { useRecoilValue } from 'recoil'
import { CLUSTERS, CLUSTER_DETAIL, NODE_DETAIL } from 'constants/routes/routes'

enum CrumbType {
  CLUSTER_LIST = 'Cluster List',
  CLUSTER = 'Cluster',
  NODE = 'Node'
}

const routeCrumbsTree = [
  {
    route: CLUSTERS,
    extendedCrumbs: CrumbType.CLUSTER_LIST,
    children: [
      {
        route: CLUSTER_DETAIL,
        extendedCrumbs: CrumbType.CLUSTER,
        children: [
          {
            route: NODE_DETAIL,
            extendedCrumbs: CrumbType.NODE
          }
        ]
      }
    ]
  }
]

const crumbLookup = {
  [CrumbType.CLUSTER_LIST]: {
    desc: 'Cluster List',
    onClick: () => {
      history.push(`${CLUSTERS}`)
    }
  },
  [CrumbType.CLUSTER]: {
    desc: 'Cluster: ',
    onClick: cluster => {
      history.push(`${CLUSTERS}/${cluster.name}`)
    }
  },
  [CrumbType.NODE]: {
    desc: 'Node: '
  }
}

const Breadcrumbs: React.FC<{}> = () => {
  const currentSelectedCluster = useRecoilValue(selectedCluster)
  const currentSelectedNode = useRecoilValue(selectedNode)

  return (
    <BreadcrumbsBanner
      crumbLookup={crumbLookup}
      crumbResourceLookup={{
        [CrumbType.CLUSTER]: currentSelectedCluster,
        [CrumbType.NODE]: currentSelectedNode
      }}
      routeCrumbsTree={routeCrumbsTree}
    />
  )
}

export default Breadcrumbs
