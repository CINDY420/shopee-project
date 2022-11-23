import { atom, selectorFamily } from 'recoil'

import { ICluster } from 'api/types/cluster/cluster'
import { IListParam } from 'api/types/common'
import { clustersControllerGetClusterInfo, clustersControllerListClustersInfo } from 'swagger-api/v3/apis/Cluster'

export const selectedCluster = atom<ICluster>({
  key: 'selectedCluster',
  default: {}
})

// demo
export const clustersSelector = selectorFamily<Array<ICluster>>({
  key: 'clustersSelector',
  get: ({ offset, limit, orderBy, filterBy }: IListParam) => async ({ get }) => {
    const { clusters, totalCount } = await clustersControllerListClustersInfo({ offset, limit, orderBy, filterBy })

    return { clusters, totalCount }
  }
})

// demo
export const selectedClusterSelector = selectorFamily<ICluster>({
  key: 'selectedClusterSelector',
  get: ({ get }) => {
    const currentSelectedCluster = get(selectedCluster)

    return currentSelectedCluster
  },
  set: ({ name }: { name: string } = { name: '' }) => async ({ get, set }) => {
    const currentSelectedCluster = await clustersControllerGetClusterInfo({ clusterName: name })

    set(selectedCluster, currentSelectedCluster)
  }
})
