import { atom } from 'recoil'

import { INodeList } from 'api/types/cluster/node'

export const selectedClusterNodeList = atom<INodeList>({
  key: 'selectedClusterNodeList',
  default: {}
})
