import { atom } from 'recoil'

import { IClusterList } from 'api/types/cluster/cluster'

export const clusterTree = atom<IClusterList>({
  key: 'clusterTree',
  default: []
})
