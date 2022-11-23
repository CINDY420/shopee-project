import * as React from 'react'
import { useRecoilState } from 'recoil'

import { clusterTree } from 'states/clusterState/tree'
import { clustersControllerListClustersInfo } from 'swagger-api/v3/apis/Cluster'

/**
 * Update the value of clusterTree in recoil
 * @return A function, updateClusterToTreeFn, which should be invoked when the cluster changes
 */

const useUpdateClusterToTree = () => {
  const [tree, setTree] = useRecoilState(clusterTree)

  const updateClusterToTreeFn = React.useCallback(async () => {
    const { clusters } = await clustersControllerListClustersInfo({ offset: 0, limit: 1000 })

    setTree(clusters)
    return clusters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree])

  return updateClusterToTreeFn
}

export default useUpdateClusterToTree
